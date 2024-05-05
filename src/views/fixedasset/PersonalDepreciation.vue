<template>
    <div style="height: auto; width: auto;">

        <!-- ！！！！！！固定资产折旧！！！！！ -->
        <!-- 搜索新增区域 -->
        <el-card>
            <div style="display: flex; flex-direction: row;">
                <!-- 搜索区域 -->
                <div style="flex: 8;">
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
                        <el-button type="primary" @click="addOpen">新增折旧申请</el-button>
                    </el-form>
                </div>

            </div>
        </el-card>

        <!-- 折旧明细表 -->
        <el-card style="margin-top: 20px;">

            <el-card>
                <span style="font-size: 16px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">折旧明细表</span>
            </el-card>

            <el-table :data="list"  style="width: 100%">
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
                <el-table-column fixed="right" label="流程">
                    <template #default="{ row }">
                        <!-- 在这里使用 row 对象，表示整行的数据 -->
                        <el-button type="text" size="small" @click="process(row)">审批流程</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!-- 分页组件 -->
            <el-pagination @current-change="pagechange" background layout="prev, pager, next" :total="total"
                :page-size="pagesize" style="text-align: center; margin-top: 10px;">
            </el-pagination>
        </el-card>

        <!-- 弹窗区域 -->
        <el-dialog :title="actionType == 'add' ? '新增折旧明细' : '编辑折旧明细'" :visible.sync="dialogFormVisible">
            <el-form :model="userFormData" class="demo-form-inline" label-width="120px">

                <el-form-item label="资产名称">
                    <el-input v-model="userFormData.assetName" placeholder="资产名称"></el-input>
                </el-form-item>

                <el-form-item label="资产类型">
                    <el-input v-model="userFormData.brandModel" placeholder="资产类型"></el-input>
                </el-form-item>

                <el-form-item label="品牌型号">
                    <el-input v-model="userFormData.description" placeholder="品牌型号"></el-input>
                </el-form-item>

                <el-form-item label="资产原值">
                    <el-input v-model="userFormData.originalValue" placeholder="资产原值"></el-input>
                </el-form-item>
                <el-form-item label="折旧月份">
                    <el-input-number v-model="userFormData.netValue" placeholder="折旧月份"></el-input-number>
                </el-form-item>
                <el-form-item label="每月折旧">
                    <el-input-number v-model="userFormData.depreciationAmount" placeholder="每月折旧"></el-input-number>
                </el-form-item>

                <el-form-item>
                    <el-button @click="submit">提交</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

        <el-dialog title="折旧流程" :visible.sync="isShow">
            <div class="block">
                <el-timeline>
                    <el-timeline-item :timestamp="DeclarationDate" placement="top">
                        <el-card>
                            <p>员工 {{ name }} 提交申请于 {{ DeclarationDate }}</p>
                        </el-card>
                    </el-timeline-item>
                    <el-timeline-item v-if="curState != '待审核'" :timestamp="ReviewDate" placement="top">
                        <el-card>
                            <p>老板 审核申请于 {{ ReviewDate }}</p>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </el-dialog>


    </div>
</template>

<script>

import axios from "axios";
import dayjs from "dayjs";

export default {

    data() {
        return {
            DeclarationDate: '',
            ReviewDate: '',
            role: localStorage.getItem('role'),
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
            // 新增表单的数据
            userFormData: {
                assetNumber: '',
                assetName: '',
                brandModel: '',
                description: '',
                originalValue: '',
                netValue: '',
                depreciationAmount: '',
                accountBook: { bookID: localStorage.getItem('bookID') }, // 使用关系属性名
                employee: { employeeID: localStorage.getItem('employeeID') }
            },
            // add： 新增   edit: '更新'
            actionType: '',
            id: '',
            bookID: localStorage.getItem('bookID'),
            employeeID: localStorage.getItem('employeeID'),
            isShow: false,
            name: '',
            curState: ''
        };
    },
    created() {
        this.getList();
        this.name = localStorage.getItem('name')
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
                    employeeID: this.employeeID,
                    ...this.params,
                },
            });

            // 修改日期格式
            this.list = res.data.data.list.map(item => {
                return {
                    ...item,
                    ctime: dayjs(item.ctime).format('YYYY-MM-DD'),
                    utime: dayjs(item.utime).format('YYYY-MM-DD'),
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
        // 打开新增弹窗，
        addOpen() {
            // 打开弹窗
            this.dialogFormVisible = true
            // 记录状态
            this.actionType = 'add'
            // 重置userFormData
            this.userFormData = {
                assetNumber: '',
                assetName: '',
                brandModel: '',
                description: '',
                originalValue: '',
                netValue: '',
                depreciationAmount: '',
                accountBook: { bookID: localStorage.getItem('bookID') }, // 使用关系属性名
                employeeID: this.employeeID
            }
        },

        //新增或修改固定资产
        async submit() {
            // 拷贝userFormData到data
            const data = { ...this.userFormData }
            // 修改的时候需要把id带过去
            const res = await axios({
                url: '/depreciationDetail',
                method: 'post',
                data: data
            })
            this.dialogFormVisible = false
            this.getList()
        },
        process(row) {
            console.log(row)
            this.isShow = true
            this.DeclarationDate = row.ctime
            this.ReviewDate = row.utime
            this.curState = row.isRetired === 0 ? '待审核' : (row.isRetired === 1 ? '已通过' : '未通过')
        }
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