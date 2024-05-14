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
            <el-button style="margin-left: 20px" @click="addOpen">新增账套</el-button>
        </el-card>
        <!-- 账套区域 -->
        <el-row>
            <el-col v-for="item in accountBooksList" :span="8">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>{{ item.bookName }}</span>
                        <el-button style="margin-left: 20px" v-if="item.state === '启用'" type="text"
                            @click="updateOpen(item)">
                            修改账套
                        </el-button>
                        <el-button style="margin-left: 20px" type="text"
                            @click="viewAccountDetails(item.bookId, item.bookName)">
                            进入账套
                        </el-button>
                    </div>
                    <p style="margin-top:10px">账套名称：{{ item.bookName }}</p>
                    <p style="margin-top:20px">公司名称：{{ item.store.storeName }}</p>
                    <p style="margin-top:20px">纳税类型：{{ item.varType }}</p>
                    <p style="margin-top:20px">启用时间：{{ item.createTime }}</p>
                    <p style="margin-top:20px">禁用时间：{{ item.endTime }}</p>
                </el-card>
            </el-col>
        </el-row>

        <!-- 新增弹窗区域 -->
        <el-dialog title="新增账套具体信息" :visible.sync="dialogFormVisible">
            <el-form :model="userFormData" class="demo-form-inline" label-width="120px">
                <el-form-item label="账套名称">
                    <el-input v-model="userFormData.bookName" placeholder="账套名称"></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="userFormData.contactPerson" placeholder="联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话">
                    <el-input v-model="userFormData.contactPhoneNumber" placeholder="联系人电话"></el-input>
                </el-form-item>
                <el-form-item label="纳税类型">
                    <el-select v-model="userFormData.varType" placeholder="请选择纳税类型">
                        <el-option label="一般纳税人" value="一般纳税人"></el-option>
                        <el-option label="小规模纳税人" value="小规模纳税人"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="submit">提交</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

        <!-- 修改弹窗区域 -->
        <el-dialog title="修改账套信息" :visible.sync="show">
            <el-form :model="userFormData" class="demo-form-inline" label-width="120px">

                <el-form-item label="账套名称">
                    <el-input v-model="userFormData.bookName" placeholder="账套名称"></el-input>
                </el-form-item>

                <el-form-item label="联系人">
                    <el-input v-model="userFormData.contactPerson" placeholder="单位名称"></el-input>
                </el-form-item>

                <el-form-item label="联系人电话">
                    <el-input v-model="userFormData.contactPhoneNumber" placeholder="经营地址"></el-input>
                </el-form-item>

                <el-form-item label="纳税类型">
                    <el-select v-model="userFormData.varType" placeholder="请选择纳税类型">
                        <el-option label="一般纳税人" value="一般纳税人"></el-option>
                        <el-option label="小规模纳税人" value="小规模纳税人"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否禁用">
                    <el-select v-model="userFormData.state" placeholder="">
                        <el-option label="禁用" value="禁用"></el-option>
                        <el-option label="启用" value="启用"></el-option>
                    </el-select>
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
            storeId: "",
            accountBooksList: [],
            dialogFormVisible: false,
            isTrueOrFalse: false,
            userFormData: {
                bookId: '',
                bookName: '',
                contactPerson: '',
                contactPhoneNumber: '',
                varType: '',
                createTime: '',
                state: ''
            },
            role: '',
            show: false
        };
    },
    created() {
        this.getList();
        this.role = localStorage.getItem('role');
        this.storeId = localStorage.getItem('storeId');
    },
    methods: {
        async getList() {
            const res = await axios({
                method: "get",
                url: "http://localhost:8080/accountBook/findByStoreId",
                params: {
                    storeId: localStorage.getItem('storeId')
                }
            });
            // 遍历返回的数据，将 createTime 和 endTime 转换为指定格式的日期时间字符串
            this.accountBooksList = res.data.data.map(item => {
                item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
                if (item.endTime) {
                    item.endTime = dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    item.endTime = ''; // 如果 endTime 为空，则赋空值
                }
                return item;
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
                bookId: '',
                bookName: '',
                contactPerson: '',
                contactPhoneNumber: '',
                varType: '',
            }
        },
        updateOpen(item) {
            this.show = true
            this.userFormData = { ...item }
        },

        async update() {

            const { store, ...formDataWithoutStore } = this.userFormData;
            const data = {
                ...formDataWithoutStore,
                endTime: new Date(),
                storeId: localStorage.getItem('storeId')
            };
            if(this.userFormData.state === '禁用'){
                data.endTime = new Date()
                data.state = '禁用'
            }else{
                data.endTime = null
                data.state = '启用'
            }
            const res = await axios({
                url: "http://localhost:8080/accountBook/updateAccountBook",
                method: 'post',
                data: data
            })
            this.show = false
            this.getList()
        },

        async submit() {
            // 拷贝userFormData到data
            const data = {
                ...this.userFormData,
                // 添加其他字段
                createTime: new Date(),
                endTime: null,
                storeId: localStorage.getItem('storeId'),
                state: '启用'
            }
            const res = await axios({
                url: "http://localhost:8080/accountBook/addAccountBook",
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