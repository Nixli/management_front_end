<template>
    <div
        style="margin-top: 30px; height: auto; width: auto; display: flex; justify-content: center; align-items: center;">
        <el-form :model="userFormData" class="demo-ruleForm" label-width="80px" status-icon :rules="rules">
            <el-form-item label="员工姓名">
                <el-input v-model="userFormData.employeeDes" placeholder="员工姓名"></el-input>
            </el-form-item>

            <el-form-item label="性别">
                <template>
                    <el-radio v-model="userFormData.sex" label="男">男</el-radio>
                    <el-radio v-model="userFormData.sex" label="女">女</el-radio>
                </template>
            </el-form-item>

            <el-form-item label="密码" prop="pass">
                <el-input v-model="userFormData.password" type="password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="checkPass">
                <el-input v-model="userFormData.checkPass" type="password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item prop="phone" label="手机号" :rules="[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]">
                <el-input v-model="userFormData.phone"></el-input>
            </el-form-item>

            <el-form-item prop="email" label="邮箱" :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]">
                <el-input v-model="userFormData.email"></el-input>
            </el-form-item>

            <el-form-item label="银行卡号">
                <el-input v-model="userFormData.bankcardID" placeholder="银行卡号"></el-input>
            </el-form-item>

            <el-form-item style="margin-top: 20px;">
                <el-button @click="submit">修改个人信息</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>
<script>

import axios from "axios";

export default {

    data() {
        //密码校验
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.userFormData.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.userFormData.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            list: [],
            // 控制弹框的显示与隐藏
            dialogFormVisible: false,
            // 表单的数据
            userFormData: {
                employeeID: localStorage.getItem('employeeID'),
                employeeDes: '',
                sex: '',
                password: '',
                checkPass: '',
                phone: '',
                email: '',
                bankcardID: '',
                createTime: localStorage.getItem('createTime'),
                state: localStorage.getItem('state'),
                storeID: localStorage.getItem('storeID'),
                roleID: localStorage.getItem('roleID'),
                accountBook: { bookID: localStorage.getItem('bookID') } // 使用关系属性名
            },
            //密码校验规则
            rules: {
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },

        };
    },
    created() {
        this.getList()
    },

    methods: {
        async getList() {
            const res = await axios({
                method: "get",
                url: "http://localhost:8080/employee/findByEmployeeID",
                params: {
                    employeeID: this.userFormData.employeeID
                },
            });
            //回显用户信息
            this.userFormData.employeeDes = res.data.data.employeeDes
            this.userFormData.sex = res.data.data.sex
            this.userFormData.phone = res.data.data.phone
            this.userFormData.email = res.data.data.email
            this.userFormData.bankcardID = res.data.data.bankcardID
        },

        async submit() {
            const data = { ...this.userFormData }
            const res = await axios({
                url: 'http://localhost:8080/employee/updateEmployee',
                method: 'post',
                data: data
            })
            console.log(res.data.code)
            if (res.data.code === 200) {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
            } else {
                this.$message.error('修改失败');
            }
        }
    }
}

</script>