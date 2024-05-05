<template>
    <el-card>
        <!-- title -->
        <el-card style="text-align:center">
            <span style="font-size: 24px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">账套管理</span>
        </el-card>
        <!-- 操作按钮 -->
        <el-card style="margin-top: 20px">
            <span style="font-size: 16px; font-weight: bold; font-family: 'Times New Roman', Times, serif;">账套管理</span>
            <!-- 使用 v-if 判断 role 的内容，如果是老板则不显示新增按钮 -->
            <el-button v-if="role !== '老板'" style="margin-left: 20px" @click="addOpen">新增账套</el-button>
        </el-card>
        <!-- 账套区域 -->
        <el-row>
            <el-col v-for="item in accountBooksList" :span="8">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>{{ item.bookName }}</span>
                        <el-button v-if="role !== '财务'" type="text" style="margin-left: 245px;" @click="check(item)">
                            查看具体信息
                        </el-button>
                        <el-button v-if="role !== '老板'" type="text" style="margin-left: 270px;" @click="updateOpen(item)">
                            修改账套
                        </el-button>
                        <el-button type="text" @click="viewAccountDetails(item.bookID, item.bookName)">
                            进入账套
                        </el-button>
                    </div>
                    <p style="margin-top:10px">{{ item.bookName }}</p>
                    <p style="margin-top:20px">公司名称：{{ item.companyName }}</p>
                    <p style="margin-top:20px">纳税类型：{{ item.vatType }}</p>
                    <p style="margin-top:20px">启用时间：{{ item.ctime }}</p>
                </el-card>
            </el-col>
        </el-row>

        <!-- 新增弹窗区域 -->
        <el-dialog title="新增账套具体信息" :visible.sync="dialogFormVisible">
            <el-form :model="userFormData" class="demo-form-inline" label-width="120px">
                <el-form-item label="账套名称">
                    <el-input v-model="userFormData.bookName" placeholder="账套名称"></el-input>
                </el-form-item>
                <el-form-item label="单位名称">
                    <el-input v-model="userFormData.companyName" placeholder="单位名称"></el-input>
                </el-form-item>
                <el-form-item label="经营地址">
                    <el-input v-model="userFormData.businessAddress" placeholder="经营地址"></el-input>
                </el-form-item>
                <el-form-item label="行业">
                    <el-input v-model="userFormData.industry" placeholder="行业"></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="userFormData.contactPerson" placeholder="联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话">
                    <el-input v-model="userFormData.contactPhoneNumber" placeholder="联系人电话"></el-input>
                </el-form-item>
                <el-form-item label="纳税类型">
                    <el-select v-model="userFormData.vatType" placeholder="请选择纳税类型">
                        <el-option label="一般纳税人" value="generalTaxpayer"></el-option>
                        <el-option label="小规模纳税人" value="smallTaxpayer"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账套备注">
                    <el-input v-model="userFormData.notes" placeholder="账套备注"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="submit">提交</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

        <!-- 查看弹窗区域 -->
        <el-dialog title="查看账套具体信息" :visible.sync="isTrueOrFalse">
            <el-form :model="userFormData" class="demo-form-inline" label-width="120px">
                <el-form-item label="账套名称">
                    <el-input v-model="userFormData.bookName" placeholder="账套名称"></el-input>
                </el-form-item>
                <el-form-item label="单位名称">
                    <el-input v-model="userFormData.companyName" placeholder="单位名称"></el-input>
                </el-form-item>
                <el-form-item label="经营地址">
                    <el-input v-model="userFormData.businessAddress" placeholder="经营地址"></el-input>
                </el-form-item>
                <el-form-item label="行业">
                    <el-input v-model="userFormData.industry" placeholder="行业"></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="userFormData.contactPerson" placeholder="联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话">
                    <el-input v-model="userFormData.contactPhoneNumber" placeholder="联系人电话"></el-input>
                </el-form-item>
                <el-form-item label="纳税类型">
                    <el-input v-model="userFormData.vatType" placeholder="纳税类型"></el-input>
                </el-form-item>
                <el-form-item label="账套备注">
                    <el-input v-model="userFormData.notes" placeholder="账套备注"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改弹窗区域 -->
        <el-dialog title="修改账套信息" :visible.sync="show">
            <el-form :model="userFormData" class="demo-form-inline" label-width="120px">

                <el-form-item label="账套名称">
                    <el-input v-model="userFormData.bookName" placeholder="账套名称"></el-input>
                </el-form-item>

                <el-form-item label="单位名称">
                    <el-input v-model="userFormData.companyName" placeholder="单位名称"></el-input>
                </el-form-item>

                <el-form-item label="经营地址">
                    <el-input v-model="userFormData.businessAddress" placeholder="经营地址"></el-input>
                </el-form-item>

                <el-form-item label="行业">
                    <el-input v-model="userFormData.industry" placeholder="行业"></el-input>
                </el-form-item>

                <el-form-item label="联系人">
                    <el-input v-model="userFormData.contactPerson" placeholder="联系人"></el-input>
                </el-form-item>

                <el-form-item label="联系人电话">
                    <el-input v-model="userFormData.contactPhoneNumber" placeholder="联系人电话"></el-input>
                </el-form-item>

                <el-form-item label="纳税类型">
                    <el-select v-model="userFormData.vatType" placeholder="请选择纳税类型">
                        <el-option label="一般纳税人" value="generalTaxpayer"></el-option>
                        <el-option label="小规模纳税人" value="smallTaxpayer"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账套备注">
                    <el-input v-model="userFormData.notes" placeholder="账套备注"></el-input>
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
                bookID: '',
                bookName: '',
                companyName: '',
                businessAddress: '',
                industry: '',
                contactPerson: '',
                contactPhoneNumber: '',
                vatType: '',
                notes: '',
            },
            id: '',
            role: '',
            show: false
        };
    },
    created() {
        this.getList();
        this.role = localStorage.getItem('role');
    },
    methods: {
        async getList() {
            const res = await axios({
                method: "get",
                url: "/accountBooks",
            });

            // 修改日期格式
            this.accountBooksList = res.data.data.map(item => {
                return {
                    ...item,
                    ctime: dayjs(item.ctime).format('YYYY-MM-DD HH:mm:ss'),
                };
            });
        },

        viewAccountDetails(bookID, bookName) {
            // 存储具体某个账套的bookID到localStorage
            localStorage.setItem("bookID", bookID);
            localStorage.setItem("bookName", bookName);
            // 这里可以跳转到具体账套的详细信息页面或执行其他操作
            // 示例：跳转到名为'/accountDetails'的路由
            this.$router.push('/home');
        },

        // 打开新增弹窗，
        addOpen() {
            // 打开弹窗
            this.dialogFormVisible = true
            // 记录状态
            // 重置userFormData
            this.userFormData = {
                bookName: '',
                companyName: '',
                businessAddress: '',
                industry: '',
                contactPerson: '',
                contactPhoneNumber: '',
                vatType: '',
                notes: '',
            }
        },
        updateOpen(book) {
            this.show = true
            this.userFormData = { ...book }
        },

        async update() {
            const data = { ...this.userFormData }
            const res = await axios({
                url: '/accountBooks',
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
            const data = { ...this.userFormData }
            const res = await axios({
                url: '/accountBooks',
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