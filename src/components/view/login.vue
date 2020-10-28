<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">最爱松露巧克力</div>
            <el-form
                :model="userInfo"
                :rules="rules"
                ref="login"
                label-width="0px"
                class="ms-content"
            >
                <el-form-item prop="username">
                    <el-input v-model="userInfo.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-tooltip
                    v-model="capsTooltip"
                    content="Caps lock is On"
                    placement="right"
                    manual
                >
                    <el-form-item prop="password">
                        <el-input
                            :type="passwordType"
                            placeholder="password"
                            v-model="userInfo.password"
                            @keyup.native="checkCapslock"
                            @keyup.enter.native="submitForm()"
                        >
                            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                        </el-input>
                        <span class="passView" @click="changePasswordType">
                            <i class="el-icon-view"></i>
                        </span>
                    </el-form-item>
                </el-tooltip>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">{{loginButton}}</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            userInfo: {
                username: '陈憨憨与臭兜兜',
                password: 'oooo1995219'
            },
            capsTooltip: false,
            passwordType: 'password',
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            loginButton: '登陆'
        };
    },
    methods: {
        changePasswordType() {
            this.passwordType == 'password' ? (this.passwordType = '') : (this.passwordType = 'password');
        },
        checkCapslock({ shiftKey, key } = {}) {
            if (key && key.length === 1) {
                if ((shiftKey && key >= 'a' && key <= 'z') || (!shiftKey && key >= 'A' && key <= 'Z')) {
                    this.capsTooltip = true;
                } else {
                    this.capsTooltip = false;
                }
            }
            if (key === 'CapsLock' && this.capsTooltip === true) {
                this.capsTooltip = false;
            }
        },
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                    let index = 3;
                    let time = setInterval(() => {
                        if (index == 0) {
                            clearInterval(time);
                            sessionStorage.name = 'fucking.....';
                            localStorage.setItem('ms_username', this.userInfo.username);
                            this.$router.push('/');
                        } else {
                            this.loginButton = `登陆中...${index}`;
                            index--;
                        }
                    }, 1000);
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: black;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.passView {
    position: absolute;
    right: 7px;
}
</style>