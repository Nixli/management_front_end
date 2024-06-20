<template>
    <el-card>
        <div>
            <div v-for="item in list" style="margin-bottom: 15px;">
                <el-card>
                    <div><span>{{ item.voucherWord }}</span> - <span>{{ item.voucherNumber }}</span></div>

                    <el-table :data="item.voucherContent" style="margin-top: 15px;">
                        <el-table-column label="摘要" prop="summary">
                        </el-table-column>
                        <el-table-column label="会计科目" prop="accountingSubject"></el-table-column>
                        <el-table-column label="借方金额" prop="debitAmount"></el-table-column>
                        <el-table-column label="贷方金额" prop="creditAmount"></el-table-column>
                        <el-table-column label="操作">
                            <template #default="{ row }">
                                <el-button type="text" size="small" @click="cheak(item)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </div>

            <!-- 分页 -->
            <el-pagination @current-change="pagechange" background layout="prev, pager, next" :total="total"
                :page-size="pagesize" style="text-align: center; margin-top: 10px;">
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
export default {
    data() {
        return {
            list: [],
            pageno: 1,
            pagesize: 2,
            total: 0,
        }
    },
    created() {
        this.list = this.list.filter(item => {
            item.voucherContent = item.voucherContent.filter(item => item.summary)
            return item.voucherContent.length > 0
        })
        this.getlist();
    },
    methods: {
        cheak(row) {
            localStorage.setItem('voucherID', row.voucherId)
            this.$router.push('/voucher/CheckVoucher');
        },
        async getlist() {
            const res = await axios({
                url: 'http://localhost:8081/voucher/page',
                method: 'get',
                params: {
                    page: this.pageno,
                    limit: this.pagesize,
                    bookId: localStorage.getItem('bookID')
                }
            })
            this.list = res.data.data;
            this.total = res.data.count;
        },
        pagechange(pageno) {
            console.log('00000000')
            // 条件改变
            this.pageno = pageno
            // 重新请求数据
            this.getlist()
        },
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table th.el-table__cell {
    background-color: rgb(230, 244, 255);
    color: black;
}
</style>