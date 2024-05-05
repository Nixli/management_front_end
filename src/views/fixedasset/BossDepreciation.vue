<template>
    <div style="height: auto; width: auto;">

        <!-- 搜索新增区域 -->
        <el-card>
            <div style="display: flex; flex-direction: row;">
                <!-- 搜索区域 -->
                <div style="flex: 8;">
                    <el-form :inline="true">
                        <el-form-item label="折旧资产名称">
                            <el-input v-model="params.assetName" placeholder="请输入折旧资产名称"></el-input>
                        </el-form-item>
                        <el-form-item label="折旧资产类型">
                            <el-input v-model="params.brandModel" placeholder="请输入折旧资产类型"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-card>

        <!-- 折旧明细表 -->
        <!-- <el-card style="margin-top: 20px;">

            <el-card>
                <span
                    style="font-size: 16px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">折旧明细表</span>
            </el-card>

            <el-table :data="list" style="width: 100%">
                <el-table-column prop="assetName" label="资产名称"> </el-table-column>
                <el-table-column prop="brandModel" label="资产类型"> </el-table-column>
                <el-table-column prop="description" label="品牌型号"> </el-table-column>
                <el-table-column prop="originalValue" label="资产原值"> </el-table-column>
                <el-table-column prop="netValue" label="资产净值"> </el-table-column>
                <el-table-column prop="depreciationAmount" label="资产折旧金额"> </el-table-column>
                <el-table-column prop="ctime" label="申请日期" width="200"> </el-table-column>
                <el-table-column prop="isRetired" label="状态">
                    <template #default="{ row }">
                        {{ row.isRetired === 0 ? '待审核' : (row.isRetired === 1 ? '已通过' : '未通过') }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template #default="{ row }">
                        <el-button :disabled="row.isRetired != 0" type="text" size="small"
                            @click="pass(row.assetID, row.isRetired)">通过</el-button>
                        <el-button :disabled="row.isRetired != 0" type="text" size="small"
                            @click="refusal(row.assetID, row.isRetired)">拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>

            
            <el-pagination @current-change="pagechange" background layout="prev, pager, next" :total="total"
                :page-size="pagesize" style="text-align: center; margin-top: 10px;">
            </el-pagination>
        </el-card> -->

        <!-- 折旧明细表 -->
        <el-card style="margin-top: 20px;">

            <el-card>
                <span
                    style="font-size: 16px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">折旧明细表</span>
            </el-card>

            <el-table :data="list" style="width: 100%">
                <el-table-column type="expand">
                    <template #default="{ row }">
                        <div style="padding: 10px;">
                            <el-table :data="row.depreciationDetailContent">
                                <el-table-column label="日期" prop="netValue"></el-table-column>
                                <el-table-column label="每月折旧" prop="depreciationAmount"></el-table-column>
                            </el-table>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="assetName" label="资产名称" align="center"> </el-table-column>
                <el-table-column prop="brandModel" label="资产类型" align="center"> </el-table-column>
                <el-table-column prop="description" label="品牌型号" align="center"> </el-table-column>
                <el-table-column prop="originalValue" label="资产原值" align="center"> </el-table-column>
                <el-table-column prop="netValue" label="折旧月份" align="center"> </el-table-column>
                <el-table-column prop="depreciationAmount" label="每月折旧" align="center"> </el-table-column>
                <el-table-column prop="ctime" label="申请日期" align="center"> </el-table-column>
                <el-table-column prop="isRetired" label="状态" align="center">
                    <template #default="{ row }">
                        {{ row.isRetired === 0 ? '待审核' : (row.isRetired === 1 ? '已通过' : '未通过') }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template #default="{ row }">
                        <el-button :disabled="row.isRetired != 0" type="text" size="small"
                            @click="pass(row.assetID, row.isRetired)">通过</el-button>
                        <el-button :disabled="row.isRetired != 0" type="text" size="small"
                            @click="refusal(row.assetID, row.isRetired)">拒绝</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!-- 分页组件 -->
            <el-pagination @current-change="pagechange" background layout="prev, pager, next" :total="total"
                :page-size="pagesize" style="text-align: center; margin-top: 10px;">
            </el-pagination>
        </el-card>

    </div>
</template>

<script>

import axios from "axios";
import dayjs from "dayjs";
export default {

    data() {
        return {
            list: [],
            // 分页相关
            pageno: 1,
            pagesize: 5,
            total: 0,
            // 搜索条件
            params: {
                assetName: '',
                brandModel: ''
            },
            bookID: localStorage.getItem('bookID')
        };
    },
    created() {
        this.getList()
    },

    methods: {
        async getList() {
            const res = await axios({
                method: "get",
                url: "/depreciationDetail",
                params: {
                    pageno: this.pageno,
                    pagesize: this.pagesize,
                    bookID: this.bookID,
                    ...this.params
                },
            });
            // 修改日期格式
            this.list = res.data.data.list.map(item => {
                return {
                    ...item,
                    ctime: dayjs(item.ctime).format('YYYY-MM-DD'),
                };
            });
            this.total = res.data.data.total;
        },
        // 点击搜索
        search() {
            this.getList()
        },
        // 页码改变
        pagechange(pageno) {
            // 条件改变
            this.pageno = pageno
            // 重新请求数据
            this.getList()
        },
        //通过审核
        async pass(assetID, isRetired) {

            isRetired = 1;

            const data = {
                assetID,
                isRetired: isRetired
            }

            const res = await axios({
                url: '/updatedepreciationDetail',
                method: 'post',
                data: data
            })

            this.getList()
        },
        //拒绝审核
        async refusal(assetID, isRetired) {

            isRetired = 2;
            const data = {
                assetID,
                isRetired: isRetired
            }
            const res = await axios({
                url: 'depreciationDetail',
                method: 'post',
                data: data
            })
            this.getList()
        },
    },

}
</script>

<style lang="scss" scoped>
.row-box {
    width: 100%;
    display: flex;
    margin-top: 20px;
    margin-bottom: 8px;
    justify-content: center;
}
</style>