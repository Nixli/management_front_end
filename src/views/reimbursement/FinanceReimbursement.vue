<template>
    <div>
        <el-card>
            <el-card>
                <span style="font-size: 18px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">用户报销</span>
            </el-card>
            <el-card>
                <div>
                    <!-- 右侧部分，包括查询输入框 -->
                    <el-input placeholder="请输入查询内容" prefix-icon="el-icon-search" v-model="params.category"
                        style="width: 300px;"></el-input>
                    <el-button type="primary" @click="search">查询</el-button>
                </div>
                <el-table :data="list" style="width: 100%;margin-top: 15px;" :header-row-class-name="tableHeaderClassName">
                    <el-table-column prop="reimbursementId" label="编号" align="center"> </el-table-column>
                    <el-table-column prop="amount" label="报销金额" align="center"> </el-table-column>
                    <el-table-column prop="category" label="报销类别" align="center"></el-table-column>
                    <el-table-column prop="reason" label="报销事由" align="center"></el-table-column>
                    <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>
                    <el-table-column prop="approvalStatus" label="报销状态" align="center"></el-table-column>
                    <el-table-column fixed="right" label="生成凭证" align="center">
                        <template #default="{ row }">
                            <el-button v-if="row.approvalStatus === '已通过' && row.isToVoucher === '否'" type="text"
                                size="medium" icon="el-icon-document" @click="updateApprovalStatus(row)">生成凭证</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页组件 -->
                <el-pagination @current-change="pagechange" background layout="prev, pager, next" :total="total"
                    :page-size="pagesize" style="text-align: center; margin-top: 10px;">
                </el-pagination>
            </el-card>

        </el-card>
    </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import { Message } from 'element-ui'

export default {
    data() {
        return {
            text:'付',
            name: localStorage.getItem('name'),
            summary:'报销',
            amount:'',
            accountingSubject:'',
            debitAmount:'',
            count: "报销金额",
            style: '报销类别',
            reason: "报销事由",
            note: "备注",
            //reimbursementID: '',
            tableHeaderClassName: 'custom-table-header',// 自定义的表头样式类名
            list: [],
            userFormData: {
                date: dayjs().format('YYYY-MM-DD '),
                amount: '',
                category: '',
                reason: '',
                remarks: ''
            },
            pageno: 1,
            pagesize: 4,
            total: 0,
            params: {
                category: '',
                bookId: localStorage.getItem('bookID')
            },
            //bookID: localStorage.getItem('bookID')
        }
    },
    created() {
        //this.bookID = localStorage.getItem('bookID'),
        this.getList()
    },
    methods: {
        async updateApprovalStatus(row) {
            const data = {
                reimbursementID: row.reimbursementID,
                isToVoucher: "是"
            }
            const res = await axios({
                url: "http://localhost:8080/reimbursement/updateReimbursementToVarch",
                method: "post",
                data: data
            })
            // this.getList()
            localStorage.setItem('summary', this.summary)
            localStorage.setItem('debitAmount', row.amount)
            localStorage.setItem('text',this.text)
            // 等待两秒后跳转页面
            Message.success('即将进入凭证界面')
            setTimeout(() => {
                // 跳转页面
                this.$router.push('/voucher/Voucher?type=1');
            }, 1000);
        },

        async getList() {
            const res = await axios({
                url: "http://localhost:8080/reimbursement/findAll",
                method: "get",
                params: {
                    ...this.params,
                    pageno: this.pageno,
                    pagesize: this.pagesize,
                }
            });
            this.list = res.data.data.map(item => {
                return {
                    ...item,
                    createTime: dayjs(item.createTime).format('YYYY-MM-DD '),
                    updateTime: dayjs(item.updateTime).format('YYYY-MM-DD ')
                };
            });
            this.total = res.data.count;
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