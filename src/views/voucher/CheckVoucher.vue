<template>
    <div>
        <!-- <el-button @click="pdf" style="position: relative; top: 200px;">导出</el-button> -->
        <div style="width: 100%" ref="box">
            <el-card v-if="VoucherList.length > 0">
                <div style="font-size: 36px; text-align: center; margin-top: 15px; font-family: STKaiti; font-weight: bold;">
                    {{ VoucherList[0].voucherWord }}款凭证</div>
    
                <div class="charge-header" style="margin-top: 15px;">
                    <div>
                        <span>凭证字</span>
                        <el-select :disabled=true style="width: 100px; margin-left: 10px;" v-model="VoucherList[0].voucherWord">
                        </el-select>
                    </div>
                    <div>
                        凭证号
                        <el-input disabled type="number" style="width: 80px; margin-left: 10px;" min="1"
                            v-model="VoucherList[0].voucherNumber"></el-input>
                    </div>
                    <div>
                        日期
                        <el-date-picker disabled type="date" style="width: 145px; margin-left: 10px;"
                            v-model="VoucherList[0].cime"></el-date-picker>
                    </div>
    
                </div>
    
                <div style="margin-top: 20px;">
                    <table class="my-table">
                        <tr>
                            <td :rowspan="2">操作</td>
                            <td :rowspan="2">摘要</td>
                            <td :rowspan="2">会计科目</td>
                            <td :colspan="11">借方金额</td>
                            <td :colspan="11">贷方金额</td>
                        </tr>
                        <tr>
                            <td>亿</td>
                            <td>千</td>
                            <td>百</td>
                            <td>十</td>
                            <td>万</td>
                            <td>千</td>
                            <td>百</td>
                            <td>十</td>
                            <td>元</td>
                            <td>角</td>
                            <td>分</td>
                            <td>亿</td>
                            <td>千</td>
                            <td>百</td>
                            <td>十</td>
                            <td>万</td>
                            <td>千</td>
                            <td>百</td>
                            <td>十</td>
                            <td>元</td>
                            <td>角</td>
                            <td>分</td>
                        </tr>
    
                        <tr v-for="(item, index) in tableData" class="content">
                            <td style="width: 50px;">
                                <i class="el-icon-plus"  style="margin-right: 5px;"></i>
                                <i class="el-icon-close" ></i>
                            </td>
                            <td>
                                <el-select disabled class="custom-select" v-model="item.summary" placeholder="">
                                    <el-option v-for="summary in summarylist" :label="summary.summaryContent"
                                        :value="summary.summaryContent" :key="summary.summaryContent" />
                                </el-select>
                            </td>
                            <td>
                                <el-select disabled class="custom-select" v-model="item.accountingSubject" placeholder="">
                                    <el-option v-for="accountingAccount in accountingAccountList"
                                        :label="accountingAccount.AccountingAccount"
                                        :value="accountingAccount.AccountingAccount"
                                        :key="accountingAccount.AccountingAccount" />
                                </el-select>
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[0]" @input="handleInput">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[1]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[2]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[3]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[4]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[5]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[6]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[7]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[8]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[9]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.debitAmount[10]">
                            </td>
    
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[0]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[1]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[2]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[3]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[4]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[5]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[6]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[7]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[8]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[9]">
                            </td>
                            <td>
                                <input disabled class="short" type="text" v-model="item.creditAmount[10]">
                            </td>
                        </tr>
    
    
                        <tr class="content1">
                            <td :colspan="3" class="width height">合计:</td>
                            <td v-for="item in debitAmountTotal" class="width height" style="text-align: center;">{{ item }}
                            </td>
                            <td v-for="item in creditAmountTotal" class="width height" style="text-align: center;">{{ item }}
                            </td>
                        </tr>
                    </table>
                </div>
    
                <div class="charge-header" style="margin-top: 15px;">
                    <div>
                        制单人: {{ VoucherList[0].maker }}
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import axios from 'axios';
import dayjs from 'dayjs';
import { htmlToPdf } from '@/utils/pdf';
export default {
    data() {
        return {
            maker: '',
            date: '',
            no: '',
            bill: '',
            VoucherList: [],
            summarylist: [],
            accountingAccountList: [],
            voucherWordlist: [],

            tableData: [],
            debitAmountTotal: ['', '', '', '', '', '', '', '', '', '', ''],
            creditAmountTotal: ['', '', '', '', '', '', '', '', '', '', '']
        }
    },
    methods: {
        pdf() {
            console.log('fdfdf')
            htmlToPdf.getPdf(this.$refs.box, 'fdjf', true)
        },
        formatNum(arr) {
            console.log(arr, '~~~~')
            // const arr = [0, 0, 0, 0, 1, 2, 3, 0];

            // 找到第一个非零数字的索引
            let firstNonZeroIndex = arr.findIndex(num => num != 0);
            if(firstNonZeroIndex == -1) firstNonZeroIndex = arr.length 

            // 将第一个非零数字之前的所有元素替换为空字符串
            const resultArr = arr.map((num, index) => (index < firstNonZeroIndex ? '' : num));

            return resultArr
        },
        add() {
            this.tableData.push({
                // 摘要
                summary: '',
                // 会计科目
                accountingSubject: '',
                // 借方
                debitAmount: ['', '', '', '', '', '', '', '', '', '', ''],
                // 贷方
                creditAmount: ['', '', '', '', '', '', '', '', '', '', ''],
            })
        },
        reduce(index) {
            if (this.tableData.length <= 2) {
                Message.warning('不能再删除了！')
                return
            }
            this.tableData.splice(index, 1)
        },
        arrToMoney(arr) {
            const weights = [100000000, 10000000, 1000000, 100000, 10000, 1000, 100, 10, 1, 0.1, 0.01];

            // 计算金额
            let totalAmount = 0;

            arr.forEach((amount, index) => {
                // 将金额字符串转换为数字，忽略非数字的项
                const numericAmount = parseInt(amount || 0);

                // 如果是有效的数字，则累加到总金额
                if (!isNaN(numericAmount)) {
                    totalAmount += numericAmount * weights[index];
                }
            });
            return totalAmount
        },
        moneyToArr(totalAmount) {
            // 数字位权值
            const weights = [100000000, 10000000, 1000000, 100000, 10000, 1000, 100, 10, 1, 0.1, 0.01];

            // 转换为对应的金额数组
            const debitAmount = weights.map(weight => {
                const amount = Math.floor(totalAmount / weight);
                totalAmount -= amount * weight;
                return amount;
            });

            // 反转数组并将数字转换为字符串，不足的地方用空字符串填充
            const reversedDebitAmount = debitAmount.reverse().map(amount => (amount !== undefined ? String(amount) : ''));
            const filledDebitAmount = reversedDebitAmount.slice().reverse();
            return filledDebitAmount
        },
        handleInput() {
            // 使用正则表达式匹配只包含数字0~9的字符串
            this.inputValue = this.inputValue.replace(/[^0-9]/g, "").charAt(0);
        },
        async getSummaryList() {
            const res = await axios({
                url: "http://localhost:8081/summary/findAll",
                method: "get",
                params: {
                    ...this.params,
                    pageno: this.pageno,
                    pagesize: this.pagesize,
                }
            });
            this.summarylist = res.data.data.list;
        },
        async getaccountingAccountList() {
            const res = await axios({
                url: "http://localhost:8081/accounting/findAll",
                method: "get",
                params: {
                    ...this.params,
                    pageno: this.pageno,
                    pagesize: this.pagesize,
                }
            });
            this.accountingAccountList = res.data.data.list;
        },
        async getVoucherWordList() {
            const res = await axios({
                url: "http://localhost:8081/voucherWord/findAll",
                method: "get",
            });
            this.voucherWordlist = res.data.data
        },
        async getVoucher() {
            const data = {
                bookId: localStorage.getItem('bookID'),// 使用关系属性名
                voucherId: localStorage.getItem('voucherID')
            };
            const res = await axios({
                url: 'http://localhost:8081/voucher/findByWhere',
                method: 'get',
                params: data,
            });
            console.log(res.data.data, '---------------')
            this.VoucherList = res.data.data.map(item => {

                const tableData = item.voucherContent.filter(item => item.summary).map(content => {
                    
                    // 将 debitAmount 转换为字符串数组
                    const debitAmountArr = this.formatNum(this.moneyToArr(Number(content.debitAmount)));
                    const creditAmountArr = this.formatNum(this.moneyToArr(Number(content.creditAmount)))
                    return {
                        summary: content.summary,
                        accountingSubject: content.accountingSubject,
                        debitAmount: debitAmountArr, // 使用 moneyToArr 转换为字符串数组
                        creditAmount: creditAmountArr,
                    };
                });
                this.tableData = tableData;
                return {
                    ...item,
                    cime: dayjs(item.cime).format('YYYY-MM-DD'),
                    tableData: tableData,
                };
            });

        }
    },
    watch: {
        tableData: {
            handler() {
                const total = this.tableData.map(item => this.arrToMoney(item.debitAmount)).reduce((prev, cur) => prev = prev + cur, 0)
                this.debitAmountTotal = this.formatNum(this.moneyToArr(total))
                const ctotal = this.tableData.map(item => this.arrToMoney(item.creditAmount)).reduce((prev, cur) => prev = prev + cur, 0)
                this.creditAmountTotal = this.formatNum(this.moneyToArr(ctotal))
            },
            deep: true
        }
    },
    created() {
        this.getSummaryList();
        this.getaccountingAccountList();
        this.getVoucherWordList();
        this.getVoucher()
    }
}
</script>

<style lang="scss">
.charge-header {
    margin-bottom: 10px;
}

.charge-header>div {
    display: inline-block;
    margin-right: 15px;
}
.el-input.is-disabled .el-input__inner {
        background-color: #fff;
    }
.my-table {
   
    input:disabled  {
        background-color: #fff;
    }

    // border: 1px solid #fff;
    .el-input--suffix .el-input__inner {
        border: none;
    }

    td {
        border: 1px solid rgb(220, 223, 230);
        padding: 5px;
        text-align: center;
        vertical-align: middle;
    }

    .custom-select ::v-deep .el-select__input {
        border: none !important;
        text-align: center;
    }

    .content {
        td:nth-child(4) {
            border-right-color: rgba(226, 106, 74, .5); // 第四列的右边框颜色
        }

        td:nth-child(8) {
            border-right-color: rgba(74, 144, 226, .5); // 第八列的右边框颜色
        }

        td:nth-child(12) {
            border-right-color: rgba(226, 106, 74, .5); // 第四列的右边框颜色
        }

        td:nth-child(15) {
            border-right-color: rgba(226, 106, 74, .5); // 第四列的右边框颜色
        }

        td:nth-child(19) {
            border-right-color: rgba(74, 144, 226, .5); // 第八列的右边框颜色
        }

        td:nth-child(23) {
            border-right-color: rgba(226, 106, 74, .5); // 第四列的右边框颜色
        }


    }

    .content1 {
        td:nth-child(2) {
            border-right-color: rgba(226, 106, 74, .5); // 第四列的右边框颜色
        }

        td:nth-child(6) {
            border-right-color: rgba(74, 144, 226, .5); // 第八列的右边框颜色
        }

        td:nth-child(10) {
            border-right-color: rgba(226, 106, 74, .5); // 第四列的右边框颜色
        }

        td:nth-child(13) {
            border-right-color: rgba(226, 106, 74, .5); // 第四列的右边框颜色
        }

        td:nth-child(17) {
            border-right-color: rgba(74, 144, 226, .5); // 第八列的右边框颜色
        }

        td:nth-child(21) {
            border-right-color: rgba(226, 106, 74, .5); // 第四列的右边框颜色
        }

    }

    input {
        border: none;
        width: 200px;
        text-align: center;

        &.short {
            width: 20px;
            height: 47px;
        }
    }

    .width {
        width: 15px;
        text-align: center;

    }

    .height {
        height: 35px;
    }

}
</style>