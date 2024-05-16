<template>
    <el-card>
        <el-card style="margin-top: 20px;">

            <el-card>
                <span
                    style="font-size: 16px;font-weight: bold;font-family: 'Times New Roman', Times, serif;">个人信息</span>
            </el-card>
            <div class="container">
                <div class="left" style="margin-top: 20px; height: 500px; width: 100%;">
                    <el-upload class="avatar-uploader" :action=this.uploadUrl :show-file-list="true"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="right" style="margin-top: 20px; height: 500px; width: 100%;">
                    <el-form :model="userFormData" class="demo-ruleForm" label-width="100px" status-icon :rules="rules">
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
            </div>

        </el-card>
    </el-card>
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
            //上传文件post地址
            uploadUrl: '',
            imageUrl:'',
            list: [],
            employeeID: localStorage.getItem('employeeID'),
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
                imageUrl: localStorage.getItem('imgUrl'),
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
        this.employeeID
    },
    mounted() {
        this.uploadUrl = `http://localhost:8080/employee/uploadEmployeeImg?employeeID=${this.employeeID}`;
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
            this.imageUrl = res.data.data.imgUrl
            console.log(this.imageUrl)
        },

        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 200;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 200MB!');
            }
            return isJPG && isLt2M;
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
<style>
.container {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
}

.left {
    width: 50%;
    margin-top: 100px;
    margin-left: 200px;
}

.right {
    width: 50%;
    margin-right: 250px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 400px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 300px;
    height: 400px;
    display: block;
}
</style>