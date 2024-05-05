<template>
    <div>
        <el-card>
            <el-card>
                <span style="font-size: 18px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">用户报销</span>
            </el-card>
            <el-card>
                <div>
                    <!-- 右侧部分，包括查询输入框 -->
                    <el-input placeholder="请输入查询内容" prefix-icon="el-icon-search" v-model="params.assetName"
                        style="width: 300px;"></el-input>
                    <el-button type="primary" @click="search">查询</el-button>
                </div>
                <el-table :data="list" style="width: 100%;margin-top: 15px;" :header-row-class-name="tableHeaderClassName">
                    <el-table-column prop="amount" label="报销金额" align="center"> </el-table-column>
                    <el-table-column prop="category" label="报销类别" align="center"></el-table-column>
                    <el-table-column prop="reason" label="报销事由" align="center"></el-table-column>
                    <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>
                    <el-table-column prop="approvalStatus" label="报销状态" align="center"></el-table-column>
                    <el-table-column fixed="right" label="操作" align="center" width="200px">
                        <template #default="{ row }">
                            <el-button  :disabled="row.approvalStatus !== '待审核'" type="primary" icon="el-icon-check" circle @click="accept(row)"></el-button>
                            <el-button  :disabled="row.approvalStatus !== '待审核'" type="danger" icon="el-icon-close" circle @click="reject(row)"></el-button>
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

export default {
    data() {
        return {
            name: localStorage.getItem('name'),
            count: "报销金额",
            style: '报销类别',
            reason: "报销事由",
            note: "备注",
            reimbursementID: '',
            tableHeaderClassName: 'custom-table-header',// 自定义的表头样式类名
            list: [],
            userFormData: {
                date: dayjs().format('YYYY-MM-DD '),
                amount: '',
                category: '',
                reason: '',
                remarks: ''
            },
            params: {
                assetName: ''
            },
            pageno: 1,
            pagesize: 4,
            total: 0,
            bookID: localStorage.getItem('bookID')
        }
    },
    created() {
        this.getList()
    },
    methods: {

        async accept(row) {
            const data = {
                reimbursementID: row.reimbursementID,
                approvalStatus:'已通过'
            }
            const res = await axios({
                url: '/updateReimbursement',
                method: "post",
                data: data
            })
            this.getList()
        },
        async reject(row) {
            const data = {
                reimbursementID: row.reimbursementID,
                approvalStatus:'未通过'
            }
            const res = await axios({
                url: '/updateReimbursement',
                method: "post",
                data: data
            })
            this.getList()
        },

        async getList() {
            const res = await axios({
                url: "/managerReimbursement",
                method: "get",
                params: {
                    bookID: this.bookID,
                    pageno: this.pageno,
                    pagesize: this.pagesize,
                }
            });
            this.list = res.data.data.list.map(item => {
                return {
                    ...item,
                    createTime: dayjs(item.createTime).format('YYYY-MM-DD '),
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