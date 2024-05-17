<template>
    <el-card class="test">
        <div slot="header"><span>期末结转</span></div>

        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>计提折旧</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="update0()">测算金额</el-button>
                    </div>
                    <div class="text item" v-if="statue0 === true">
                        {{ this.totalDepreciation }}
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>计提增值税</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="update1()">测算金额</el-button>
                    </div>
                    <div class="text item" v-if="statue1 === true">
                        {{ parseFloat((totalshouAmountSum / 1.13 * 0.13).toFixed(2)) }}
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>计提所得税</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="update2()">测算金额</el-button>
                    </div>
                    <div class="text item" v-if="statue2 === true">
                        {{ isDayu0(this.totalshouAmountSum, this.totalfuAmountSum) }}
                    </div>
                </el-card>
            </el-col>
        </el-row>

    </el-card>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {

    data() {
        return {
            statue0: false,
            statue1: false,
            statue2: false,
            totalshouAmountSum: 0,
            totalfuAmountSum: 0,
            VAT: [],
            bookID: localStorage.getItem('bookID'),
            xxlist: [],
            totalDepreciation: 0

        }
    },
    methods: {
        async getxxList() {
            const res = await axios({
                method: "get",
                url: "/xxdepreciationDetail",
                params: {
                    bookID: this.bookID,
                },
            });
            const currentTime = dayjs().format("YYYY-MM")
            // 修改日期格式
            this.xxlist = res.data.data.list.map(item => {
                const xxlist = item.depreciationDetailContent.map(detail => {
                    // 检查 netValue 和 currentTime 是否相同
                    if (dayjs(detail.netValue).format('YYYY-MM') === currentTime) {
                        return {
                            netValue: dayjs(detail.netValue).format('YYYY-MM'),
                            depreciationAmount: detail.depreciationAmount
                        };
                    }
                }).filter(Boolean); // 过滤掉为空的项

                return xxlist;
            }).filter(sublist => sublist.length > 0); // 过滤掉空的子数组

            // 求 depreciationAmount 的和
            const totalDepreciation = this.xxlist.flat().reduce((acc, cur) => {
                return acc + parseFloat(cur.depreciationAmount);
            }, 0);
            this.totalDepreciation = totalDepreciation; // 将总和赋值给 this.totalDepreciation
            this.total = res.data.data.total;
        },


        isDayu0(totalshouAmountSum, totalfuAmountSum) {
            if (totalshouAmountSum - totalfuAmountSum < 0) {
                return 0;
            } else {
                return (totalshouAmountSum - totalfuAmountSum) * 0.13;
            }
        },
        update0() {
            this.statue0 = true;
        },
        update1() {
            this.statue1 = true;
        },
        update2() {
            this.statue2 = true;
        },
        async getShouVoucherList() {
            const currentYearMonth = dayjs().format('YYYY-MM');
            const res = await axios({
                url: "http://localhost:8080/voucher/voucher",
                method: "get",
                params: {
                    bookID: localStorage.getItem('bookID'),
                    voucherWord: '收'
                }
            })
            this.VAT = res.data.data.map(item => ({
                ...item,
                cime: dayjs(item.cime).format('YYYY-MM')
            }))
            this.VAT = this.VAT.filter(item => {
                // 比较年份月份是否与当前年份月份一致
                return item.cime === currentYearMonth;
            });
            console.log(this.VAT)

            this.totalfuAmountSum = this.VAT.reduce((accumulator, currentValue) => {
                // 检查totalAmount是否是字符串，并转换为浮点数
                const amount = typeof currentValue.totalAmount === 'string' ? parseFloat(currentValue.totalAmount.replace(',', '')) : currentValue.totalAmount;
                return accumulator + amount;
            }, 0);
        },

        async getFuVoucherList() {
            const currentYearMonth = dayjs().format('YYYY-MM');
            const res = await axios({
                url: "http://localhost:8080/voucher/voucher",
                method: "get",
                params: {
                    bookID: localStorage.getItem('bookID'),
                    voucherWord: '付'
                }
            })
            this.VAT = res.data.data.map(item => ({
                ...item,
                cime: dayjs(item.cime).format('YYYY-MM')
            }))
            this.VAT = this.VAT.filter(item => {
                // 比较年份月份是否与当前年份月份一致
                return item.cime === currentYearMonth;
            });

            this.totalfuAmountSum = this.VAT.reduce((accumulator, currentValue) => {
                // 检查totalAmount是否是字符串，并转换为浮点数
                const amount = typeof currentValue.totalAmount === 'string' ? parseFloat(currentValue.totalAmount.replace(',', '')) : currentValue.totalAmount;
                return accumulator + amount;
            }, 0);
        },


    },
    created() {
        this.getShouVoucherList();
        this.getFuVoucherList();
        this.getxxList();
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
    background-color: rgb(249, 251, 252);
}

.text {
    font-size: 24px;
    text-align: center;
    justify-content: center;
    margin-top: 55px;

}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 350px;
    height: 270px;
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>