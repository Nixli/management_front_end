<template>
    <div style="height: auto; width: auto;">

        <!-- 搜素和新增区域 -->
        <el-card>
            <div>
                <el-row :gutter="20">
                    <!-- 搜索区域 -->
                    <el-col :span="23">
                        <el-form :inline="true" style="margin-top: 20px;">
                            <el-form-item label="根据月份查询">
                                <el-date-picker v-model="params.assetName" type="date" placeholder="开始日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-date-picker v-model="params.brandModel" type="date" placeholder="截止日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="search()" type="primary" icon="el-icon-search">搜索</el-button>
                            </el-form-item>
                            <el-button type="primary" @click="addOpen"><i
                                    class="el-icon-circle-plus-outline el-icon--left"></i>新增员工工资信息
                            </el-button>
                        </el-form>
                    </el-col>
                    <el-col :span="1">
                        <el-popover placement="top-start" title="工资与保险的介绍" width="200" trigger="hover" content="实际工资=基本工资
                        +绩效工资+奖金+津贴+补贴-扣款-个人所得税扣款-保险">
                            <i class="el-icon-info" style="font-size: 24px; margin-top: 25px;" slot="reference"></i>
                        </el-popover>


                    </el-col>
                </el-row>
            </div>
            
        </el-card>

        <!-- 员工工资表 -->
        <el-card style="margin-top: 20px;">

            <el-card>
                <span style="font-size: 16px;font-weight: bold;">员工工资表</span>
            </el-card>

            <el-table :data="list" border style="width: 100%">
                <el-table-column prop="employee.employeeDes" label="姓名" width="70" align="center"
                    fixed="left"></el-table-column>
                <el-table-column prop="baseSalary" label="基本工资" align="center"> </el-table-column>
                <el-table-column prop="allowance" label="津贴" align="center"> </el-table-column>
                <el-table-column prop="bonus" label="奖金" align="center"> </el-table-column>
                <el-table-column prop="subsidy" label="补助" align="center"> </el-table-column>
                <el-table-column prop="deduction" label="扣款" align="center"> </el-table-column>
                <el-table-column prop="personalIncomeTax" label="个税" align="center"> </el-table-column>
                <el-table-column prop="insurance" label="保险金额" align="center"> </el-table-column>
                <el-table-column prop="actualSalary" label="实发工资" align="center">
                </el-table-column>
                <el-table-column prop="payoutDate" label="发放日期" align="center">
                    <template #default="{ row }">
                        <div>
                            <i class="el-icon-time "></i> {{ row.payoutDate }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="生成凭证" align="center">
                    <template #default="{ row }">
                        <el-button v-if="row.isToVoucher === '否'" type="text" size="medium" icon="el-icon-document"
                            @click="updateApprovalStatus(row)">生成凭证</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <el-pagination @current-change="pagechange" background layout="prev, pager, next" :total="total"
                :page-size="pagesize" style="text-align: center; margin-top: 10px;">
            </el-pagination>
        </el-card>

        <!-- 弹窗区域 -->
        <el-dialog :title="actionType == 'add' ? '新增员工工资信息' : '编辑员工工资信息'" :visible.sync="dialogFormVisible"
            width="700px" style="font-size: 24px;">


            <el-form :model="userFormData" class="demo-form-inline" label-width="100px">

                <!-- 第一行 -->
                <el-form-item label="员工姓名">
                    <el-select v-model="selectedEmployee" placeholder="选择员工" clearable :disabled="actionType === 'edit'"
                        size="medium">
                        <el-option :label="employee.employeeDes" :value="employee.employeeID" :key="employee.employeeID"
                            v-for="employee in employeeList" />
                    </el-select>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="基本工资">
                            <el-input-number v-model="userFormData.baseSalary" placeholder="基本工资"
                                controls-position="right" size="medium"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="津贴">
                            <el-input-number v-model="userFormData.allowance" placeholder="津贴" controls-position="right"
                                size="medium"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 第二行 -->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="奖金">
                            <el-input-number v-model="userFormData.bonus" placeholder="奖金" controls-position="right"
                                size="medium">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="补助">
                            <el-input-number v-model="userFormData.subsidy" placeholder="补助" controls-position="right"
                                size="medium"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="扣款">
                            <el-input-number v-model="userFormData.deduction" placeholder="扣款" controls-position="right"
                                size="medium"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="个税">
                            <el-input-number disabled v-model="userFormData.personalIncomeTax" placeholder="个税"
                                controls-position="right" size="medium"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="保险金额">
                            <el-input-number disabled v-model="userFormData.insurance" placeholder="保险金额"
                                controls-position="right" size="medium"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="实发工资">
                            <el-input-number disabled v-model="userFormData.actualSalary" placeholder="实发工资"
                                controls-position="right" size="medium"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item>
                    <el-button @click="submit" style="width: 180px; margin-left: 110px" type="primary">提交<i
                            class="el-icon-success el-icon--right"></i></el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script>

import axios from "axios";
import dayjs from "dayjs";
import '@fortawesome/fontawesome-free/css/all.css';
import { Row } from "element-ui";
import { Message } from 'element-ui'
export default {

    data() {
        return {
            text:'付',
            summary:'工资',
            salaryID:'',
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
            userFormData: {

                baseSalary: 0.00,
                allowance: 0.00,
                bonus: 0.00,
                subsidy: 0.00,
                deduction: 0.00,
                personalIncomeTax: 0.00,
                insurance: 0.00,
                actualSalary: 0.00
            },
            bookID: 0,
            employeeID: '',
            actionType: '',
            salaryID: '',
            dialogFormVisible: false,
            employeeList: [],
            selectedEmployee: ''
        };
    },
    created() {
        this.bookID = localStorage.getItem('bookID');
        this.getList()
    },

    methods: {

        async updateApprovalStatus(row) {
            console.log(row)
            const data = {
                salaryId: row.salaryId,
                isToVoucher: "是"
            }
            const res = await axios({
                url: "http://localhost:8080/salary/update",
                method: "post",
                data: data
            })
            // this.getList()
            localStorage.setItem('summary', this.summary)
            localStorage.setItem('debitAmount', row.actualSalary)
            localStorage.setItem('text',this.text)
            // 等待两秒后跳转页面
            Message.success('即将进入凭证界面')
            setTimeout(() => {
                // 跳转页面
                this.$router.push('/voucher/Voucher?type=1');
            }, 1000);
        },

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
                    bookID: this.bookID,
                    ...formattedParams
                },
            });
            // 修改日期格式
            this.list = res.data.data.map(item => {
                return {
                    ...item,
                    baseSalary: parseFloat(item.baseSalary),
                    allowance: parseFloat(item.allowance),
                    bonus: parseFloat(item.bonus),
                    subsidy: parseFloat(item.subsidy),
                    deduction: parseFloat(item.deduction),
                    personalIncomeTax: parseFloat(item.personalIncomeTax),
                    actualSalary: parseFloat(item.actualSalary),
                    insurance: parseFloat(item.insurance),
                    // 其他字段...
                    payoutDate: dayjs(item.payoutDate).format('YYYY-MM-DD'),
                };
            });
            /* console.log(this.list) */
            this.total = res.data.count;

            const employeeListRes = await axios({
                url: "http://localhost:8080/employee/queryAllEmployeeInformationByBookID",
                method: "get",
                params: {
                    bookID: this.bookID
                }
            })
            this.employeeList = employeeListRes.data.data
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
            this.dialogFormVisible = true;
            // 记录状态
            this.actionType = 'add';
            this.userFormData = {
                baseSalary: 0.00,
                allowance: 0.00,
                bonus: 0.00,
                subsidy: 0.00,
                deduction: 0.00,
                personalIncomeTax: 0.00,
                insurance: 440.00,
                actualSalary: 0.00
            };
            this.employeeID = this.selectedEmployee;
            this.selectedEmployee = ''
        },
        //修改弹窗
        edit(row) {
            // 打开弹窗
            this.dialogFormVisible = true
            // 数据回显
            this.userFormData.baseSalary = row.baseSalary
            this.userFormData.allowance = row.allowance
            this.userFormData.bonus = row.bonus
            this.userFormData.subsidy = row.subsidy
            this.userFormData.deduction = row.deduction
            this.userFormData.personalIncomeTax = row.personalIncomeTax
            this.userFormData.actualSalary = row.actualSalary
            this.userFormData.insurance = row.insurance
            this.selectedEmployee = row.employee.employeeID
            // 记录id
            this.salaryID = row.salaryID
            this.employeeID = this.selectedEmployee
            console.log(this.salaryID)
            console.log(row)
            // 记录动作
            this.actionType = 'edit'
        },

        calculatePersonalIncomeTax() {
            /* console.log('计算工资') */
            // 先从 userFormData 中获取其他输入项的值

            const { baseSalary, allowance, bonus, subsidy, deduction, insurance } = this.userFormData;

            // 计算总收入
            const totalIncome = baseSalary + allowance + bonus + subsidy - deduction;

            // 计算税前应纳税额
            const taxableIncome = totalIncome - 5000;

            // 根据不同的情况计算 personalIncomeTax
            if (taxableIncome > 0 && taxableIncome <= 5000) {
                this.userFormData.personalIncomeTax = taxableIncome * 0;
            } else if (taxableIncome > 5000 && taxableIncome <= 8000) {
                this.userFormData.personalIncomeTax = taxableIncome * 0.03;
            } else if (taxableIncome > 8000 && taxableIncome <= 17000) {
                this.userFormData.personalIncomeTax = parseFloat((taxableIncome * 0.1).toFixed(2));
            } else if (taxableIncome > 17000) {
                this.userFormData.personalIncomeTax = taxableIncome * 0.2;
            }/* 
            console.log(this.userFormData, '______'); */
            const actualSalary = totalIncome - this.userFormData.personalIncomeTax - insurance;
            this.userFormData.actualSalary = actualSalary
        },
        async deleteSalary(id) {
            const data = {
                salaryID: id
            }
            const res = await axios({
                url: '/deleteSalary',
                method: 'post',
                data: data
            })
            this.getList()
        },

        async submit() {
            const data = {
                ...this.userFormData,
                isToVoucher:'否',
                bookID:this.bookID,
                payoutDate:new Date(),
                createDate:new Date(),
            }
            data.employeeID = this.selectedEmployee ;
            if (this.actionType === 'edit') {
                data.salaryID = this.salaryID
            }
            const res = await axios({
                url: 'http://localhost:8080/salary/insert',
                method: 'post',
                data: data
            })
            this.dialogFormVisible = false
            this.getList()
        }
    },
    watch: {
        userFormData: {
            handler() {
                /* console.log('数据发生变化了！！！') */
                this.calculatePersonalIncomeTax()
            },
            deep: true
        }
    }
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