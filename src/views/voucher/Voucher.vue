<template>
    <div style="width: 100%; height: 100%;">
        <el-card>
            <div style="font-size: 36px; text-align: center; margin-top: 15px; font-family: STKaiti; font-weight: bold;">
                {{ voucherWord }}款凭证
            </div>

            <div class="charge-header" style="margin-top: 15px;">
                <div>
                    <span>凭证字</span>
                    <el-select style="width: 100px; margin-left: 10px;" v-model="voucherWord">
                        <el-option v-for="voucherWord in voucherWordlist" :label="voucherWord.voucherWord"
                            :value="voucherWord.voucherWord" :key="voucherWord.voucherWord" />
                    </el-select>
                </div>
                <div>
                    凭证号
                    <el-input type="number" style="width: 80px; margin-left: 10px;" min="1" v-model="no"></el-input>
                </div>
                <div>
                    日期
                    <el-date-picker type="date" style="width: 145px; margin-left: 10px;" v-model="date"></el-date-picker>
                </div>

                <div style="float: right">
                    <el-button type="primary" style="margin-right: 20px;" @click="addVoucher()">保存</el-button>
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
                            <i class="el-icon-plus" @click="add()" style="margin-right: 5px;"></i>
                            <i class="el-icon-close" @click="reduce(index)"></i>
                        </td>
                        <td>
                            <el-select class="custom-select" v-model="item.summary" placeholder="">
                                <el-option v-for="summary in summarylist" :label="summary.summaryContent"
                                    :value="summary.summaryContent" :key="summary.summaryContent" />
                            </el-select>
                        </td>
                        <td>
                            <el-select class="custom-select" v-model="item.accountingSubject" placeholder="">
                                <el-option v-for="accountingAccount in accountingAccountList"
                                    :label="accountingAccount.accountingAccount"
                                    :value="accountingAccount.accountingAccount"
                                    :key="accountingAccount.acountingAccount" />
                            </el-select>
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[0]" @input="handleInput">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[1]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[2]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[3]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[4]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[5]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[6]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[7]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[8]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[9]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.debitAmount[10]">
                        </td>

                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[0]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[1]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[2]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[3]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[4]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[5]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[6]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[7]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[8]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[9]">
                        </td>
                        <td>
                            <input class="short" type="text" v-model="item.creditAmount[10]">
                        </td>
                    </tr>


                    <tr class="content1">
                        <td :colspan="3" class="width height">合计:</td>
                        <td v-for="item in this.formatNum(debitAmountTotal)" class="width height" style="text-align: center;">{{ item }}
                        </td>
                        <td v-for="item in this.formatNum(creditAmountTotal)" class="width height" style="text-align: center;">{{ item }}
                        </td>
                    </tr>
                </table>
            </div>

            <div class="charge-header" style="margin-top: 15px;">
                <div>
                    制单人: {{ name }}
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { Message } from 'element-ui';
import axios from 'axios';
import dayjs from 'dayjs';
export default {
    data() {
        return {
            name: '',
            date: '',
            voucherWord: '收',
            no: '',
            bill: '',
            finaltotal: 0,
            summarylist: [],
            accountingAccountList: [],
            voucherWordlist: [],
            tableData: [
                {
                    // 摘要
                    summary: '',
                    // 会计科目
                    accountingSubject: '',
                    // 借方
                    debitAmount: ['', '', '', '', '', '', '', '', '', '', ''],
                    // 贷方
                    creditAmount: ['', '', '', '', '', '', '', '', '', '', ''],
                },
                {
                    // 摘要
                    summary: '',
                    // 会计科目
                    accountingSubject: '',
                    // 借方
                    debitAmount: ['', '', '', '', '', '', '', '', '', '', ''],
                    // 贷方
                    creditAmount: ['', '', '', '', '', '', '', '', '', '', ''],
                },


            ],
            debitAmountTotal: ['', '', '', '', '', '', '', '', '', '', ''],
            creditAmountTotal: ['', '', '', '', '', '', '', '', '', '', '']
        }
    },
    methods: {

        formatNum(arr) {
            // const arr = [0, 0, 0, 0, 1, 2, 3, 0];

            // 找到第一个非零数字的索引
            const firstNonZeroIndex = arr.findIndex(num => num != 0);

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
            console.log(arr)
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
            this.summarylist = res.data.data;
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
            this.accountingAccountList = res.data.data;
        },
        async getVoucherWordList() {
            const res = await axios({
                url: "http://localhost:8081/voucherWord/findAll",
                method: "get",
            });
            this.voucherWordlist = res.data.data
        },
        
        async addVoucher() {
            console.log(this.tableData[0].debitAmount, typeof this.tableData[0].debitAmount, '+++++')
            console.log(this.tableData[1].creditAmount, typeof this.tableData[1].creditAmount, "++++++")
            
            if (this.arrToMoney(this.tableData[0].debitAmount) == this.arrToMoney(this.tableData[1].creditAmount)) {
                const data = {
                maker: this.name,
                date: dayjs(this.date).format('YYYY-MM-DD'),
                voucherWord: this.voucherWord,
                bookId: localStorage.getItem('bookID'),
                totalAmount: this.finaltotal,
                voucherNumber: this.no,
                cime:new Date(),
                voucherContent: this.tableData.map(item => ({
                    ...item,
                    debitAmount: this.arrToMoney(item.debitAmount),
                    creditAmount: this.arrToMoney(item.creditAmount),
                })),
            };
            const res = await axios({
                url: 'http://localhost:8081/voucher/add',
                method: 'post',
                data: data
            })
            if (res.data.code === 0) {
                Message.success('新增成功,即将进入凭证列表')
                setTimeout(() => {
                    // 跳转页面
                    this.$router.push('/voucher/VoucherTotal');
                }, 2000);
            }
            }else{
                Message.warning('借方金额和贷方金额不相等，请检查')
            }
           

        },
    },
    watch: {
        tableData: {
            handler() {
                const total = this.tableData.map(item => this.arrToMoney(item.debitAmount)).reduce((prev, cur) => prev = prev + cur, 0)
                this.finaltotal = total
                this.debitAmountTotal = this.moneyToArr(total)
                const ctotal = this.tableData.map(item => this.arrToMoney(item.creditAmount)).reduce((prev, cur) => prev = prev + cur, 0)
                this.creditAmountTotal = this.moneyToArr(ctotal)
            },
            deep: true
        }
    },
    created() {
        let type = this.$route.query.type
        console.log(type, typeof type, '+++++')
        if(type == 1) {
            console.log('需要回显')
            // 从本地取
            const text = localStorage.getItem('text')

            const debitAmount = parseFloat(localStorage.getItem('debitAmount'))
            const summary = localStorage.getItem('summary')

            // 凭证字
            this.voucherWord = text
            this.tableData[0].summary = summary
            this.tableData[0].accountingSubject = '1001 库存现金'
            this.tableData[0].debitAmount = this.formatNum(this.moneyToArr(debitAmount))
            this.tableData[1].summary = summary
            this.tableData[1].accountingSubject = '1007管理费用'
            this.tableData[1].creditAmount = this.formatNum(this.moneyToArr(debitAmount))
        } else {
            console.log('直接添加')
        }
        this.name = localStorage.getItem('name')
        this.getSummaryList()
        this.getaccountingAccountList()
        this.getVoucherWordList()
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

.my-table {

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