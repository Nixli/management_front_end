<template>
    <div>
        <el-card>
            <el-card>
                <span style="font-size: 18px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">凭证字</span>
                <el-popover placement="top-start" title="凭证字功能介绍" width="500" trigger="hover">
                    <el-card>
                        <span>凭证字是财务软件中使用的名词之一。凭证字包括：收、付、转、记。</span><br>
                        <span>“收款凭证”，凭证字就是“收”。用于收取现金、银行存款时；</span><br>
                        <span>“付款凭证”，凭证字就是“付”。用于支付现金、银行存款时；</span><br>
                        <span>“转帐凭证”，凭证字就是“转”。用于不涉及现金或银行存款时；</span><br>
                        <span>“记款凭证”，凭证字就是“记”。通用凭证，适用于以上前三种凭证字。</span><br>
                        <span>备注：提现金、银行存款的提取，既可用收款凭证，也可用付款凭证。</span>
                    </el-card>
                    <i class="el-icon-info" style="font-size: 16px; margin-left: 10px; margin-top: 5px;"
                        slot="reference"></i>
                </el-popover>
                
            </el-card>
            <el-card>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addopen">新增凭证字</el-button>
                <el-table :data="list" style="width: 100%;margin-top: 15px;" :header-row-class-name="tableHeaderClassName">
                <el-table-column prop="voucherWordID" label="序号" align="center" width="100"> </el-table-column>
                <el-table-column prop="voucherWord" label="凭证字" align="center">
                    <template #default="{ row }">
                        <div>
                            {{ row.voucherWord }}
                            <!-- 根据 isDefault 列的值动态显示默认按钮 -->
                            <el-button v-if="row.isDefault === '是'" type="warning" size="mini">默认</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="showTitel" label="显示标题" align="center"> </el-table-column>
                <el-table-column prop="isDefault" label="是否默认" align="center"> </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" icon="el-icon-edit" circle @click="update(row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="out(row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            </el-card>

            

            <!-- 修改弹窗区域 -->
            <el-dialog title="修改凭证字" :visible.sync="show" width="600px">
                <el-form :model="userFormData" class="demo-form-inline" label-width="80px">

                    <el-form-item label="凭证字">
                        <el-input v-model="userFormData.voucherWord" placeholder="凭证字"></el-input>
                    </el-form-item>

                    <el-form-item label="显示标题">
                        <el-input v-model="userFormData.showTitel" placeholder="显示标题"></el-input>
                    </el-form-item>

                    <el-form-item label="是否默认">
                        <el-radio-group v-model="userFormData.isDefault">
                            <el-radio label="是"></el-radio>
                            <el-radio label="否"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <!-- 使用 Flex 布局排列按钮 -->
                    <el-form-item class="button-group">
                        <el-button @click="submit" type="primary">提交</el-button>
                        <el-button @click="cancel" type="info">取消</el-button>
                    </el-form-item>

                </el-form>
            </el-dialog>

            <!-- 新增弹窗区域 -->
            <el-dialog title="新增凭证字" :visible.sync="addshow" width="600px">
                <el-form :model="userFormData" class="demo-form-inline" label-width="80px">

                    <el-form-item label="凭证字">
                        <el-input v-model="userFormData.voucherWord" placeholder="凭证字"></el-input>
                    </el-form-item>

                    <el-form-item label="显示标题">
                        <el-input v-model="userFormData.showTitel" placeholder="显示标题"></el-input>
                    </el-form-item>

                    <el-form-item label="是否默认">
                        <el-radio-group v-model="userFormData.isDefault">
                            <el-radio label="是"></el-radio>
                            <el-radio label="否"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <!-- 使用 Flex 布局排列按钮 -->
                    <el-form-item class="button-group">
                        <el-button @click="addsubmit" type="primary">提交</el-button>
                        <el-button @click="cancel" type="info">取消</el-button>
                    </el-form-item>



                </el-form>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import axios from 'axios';
import { dataTool } from 'echarts';

export default {
    data() {
        return {
            tableHeaderClassName: 'custom-table-header',// 自定义的表头样式类名
            list: [],
            voucherWordID: '',
            userFormData: {
                isDefault: '',
                showTitel: '',
                voucherWord: ''
            },
            show: false,
            addshow: false
        }
    },
    created() {
        this.getList()
    },
    methods: {
        async getList() {
            const res = await axios({
                url: "http://172.16.110.32:8080/voucherWord/findAll",
                method: "get",
            });
            this.list = res.data.data
        },
        update(row) {
            this.show = true;
            this.userFormData.isDefault = row.isDefault;
            this.userFormData.showTitel = row.showTitel;
            this.userFormData.voucherWord = row.voucherWord
            this.voucherWordID = row.voucherWordID
        },
        async out(row) {

            if (row.isDefault === '是') {
                // 如果 isDefault 为 "是"，不执行删除操作
                this.$message.warning('不能删除默认项');
            } else {
                const data = {
                    voucherWordID: row.voucherWordID,
                }
                const res = await axios({
                    url: "http://172.16.110.32:8080/voucherWord/delete",
                    method: "post",
                    data: data
                })
                this.getList()
            }

        },

        async submit() {

            const data = {
                voucherWordID: this.voucherWordID,
                ...this.userFormData
            }
            const res = await axios({
                url: "http://172.16.110.32:8080/voucherWord/update",
                method: "post",
                data: data
            })
            this.getList()
            this.show = false
        },
        cancel() {
            this.show = false
            this.addshow = false
        },
        async addsubmit() {
            const data = {
                ...this.userFormData
            }
            const res = await axios({
                url: "http://172.16.110.32:8080/voucherWord/add",
                method: "post",
                data: data
            })
            this.getList()
            this.addshow = false
        },
        addopen(){
            this.addshow = true
            this.userFormData.isDefault = ''
            this.userFormData.showTitel = ''
            this.userFormData.voucherWord = ''
        }
    }


}
</script>

<style scoped>
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
  justify-content: space-between; /* 将按钮平均分布在弹窗底部 */
  margin-top: 20px; /* 为按钮组设置上边距，以调整按钮与输入框的间隔 */
  margin-right: 80px;
}
</style>