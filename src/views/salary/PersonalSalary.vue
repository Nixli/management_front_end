<template>
    <div style="height: auto; width: auto;">

        <!-- 搜素和新增区域 -->
        <el-card>
            <div style="display: flex; flex-direction: row;">
                <!-- 搜索区域 -->
                <div style="flex: 8;">
                    <el-form :inline="true">
                        <el-form-item label="根据月份查询">
                            <el-date-picker v-model="params.assetName" type="date" placeholder="开始日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker v-model="params.brandModel" type="date" placeholder="截止日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-card>

        <!-- 员工工资表 -->
        <el-card style="margin-top: 20px;">

            <el-card>
                <span
                    style="font-size: 16px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">员工工资表</span>
            </el-card>

            <el-table :data="list" style="width: 100%">
                <el-table-column prop="employee.employeeDes" label="姓名"> </el-table-column>
                <el-table-column prop="baseSalary" label="基本工资"> </el-table-column>
                <el-table-column prop="allowance" label="津贴"> </el-table-column>
                <el-table-column prop="bonus" label="奖金"> </el-table-column>
                <el-table-column prop="subsidy" label="补助"> </el-table-column>
                <el-table-column prop="deduction" label="扣款"> </el-table-column>
                <el-table-column prop="personalIncomeTax" label="个税"> </el-table-column>
                <el-table-column prop="insurance" label="保险"></el-table-column>
                <el-table-column prop="actualSalary" label="实发工资" align="center"></el-table-column>
                <el-table-column prop="payoutDate" label="工资发放日期">
                    <template #default="{ row }">
                        <div>
                            <i class="el-icon-time "></i> {{ row.payoutDate }}
                        </div>
                    </template> </el-table-column>
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
import dayjs from "dayjs"
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
                assetName: null,
                brandModel: null
            },
            bookID: localStorage.getItem('bookID'),
            employeeID: localStorage.getItem('employeeID')
        };
    },
    created() {
        this.getList()
    },

    methods: {
        async getList() {

            const formattedParams = {
                ...this.params,
                assetName: this.params.assetName ? dayjs(this.params.assetName).format('YYYY-MM-DD HH:mm:ss') : null,
                brandModel: this.params.brandModel ? dayjs(this.params.brandModel).format('YYYY-MM-DD HH:mm:ss') : null,
            };

            const res = await axios({
                method: "get",
                url: "http://localhost:8080/salary/findAllAndEmployee",
                params: {
                    pageno: this.pageno,
                    pagesize: this.pagesize,
                    employeeID: this.employeeID,
                    ...formattedParams,
                    bookId: this.bookID
                },
            });
            // 修改日期格式
            this.list = res.data.data.map(item => {
                return {
                    ...item,
                    payoutDate: dayjs(item.payoutDate).format('YYYY-MM-DD'),
                };
            });
            this.total = res.data.data.count;
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