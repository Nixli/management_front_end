<template>
    <div>
        <el-card>
            <el-card>
                <span style="font-size: 18px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">用户报销</span>
                <el-popover placement="top-start" title="报销功能介绍" width="600" trigger="hover">
                    <el-card>
                        <span>摘要通过简要的文字描述,迅速明确交易内容，记录与该笔交易相关的业务事项</span><br>
                        <span>在后续的财务核对和审计中，摘要是查找和理解交易内容的重要依据之一。</span><br>
                        <span>清晰的摘要有助于提高财务数据的可读性和准确性。</span><br>
                    </el-card>
                    <i class="el-icon-info" style="font-size: 16px; margin-left: 10px; margin-top: 5px;"
                        slot="reference"></i>
                </el-popover>

            </el-card>
            <el-card>
                <div>
                    <el-row type="flex" justify="space-between" align="middle">
                        <el-form :inline="true">
                            <!-- 右侧部分，包括查询输入框 -->
                            <!-- 菜系下拉列表框 -->
                            <el-form-item label="该账套所有的报销类别">
                                <el-select v-model="params.category" class="filter-item" placeholder="请选择报销类别">
                                <el-option v-for="(reimbursement, index) in categoryList" :label="reimbursement.category" :value="reimbursement.category"></el-option>
                                </el-select>
                            </el-form-item>
                                <!-- 搜索按钮 -->
                            <el-form-item>
                                <el-button type="primary" @click="search">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                <!-- 左侧部分，包括新增按钮 -->
                                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addopen">新增报销</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </div>
                <el-table :data="list" style="width: 100%;margin-top: 15px;" :header-row-class-name="tableHeaderClassName">
                    <!-- <el-table-column prop="employee" label="报销员工" align="center"> </el-table-column> -->
                    <el-table-column prop="reimbursementId" label="编号" align="center"> </el-table-column>
                    <el-table-column prop="amount" label="报销金额" align="center"> </el-table-column>
                    <el-table-column prop="category" label="报销类别" align="center"></el-table-column>
                    <el-table-column prop="reason" label="报销事由" align="center"></el-table-column>
                    <el-table-column prop="approvalStatus" label="审核状态" align="center"></el-table-column>
                    <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="200px">
                        <template #default="{ row }">
                            <el-button type="primary" icon="el-icon-edit" circle @click="update(row)"
                                v-if="row.approvalStatus === '未通过' " :disabled="row.approvalStatus !== '待审核'"></el-button>
                        </template>
                    </el-table-column>

                </el-table>

                <!-- 分页组件 -->
                <el-pagination @current-change="pagechange" background layout="prev, pager, next" :total="total"
                    :page-size="pagesize" style="text-align: center; margin-top: 10px;">
                </el-pagination>
            </el-card>



            <!-- 修改弹窗区域 -->
            <el-dialog title="修改报销记录" :visible.sync="show" width="900px">
                <el-card>
                    <div
                        style="font-size: 24px; text-align: center; margin-top: 15px; font-family: STKaiti; font-weight: bold;">
                        费用报销单
                    </div>
                    <div class="charge-header" style="margin-top: 15px;">
                        <div style="font-size: 16px; margin-top: 8px; ">
                            申请人: {{ name }}
                        </div>
                        <div style="font-size: 16px; margin-left: 15px;">
                            日期: {{ userFormData.date }}
                        </div>
                        <div style="float: right">
                            <el-button type="primary" style="margin-right: 0px;" @click="submit"
                                size="medium">保存</el-button>
                        </div>
                    </div>

                    <el-form :model="userFormData" class="demo-form-inline">

                        <el-form-item style="margin-top: 30px;">
                            <div class="flex-container">
                                <el-input disabled v-model="count"
                                    style="flex: 2; text-align: center !important;"></el-input>
                                <el-input v-model="userFormData.amount" style="flex: 8;"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item style="margin-top: -23px;">
                            <div class="flex-container">
                                <el-input disabled v-model="style" style="flex: 2; text-align: center;"></el-input>
                                <el-input v-model="userFormData.category" style="flex: 8;"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item style="margin-top: -23px;">
                            <div class="flex-container">
                                <el-input disabled v-model="reason" style="flex: 2; text-align: center ;"></el-input>
                                <el-input v-model="userFormData.reason" style="flex: 8;"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item style="margin-top: -23px;">
                            <div class="flex-container">
                                <el-input disabled v-model="note" style="flex: 2; text-align: center;"></el-input>
                                <el-input v-model="userFormData.remarks" style="flex: 8;"></el-input>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-dialog>

            <!-- 新增弹窗区域 -->
            <el-dialog title="新增报销记录" :visible.sync="addshow" width="900px">
                <el-card>
                    <div
                        style="font-size: 24px; text-align: center; margin-top: 15px; font-family: STKaiti; font-weight: bold;">
                        费用报销单
                    </div>
                    <div class="charge-header" style="margin-top: 15px;">
                        <div style="font-size: 16px; margin-top: 8px; ">
                            申请人: {{ name }}
                        </div>
                        <div style="font-size: 16px; margin-left: 15px;">
                            日期: {{ userFormData.date }}
                        </div>
                        <div style="float: right">
                            <el-button type="primary" style="margin-right: 0px;" @click="addsubmit"
                                size="medium">保存</el-button>
                        </div>
                    </div>

                    <el-form :model="userFormData" class="demo-form-inline">

                        <el-form-item style="margin-top: 30px;">
                            <div class="flex-container">
                                <el-input disabled v-model="count"
                                    style="flex: 2; text-align: center !important;"></el-input>
                                <el-input v-model="userFormData.amount" style="flex: 8;"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item style="margin-top: -23px;">
                            <div class="flex-container">
                                
                                <el-input disabled v-model="style" style="flex: 2; text-align: center;"></el-input>
                            
                                <el-input v-model="userFormData.category" style="flex: 8;"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item style="margin-top: -23px;">
                            <div class="flex-container">
                                <el-input disabled v-model="reason" style="flex: 2; text-align: center ;"></el-input>
                                <el-input v-model="userFormData.reason" style="flex: 8;"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item style="margin-top: -23px;">
                            <div class="flex-container">
                                <el-input disabled v-model="note" style="flex: 2; text-align: center;"></el-input>
                                <el-input v-model="userFormData.remarks" style="flex: 8;"></el-input>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-dialog>

            <!-- 折旧流程 -->
            <el-dialog title="折旧流程" :visible.sync="isShow">
            <div class="block">
                <el-timeline>
                    <el-timeline-item :timestamp="DeclarationDate" placement="top">
                        <el-card>
                            <p>员工 {{name}} 提交申请于 {{DeclarationDate}}</p>
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

        </el-card>
    </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import '@fortawesome/fontawesome-free/css/all.css';
import { Message } from 'element-ui';

export default {
    data() {
        return {
            curState:'',
            isShow:false,
            DeclarationDate:'',
            ReviewDate:'',
            //name: localStorage.getItem('name'),
            count: "报销金额",
            style: '报销类别',
            reason: "报销事由",
            note: "备注",
            //reimbursementID: '',
            tableHeaderClassName: 'custom-table-header',// 自定义的表头样式类名
            list: [],
            categoryList:'',
            //reimbursementID: list.reimbursementID,
            userFormData: {
                date: dayjs().format('YYYY-MM-DD '),
                amount: '',
                category: '',
                reason: '',
                remarks: '',
                reimbursementId:''
            },
            pageno: 1,
            pagesize: 4,
            total: 0,
            bookId:6,
            employeeId:0,
            params: {
                category: '',
            },
            show: false,
            addshow: false,
        }
    },
    created() {
        this.employeeId=localStorage.getItem('employeeID'),
        this.bookID = localStorage.getItem('bookID'),
        this.getCategoryList()
        this.getList()
    },
    methods: {
        //
        process(row) {
            this.isShow = true
            this.DeclarationDate = row.createTime
            this.ReviewDate = row.updateTime
            this.curState = row.approvalStatus
        },
        async getCategoryList(){
            const res = await axios({
                url:"http://localhost:8080/reimbursement/findAllCategoryList",
                method:"get",
                params:{
                    bookId:this.bookId,
                    //bookId:6,
                }
            });
            this.categoryList=res.data.data
         },
        async getList() {
            const formattedParams = {
                ...this.params,
               };
            const res = await axios({
                url: "http://localhost:8080/reimbursement/findAll",
                method: "get",
                params: {
                    pageno: this.pageno,
                    pagesize: this.pagesize,
                    bookId:this.bookId,
                    //bookId:6,
                    employeeId:this.employeeId,
                    ...formattedParams
                    //employeeID: localStorage.getItem('employeeID')
                },
            });
             //console.log(res)
            //返回的数据进行时间格式转换
            this.list = res.data.data.map(item => {
                return {
                    ...item,
                    createTime: dayjs(item.createTime).format('YYYY-MM-DD '),
                    updateTime: dayjs(item.updateTime).format('YYYY-MM-DD ')
                };
            });
            this.total = res.data.count;
        },
        // 点击搜索 分页查询全部
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
        //操作里面打开编辑页面的按钮
        update(row) {
            console.log(row)
            this.show = true;
            this.userFormData.amount = row.amount;
            this.userFormData.category = row.category;
            this.userFormData.reason = row.reason;
            this.userFormData.remarks = row.remarks;
            this.userFormData.reimbursementId = row.reimbursementId
        },
        //修改保存按钮
        async submit() {
            const data = {
                amount:this.userFormData.amount,
                category:this.userFormData.category,
                reason:this.userFormData.reason,
                remarks:this.userFormData.remarks,
                reimbursementId:this.userFormData.reimbursementId,
                //reimbursementID: this.reimbursementID,
                //...this.userFormData,
                updateTime: new Date(),
            }
            console.log(data)
            const res = await axios({
                url: "http://localhost:8080/reimbursement/updateReimbursement",
                method: "post",
                data: data
            })
            if(res.code==200){
                this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success'
                });
            }
            this.getList()
            this.show = false
        },
        cancel() {
            this.show = false
            this.addshow = false
        },
        //新增保存按钮
        async addsubmit() {
            const data = {
                ...this.userFormData,
                createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                employeeId: this.employeeId,
                bookId: this.bookId
            }
            const res = await axios({
                url: "http://localhost:8080/reimbursement/add",
                method: "post",
                data: data
            })
            if(res.code==200){
                this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success'
                });
            }
            this.getList()
            this.addshow = false
        },
        // 点击新增按钮后每次置空
        addopen() {
            this.addshow = true
            this.userFormData.amount = '';
            this.userFormData.category = '';
            this.userFormData.reason = '';
            this.userFormData.remarks = '';
        }
    }


}
</script>

<style lang="scss" scoped>
::v-deep .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    text-align: center;
}

.flex-container {
    display: flex;
}

.charge-header {
    margin-bottom: 10px;
}

.charge-header>div {
    display: inline-block;
    margin-right: 15px;
}

/* 修改标题行的颜色 */
::v-deep .el-dialog__header {
    background-color: rgb(243, 247, 249);
    /* 替换为你想要的背景颜色值 */
    color: #000000;
    /* 替换为你想要的文字颜色值 */
}

::v-deep .custom-table-header th {
    background-color: rgb(249, 251, 252);
    /* 替换为你想要的背景颜色值 */
    color: #000000;
    /* 替换为你想要的文字颜色值 */
}

.button-group {
    display: flex;
    justify-content: space-between;
    /* 将按钮平均分布在弹窗底部 */
    margin-top: 20px;
    /* 为按钮组设置上边距，以调整按钮与输入框的间隔 */
    margin-right: 80px;
}
</style>