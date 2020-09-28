<template>
  <div class="back-ground">
    <!-- 粒子特效(particles) -->
    <div>
      <Particles />
    </div>
    <!-- 滚动特效 -->
    <div class="roll">
      <div v-for="value in 7" :key="value" class="roll-child" />
    </div>
    <!-- 粒子特效(star) -->
    <div class="container">
      <div v-for="value in 100" :key="value" class="circle-container">
        <div class="circle" />
      </div>
    </div>
    <!-- logo -->
    <div class="logo">
      <img
        v-show="oem.logo"
        class="img"
        alt=""
        :src="oem.logo"
        @error="handleLogoError"
      />
    </div>
    <!-- 登录表单 -->
    <div class="form-background">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <!--<h3 class="title">
          用户登录
        </h3>-->
          <h1 class="login-title clearfix">
            <div class="title">
              <h1 class="login-header-title">
                {{ oem.title }}
              </h1>
              <p class="login-header-version">
                {{ oem.subTitle }}
              </p>
            </div>
          </h1>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <i class="iconfont icon-yonghu"></i>
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            class="username"
            placeholder="用户名"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <i class="iconfont icon-mima"></i>
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              class="password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <i
                :class="
                  passwordType === 'password'
                    ? 'iconfont icon-yanjing_bi'
                    : 'iconfont icon-yanjing-zheng'
                "
              />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button
          :loading="loading"
          type="primary"
          class="login-btn"
          @click.native.prevent="handleLogin"
        >
          登 录
        </el-button>

        <el-button
          type="text"
          class="visitor-btn"
          @click.native.prevent="visitorLogin"
        >
          访客登录
        </el-button>
      </el-form>
      <div class="footer">
        <span class="footer-content">
          <span class="bolder oem-copy-right">{{ oem.copyright }}</span>
          <span id="loginCurYear">{{ curYear }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Particles from "./Particles";
import Cookies from "js-cookie";
import { mapState, mapGetters, mapMutations } from "vuex";
import { logoPath } from "@/assets/providers/path";

export default {
  name: "login",
  components: {
    Particles,
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      // if (value.length < 6) {
      //   callback(new Error('密码不能少于6个字符'))
      // } else {
      callback();
      // }
    };
    return {
      loginForm: {
        username: "admin",
        password: "dataexa",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      curYear: new Date().getFullYear(),
      oem: {
        copyright: "",
        title: "",
        subTitle: "",
        logo: "",
      },
      defaultLogo: 'this.src="' + require("@/assets/img/amzuiIcon.png") + '"',
    };
  },
  computed: {
    ...mapState("home", ["loadingShow"]),
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    /*
    设置oem（这个写法会有缓存问题，它没有考虑到及时更新）
    */
    // if (Cookies.get("hasOem") === "true") {
    //   this.setOem();
    // } else {
    this.getOem();
    // }
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleLogoError() {
      this.oem.logo = "";
    },
    // getOem () {
    //   let res = {
    //     xicon    : 'DataExa-Sati认知智能平台',
    //     title    : 'DataExa-Sati',
    //     copyright: '厦门渊亭信息科技有限公司 © 2014 -',
    //     subTitle : '认知智能平台',
    //     logo     : '../assets/img/amzuiIcon.png'
    //   }
    //   this.setOem(res)
    // },
    async getOem() {
      let res = await this.$api.getConfigure().catch(() => {
        let res = {
          xicon: "DataExa-Sati认知智能平台",
          title: "DataExa-Sati",
          copyright: "厦门渊亭信息科技有限公司 © 2014 -",
          subTitle: "认知智能平台",
          logo: "./amzuiIcon.png",
        };
        // Cookies.set('oem', JSON.stringify(res), { expires: 3, path: '/' })
        Cookies.set("hasOem", "false", { expires: 3, path: "/" });
        this.setOem(res);
      });
      res = res && res.data;
      if (res && res.success) {
        document.title = res.object.xicon || "DataExa-Sati 认知智能平台 V5.0";
        // var link = document.querySelectorAll('link[rel*=\'icon\']')
        // if (link.length > 0) {
        //   let p = link[0].parentNode
        //   link.forEach(i => p.removeChild(i))
        // }
        // link = document.createElement('link')
        // link.type = 'image/x-icon'
        // link.rel = 'shortcut icon'
        // link.href = location.origin + '/server-app/api/system/rest/s/oem-configure/logo-get'
        // document.getElementsByTagName('head')[0].appendChild(link)
        // 管理端logo单独获取，应该改掉
        // res.object.logo = logoPath
        // Cookies.set('oem', JSON.stringify(res.object), {
        //   expires: 3,
        //   path   : '/'
        // })
        Cookies.set("hasOem", "true", { expires: 3, path: "/" });
        this.setOem(res.object);
      } else {
        this.$message.error("获取oem信息失败!");
        // this.oem.logo = this.defaultLogo
      }
    },
    setOem(res) {
      // let res = JSON.parse(Cookies.get('oem'))
      this.oem.copyright = res.copyright;
      this.oem.title = res.title;
      this.oem.subTitle = res.subTitle;
      this.oem.logo =
        location.origin +
          "/server-app/api/system/rest/s/oem-configure/logo-get" ||
        this.defaultLogo;
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    async handleLogin() {
      this.changeLoading(true);
      this.loading = true;

      const res = await Promise.all([
        // this.$api.login(this.loginForm.username, this.loginForm.password),
        this.$api.loginToMicroServices(
          this.loginForm.username,
          this.loginForm.password
        ),
      ]).catch((e) => {
        console.log(e);
        this.changeLoading(false);
        this.$message.error({ message: "用户登录失败", duration: 1500 });
      });
      console.log(res);
      // const res1 = res[0]
      const res2 = res[0];
      // if (!res1.data.success) {
      //   this.loading = false
      //   this.changeLoading(false)
      //   return this.$message.error({ message: res1.data.msg, duration: 1500 })
      // }
      if (!res2.data.success) {
        this.loading = false;
        this.changeLoading(false);
        return this.$message.error({
          message: res2.data.message,
          duration: 1500,
        });
      } else {
        const token = res2.data.data;
        Cookies.set("microServiceToken", token);
        // Authorization才是后端验证的字段
        Cookies.set("Authorization", token);
        console.log(token);
      }
      let graphName = this.$route.query.graphName;
      if (graphName) {
        this.loading = false;
        location.href = `/home?graphName=${graphName}`;
      } else {
        this.$api
          .getGraphList()
          .then((res) => {
            console.log(res);
            this.loading = false;
            this.changeLoading(false);
            if (!res.data.object.length)
              return this.$message.error({
                message: "请选择图谱或联系管理员",
                duration: 1500,
              });
            location.href = `/home?graphName=${res.data.object[0].name}`;
          })
          .catch(() => {
            this.loading = false;
          });
      }

      // return

      // this.$api.login(this.loginForm.username, this.loginForm.password)
      //   .then((response) => {
      //     let res = response.data
      //     if (!res.success) {
      //       this.loading = false
      //       this.changeLoading(false)
      //       return this.$message.error({ message: res.msg, duration: 1500 })
      //     }
      //     let graphName = this.$route.query.graphName
      //     if (graphName) {
      //       this.loading = false
      //       location.href = `/home?graphName=${graphName}`
      //       // this.$router.push({
      //       //   path : '/home',
      //       //   query: {
      //       //     graphName
      //       //   }
      //       // })
      //     } else {
      //       this.$api.getGraphList()
      //         .then(res => {
      //           this.loading = false
      //           this.changeLoading(false)
      //           if (!res.data.object.length) return this.$message.error({ message: '请选择图谱或联系管理员', duration: 1500 })
      //           // this.$router.push(`home?graphName=${res.data.object[0].name}`)
      //           // this.$router.push({
      //           //   path : '/home',
      //           //   query: {
      //           //     graphName: res.data.object[0].name
      //           //   }
      //           // })
      //           location.href = `/home?graphName=${res.data.object[0].name}`
      //         })
      //         .catch(() => {
      //           this.loading = false
      //         })
      //     }
      //   })
      //   .catch((err) => {
      //     this.loading = false
      //     console.log(err)
      //     this.changeLoading(false)
      //     this.$message.error({ message: '用户登录失败', duration: 1500 })
      //   })
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true
      //     this.$store
      //       .dispatch('user/login', this.loginForm)
      //       .then(() => {
      //         this.$router.push({ path: this.redirect || '/' })
      //         this.loading = false
      //       })
      //       .catch(() => {
      //         this.loading = false
      //       })
      //   } else {
      //     return false
      //   }
      // })
    },
    visitorLogin() {
      this.changeLoading(true);
      this.$api
        .guestLogin()
        .then((response) => {
          let res = response.data;
          if (!res.success) {
            this.changeLoading(false);
            return this.$message.error({
              message: res.msg || "访客登录失败",
              duration: 1500,
            });
          }
          this.$api
            .getGraphList()
            .then((res) => {
              this.changeLoading(false);
              if (!res.data.object.length) {
                return this.$message.error({
                  message: "请选择图谱或联系管理员",
                  duration: 1500,
                });
              }
              this.$router.push(`home?graphName=${res.data.object[0].name}`);
            })
            .catch((err) => {
              console.log(err);
              this.changeLoading(false);
            });
        })
        .catch((err) => {
          console.log(err);
          this.changeLoading(false);
          this.$message.error({ message: "访客登录失败", duration: 1500 });
        });
      // let res = await guestLogin().catch(() => {
      //   this.$message({
      //     type   : 'error',
      //     message: '请求失败'
      //   })
      // })
      // if (res.data.success) {
      //   this.$router.push({ path: '/' })
      // } else {
      //   this.$message({
      //     type   : 'error',
      //     message: res.data.msg
      //   })
      // }
    },
    ...mapMutations("home", ["changeLoading"]),
    ...mapMutations("menuControl", ["changeMenuPermission"]),
  },
};
</script>

<style scoped lang="scss">
// 背景以及圆圈动画效果
@import "./scss/background.scss";

// 圆圈粒子特效
@import "./scss/star.scss";

//logo
.logo {
  position: absolute;
  top: 2%;
  left: 2%;

  .img {
    width: 60px;
    height: 60px;
  }
}

//表单
.form-background {
  position: absolute;
  top: 0;
}

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$width: 450px;

.form-background {
  min-height: 100%;
  width: 100%;
  background-size: 100% 100%;
  overflow: hidden;
  pointer-events: none;

  .login-form {
    position: fixed;
    width: $width;
    max-width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    overflow: hidden;
    pointer-events: auto;
  }

  .login-form .el-form-item {
    width: 272px;
    height: 42px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
    border-radius: 21px;
    border: 1px solid #307bc7;
  }

  .el-input /deep/ input {
    padding-left: 40px;
    width: 272px;
    height: 40px;
    border-radius: 20px;
  }

  /deep/ .el-form-item__error {
    padding: 0;
  }

  .title-container {
    pointer-events: none;
    .login-title {
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      align-items: center;

      .title {
        font-size: 1.28rem;
        color: #ffffff;
        margin: 0;
        width: $width;

        .login-header-title {
          margin: 0;
          font-size: 2.57rem;
          color: #3184de;
          word-break: break-all;
          word-wrap: break-word;
          // max-width: 280px;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
        }

        .login-header-version {
          font-size: 1.28rem;
          color: #cccccc;
          padding-top: 10px;
          font-weight: initial;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }

  .svg-container {
    z-index: 1000;
    position: absolute;
    font-size: 1.1rem;
    padding: 0 5px 0 15px;
    color: $dark_gray;
    vertical-align: middle;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 1.1rem;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .login-btn {
    width: 272px;
    height: 42px;
    margin: 8px auto;
    border-radius: 21px;
    background-color: #3184de;
    border-color: #3184de;
    display: block;
    color: #fff;

    &.is-loading {
      color: #fff;
      opacity: initial;
    }
  }

  .visitor-btn {
    color: #3184de;
    margin: 0px auto;
    display: block;
  }

  .footer {
    position: absolute;
    font-size: 1.1rem;
    left: 12px;
    right: 12px;
    bottom: 4px;
    padding: 8px;
    line-height: 36px;
    border-top: none;
    text-align: center;

    .footer-content {
      color: #bababa;
    }
  }
}
</style>
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .form-background .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.form-background {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 14px 5px 16px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      background-color: transparent !important;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
