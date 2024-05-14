<template>
    <el-card>
        <!-- title -->
        <el-card style="text-align:center">
            <span style="font-size: 24px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">门店管理</span>
        </el-card>
        <!-- 操作按钮 -->
        <el-card style="margin-top: 20px">
            <span style="font-size: 16px; font-weight: bold; font-family: 'Times New Roman', Times, serif;">门店管理</span>
            <!-- 使用 v-if 判断 role 的内容，如果是老板则不显示新增按钮 -->
            <el-button style="margin-left: 20px" @click="addOpen">新增门店</el-button>
        </el-card>

        <!-- 账套区域 -->
        <el-row>
            <el-col v-for="item in accountBooksList" :span="8">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>{{ item.storeName }}</span>
                        <el-button  type="text" @click="check(item)">
                            查看具体信息
                        </el-button>
                        <el-button  type="text" @click="updateOpen(item)">
                            修改门店
                        </el-button>
                        <el-button type="text" @click="viewAccountDetails(item.storeId)">
                            进入当前门店
                        </el-button>
                    </div>
                    <p style="margin-top:10px">门店名称：{{ item.storeName }}</p>
                    <p style="margin-top:20px">门店地址：{{ item.storeAddress }}</p>
                    <p style="margin-top:20px">门店电话：{{ item.storePhone }}</p>
                    <p style="margin-top:20px">门店描述：{{ item.storeDes }}</p>

                </el-card>
            </el-col>
        </el-row>

        <!-- 新增弹窗区域 -->
        <el-dialog title="新增门店具体信息" :visible.sync="dialogFormVisible">
            <el-form :model="userFormData" class="demo-form-inline" label-width="120px">
                <el-form-item label="门店地址">
                    <el-input v-model="userFormData.storeAddress" placeholder="门店地址"></el-input>
                </el-form-item>

                <el-form-item label="门店描述">
                    <el-input v-model="userFormData.storeDes" placeholder="门店描述"></el-input>
                </el-form-item>

                <el-form-item label="门店名称">
                    <el-input v-model="userFormData.storeName" placeholder="门店名称"></el-input>
                </el-form-item>

                <el-form-item label="门店号码">
                    <el-input v-model="userFormData.storePhone" placeholder="门店号码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="submit">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 查看弹窗区域 -->
        <el-dialog title="查看账套具体信息" :visible.sync="isTrueOrFalse">
            <el-form :model="userFormData" class="demo-form-inline" label-width="120px">
                <el-form-item label="门店地址">
                    <el-input v-model="userFormData.storeAddress" placeholder="门店地址"></el-input>
                </el-form-item>

                <el-form-item label="门店描述">
                    <el-input v-model="userFormData.storeDes" placeholder="门店描述"></el-input>
                </el-form-item>

                <el-form-item label="门店名称">
                    <el-input v-model="userFormData.storeName" placeholder="门店名称"></el-input>
                </el-form-item>

                <el-form-item label="门店号码">
                    <el-input v-model="userFormData.storePhone" placeholder="门店号码"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改弹窗区域 -->
        <el-dialog title="修改门店信息" :visible.sync="show">
            <el-form :model="userFormData" class="demo-form-inline" label-width="120px">

                <el-form-item label="门店地址">
                    <el-input v-model="userFormData.storeAddress" placeholder="门店地址"></el-input>
                </el-form-item>

                <el-form-item label="门店描述">
                    <el-input v-model="userFormData.storeDes" placeholder="门店描述"></el-input>
                </el-form-item>

                <el-form-item label="门店名称">
                    <el-input v-model="userFormData.storeName" placeholder="门店名称"></el-input>
                </el-form-item>

                <el-form-item label="门店号码">
                    <el-input v-model="userFormData.storePhone" placeholder="门店号码"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="update">提交</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>


    </el-card>
</template>

<script>

import dayjs from "dayjs";
import axios from "axios";
export default {

    data() {
        return {
            accountBooksList: [],
            dialogFormVisible: false,
            isTrueOrFalse: false,
            userFormData: {
                storeId: '',
                storeAddress: '',
                storeDes: '',
                storeName: '',
                storePhone: '',
            },
            role: '',
            show: false
        };
    },
    created() {
        this.getList();
        this.role = localStorage.getItem('role');
        console.log(this.role);
    },
    methods: {
        async getList() {
            const res = await axios({
                method: "get",
                url: "http://localhost:8080/store/findAll",
            });
            this.accountBooksList = res.data.data,
                console.log(this.accountBooksList)
        },

        viewAccountDetails(storeId) {
            // 存储具体某个账套的bookID到localStorage
            localStorage.setItem("storeId", storeId);
            if(this.role === '财务'){
                this.$router.push('/FinanceAccountBooks');
            }else{
                this.$router.push('/home');
            };
        },

        // 打开新增弹窗，
        addOpen() {
            // 打开弹窗
            this.dialogFormVisible = true
            // 记录状态
            // 重置userFormData
            this.userFormData = {
                storeId: '',
                storeAddress: '',
                storeDes: '',
                storeName: '',
                storePhone: '',
            }
        },
        updateOpen(book) {
            this.show = true
            this.userFormData = { ...book }
        },

        async update() {
            const data = { ...this.userFormData }
            const res = await axios({
                url: "http://localhost:8080/store/updateStore",
                method: 'post',
                data: data
            })
            this.show = false
            this.getList()
        },

        async check(book) {
            console.log(book, '~~~~')
            this.isTrueOrFalse = true
            this.userFormData = { ...book }
        },

        async submit() {
            // 拷贝userFormData到data
            const data = {
                ...this.userFormData
            }
            const res = await axios({
                url: "http://localhost:8080/store/addStore",
                method: 'post',
                data: data
            })
            this.dialogFormVisible = false
            this.getList()
        },
    },

}
</script>

<style lang="scss" scoped>
.text {
    font-size: 14px;
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
    width: 480px;
}
</style>