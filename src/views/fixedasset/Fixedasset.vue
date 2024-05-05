<template>
    <div style="height: auto; width: auto;">
        <!-- 搜素和新增区域 -->
        <el-card>
            <div style="display: flex; flex-direction: row;">
                <!-- 搜索区域 -->

                <el-form :inline="true">
                    <el-form-item label="资产名称">
                        <el-input v-model="params.assetName" placeholder="请输入资产名称"></el-input>
                    </el-form-item>
                    <el-form-item label="资产类型">
                        <el-input v-model="params.brandModel" placeholder="请输入资产类型"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                    <!-- <el-button type="primary" @click="addOpen">新增固定资产</el-button> -->
                </el-form>
            </div>
        </el-card>
        <!-- 固定资产表 -->
        <el-card style="margin-top: 20px;">

            <el-card>
                <span style="font-size: 16px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">固定资产表</span>
            </el-card>

            <el-table :data="list" border style="width: 100%">
                <el-table-column prop="assetID" label="序号" width="50"> </el-table-column>
                <el-table-column prop="assetNumber" label="资产编号"> </el-table-column>
                <el-table-column prop="assetName" label="资产名称"> </el-table-column>
                <el-table-column prop="brandModel" label="资产类型"> </el-table-column>
                <el-table-column prop="description" label="品牌型号"> </el-table-column>
                <el-table-column prop="ctime" label="开始使用时间"> </el-table-column>
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
            // 控制弹框的显示与隐藏
            dialogFormVisible: false,

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
                url: "/fixedasset",
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