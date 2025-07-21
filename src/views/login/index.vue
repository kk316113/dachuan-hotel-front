<template>
    <div class="login-container">
         <!-- 左上角logo -->
        <img src="@/assets/logo.png" alt="logo" class="login-logo" />
        <div class="login-box-wrapper">
            <el-card class="box-card">
                <div class="text item">
                    <el-row type="flex" justify="center" align="middle" style="text-align: center;">
                        <el-col :span="auto">
                            <div style="display: flex; align-items: center;">
                                <svg t="1752851154183" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="5428" width="32" height="32" style="
                                width: 35px;
                                height: 35px;
                                margin-right: 10px;
                                margin-left: 64px;
                                -webkit-user-drag: none;
                                ">
                                    <path
                                        d="M960 938.666667h-21.333333V221.62a106.666667 106.666667 0 0 0-89.133334-105.213333l-440.666666-73.446667A21.333333 21.333333 0 0 0 384 64v896a21.333333 21.333333 0 0 0 21.333333 21.333333h554.666667a21.333333 21.333333 0 0 0 0-42.666666z m-362.666667-85.333334h-42.666666v-85.333333h42.666666z m0-128h-42.666666V640h42.666666z m0-128h-42.666666V512h42.666666z m0-128h-42.666666V384h42.666666z m0-128h-42.666666V256h42.666666z m85.333334 512h-42.666667v-85.333333h42.666667z m0-128h-42.666667V640h42.666667z m0-128h-42.666667V512h42.666667z m0-128h-42.666667V384h42.666667z m0-128h-42.666667V256h42.666667z m85.333333 512h-42.666667v-85.333333h42.666667z m0-128h-42.666667V640h42.666667z m0-128h-42.666667V512h42.666667z m0-128h-42.666667V384h42.666667z m0-128h-42.666667V256h42.666667zM331.96 174.333333a21.333333 21.333333 0 0 0-19.88-2.14l-213.333333 85.333334A21.333333 21.333333 0 0 0 85.333333 277.333333v661.333334H64a21.333333 21.333333 0 0 0 0 42.666666h256a21.333333 21.333333 0 0 0 21.333333-21.333333V192a21.333333 21.333333 0 0 0-9.373333-17.666667zM213.333333 853.333333h-42.666666v-85.333333h42.666666z m0-128h-42.666666V640h42.666666z m0-128h-42.666666V512h42.666666z m0-128h-42.666666V384h42.666666z"
                                        fill="#ffffff" p-id="5429"></path>
                                </svg>
                                <span style="font-size: 28px; font-weight: 600; color: white;">
                                    大川酒店后台管理系统
                                </span>
                            </div>
                        </el-col>
                    </el-row>
                    <br>
                    <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on"
                        label-position="left">

                        <el-form-item prop="username">
                            <svg t="1752850529345" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="8890"
                                style="width: 26px; height: 26px; margin-left: 10px; vertical-align: middle;">
                                <path
                                    d="M581.616221 423.19292q-46.215929 19.030088-84.729204 50.746903t-66.60531 72.495575-43.497345 89.260177-15.40531 101.946903q0 47.122124 12.233628 90.166372t33.982301 81.104425l-24.467257 0q-26.279646 0-61.168142-1.812389t-72.042478-4.984071-73.854867-7.249558-66.60531-8.60885-50.746903-9.061947-26.279646-9.061947q-9.968142-7.249558-14.952212-44.856637t4.077876-96.509735q3.624779-22.654867 14.952212-37.153982t27.638938-24.920354 36.247788-16.764602 40.778761-12.233628 40.325664-12.686726 35.79469-16.764602q19.030088-11.780531 29.451327-23.107965t14.952212-22.20177 4.530973-22.654867-0.906195-26.279646q-1.812389-20.842478-14.499115-33.076106t-28.092035-24.920354q-7.249558-6.343363-13.139823-17.670796t-10.421239-23.107965q-4.530973-13.59292-9.061947-28.092035-6.343363-1.812389-12.686726-6.343363-5.437168-4.530973-11.780531-12.686726t-10.874336-23.561062-3.624779-28.092035 5.437168-22.654867q3.624779-9.968142 11.780531-19.030088 0-34.435398 3.624779-68.870796 3.624779-28.99823 12.686726-62.527434t28.092035-59.80885q18.123894-25.373451 38.966372-41.231858t43.497345-24.920354 44.856637-12.233628 43.044248-3.171681q26.279646 0 52.106195 5.890265t48.481416 15.858407 40.325664 22.654867 27.638938 25.373451q23.561062 28.99823 34.435398 63.886726t15.40531 66.60531q4.530973 36.247788 4.530973 73.40177 6.343363 4.530973 9.968142 11.780531 3.624779 6.343363 5.890265 16.311504t0.453097 24.467257q-1.812389 19.936283-7.702655 31.263717t-13.139823 17.670796q-8.155752 7.249558-17.217699 9.968142-1.812389 5.437168-3.624779 11.780531l-4.530973 12.686726q-1.812389 6.343363-4.530973 13.59292zM711.202061 452.19115q58.902655 0 111.00885 22.654867t90.619469 61.621239 61.168142 91.072566 22.654867 111.00885-22.654867 111.00885-61.168142 91.072566-90.619469 61.168142-111.00885 22.20177q-59.80885 0-111.915044-22.20177t-90.619469-61.168142-61.168142-91.072566-22.654867-111.00885 22.654867-111.00885 61.168142-91.072566 90.619469-61.621239 111.915044-22.654867zM877.941884 682.364602q5.437168-18.123894-4.984071-33.076106t-27.638938-21.295575-34.435398-0.906195-25.373451 28.092035q-4.530973 15.40531-8.60885 28.545133t-8.155752 27.638938-9.968142 31.263717-14.952212 38.513274q-9.061947 23.561062-25.826549 22.20177t-25.826549-19.483186q-9.968142-18.123894-18.576991-38.966372t-16.764602-40.778761-14.499115-36.247788-10.874336-26.279646q-7.249558-14.499115-24.014159-16.311504t-32.623009 4.984071-26.279646 21.295575-3.171681 31.716814q6.343363 18.123894 14.499115 40.778761t17.217699 46.215929 17.217699 46.215929 14.499115 38.966372q13.59292 34.435398 41.231858 51.653097t57.99646 18.123894 57.99646-13.59292 40.325664-43.497345q9.968142-23.561062 20.389381-49.387611t19.936283-50.293805 17.670796-47.122124 13.59292-38.966372z"
                                    p-id="8891" fill="#ffffff"></path>
                            </svg>
                            <el-input id="account" ref="username" v-model="loginForm.username" name="username"
                                type="text" tabindex="1" />
                        </el-form-item>

                        <el-form-item prop="password">
                            <svg t="1752851049785" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="9350"
                                style="width: 26px; height: 26px; margin-left: 10px; vertical-align: middle;">
                                <path
                                    d="M385.150849 385.662338l-128.895105 0 0-150.377622q0-49.102897 19.436563-91.556444t53.706294-74.677323 80.815185-50.637363 101.786214-18.413586q49.102897 0 94.625375 18.413586t80.815185 50.637363 56.263736 74.677323 20.971029 91.556444l0 150.377622-123.78022 0 0-121.734266q0-64.447552-35.804196-99.74026t-97.182817-35.292707q-55.240759 0-88.999001 35.292707t-33.758242 99.74026l0 121.734266zM826.053946 447.040959q27.62038 0 47.568432 19.948052t19.948052 47.568432l0 317.122877q0 27.62038-9.718282 51.66034t-26.597403 41.942058-39.896104 28.131868-50.637363 10.22977l-516.603397 0q-27.62038 0-50.125874-10.22977t-38.361638-27.108891-24.551449-39.384615-8.695305-48.07992l0-324.283716q0-27.62038 19.436563-47.568432t47.056943-19.948052l61.378621 0 128.895105 0 255.744256 0 123.78022 0 61.378621 0z"
                                    p-id="9351" fill="#ffffff"></path>
                            </svg>
                            <el-input id="psw" :key="passwordType" ref="password" v-model="loginForm.password"
                                :type="passwordType" name="password" tabindex="2" @keyup.enter.native="handleLogin" />
                            <span class="show-pwd" @click="showPwd">
                                <svg-icon :icon-class="passwordType === 'password'
                                    ? 'eye'
                                    : 'eye-open'
                                    " />
                            </span>
                        </el-form-item>

                        <el-button id="login_btn" type="primary" style="
                            width: 100%;
                            margin-bottom: 30px;
                            font-size: 20px;
                            background: rgba(255, 255, 255, 0.1);
                            color: white;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            backdrop-filter: blur(8px);
                            box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
                            border-radius: 6px;
                            transition: all 0.3s ease;
                        " @click.native.prevent="handleLogin">
                            登 录</el-button>
                    </el-form>
                </div>

            </el-card>
            <!-- 注意事项 -->
            <div class="login-notice">
                <h3>注意事项</h3>
                <ul>
                    <li>
                        <strong>账户安全：</strong>此系统为酒店核心资产，请妥善保管您的账户密码，<strong>严禁与他人共享</strong>。所有通过您账户进行的操作均会被记录，并视为您的个人行为。
                    </li>
                    <li>
                        <strong>数据隐私：</strong>系统包含客户高度敏感信息（如身份、联系方式），<strong>严禁非法查询、复制或外泄</strong>，违者将承担法律责任。
                    </li>
                    <li>
                        <strong>操作规范：</strong>进行预订、入住、退房等关键操作时，请务必<strong>仔细核对信息</strong>，确保数据准确无误，以免造成运营混乱或客户投诉。
                    </li>
                    <li>
                        <strong>安全习惯：</strong>离开工位时，请务必<strong>锁定电脑或退出系统</strong>，防止信息泄露。如遇操作问题或发现异常，请立即联系IT部门或您的主管。
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import request from '@/utils/request'
export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                username: "",
                password: "",
            },
            loading: false,
            passwordType: "password",
            redirect: undefined,
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true,
        },
    },
    methods: {
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
        handleLogin() {
            let that = this;
            this.loading = true;
            this.req({
                method: 'get',
                url: "/login",
                params: {
                    adminName: that.loginForm.username,
                    password: that.loginForm.password,
                },
            }).then(
                (res) => {
                    if (res.code === 1) {
                        // 登录成功处理
                        localStorage.setItem("hasLogin", true);
                        localStorage.setItem("token", res.data.token);
                        localStorage.setItem("userInfo", JSON.stringify(res.data));
                        this.$router.push({ path: "/home" });
                    } else {
                        this.passwordError = true;
                        this.loading = false;
                        this.$message({
                            showClose: true,
                            message: e.message || "用户名或密码错误",
                            type: "error",
                            duration: 0,
                        });
                    }
                },
                (e) => {
                    // 网络请求本身失败（如服务器挂了、跨域、断网）
                    this.passwordError = true;
                    this.loading = false;
                    if (!e.response || e.response.data == undefined) {
                        this.$message({
                            showClose: true,
                            message: e.message || "请求失败",
                            type: "error",
                            duration: 0,
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: e.response.data || "服务错误",
                            type: "error",
                            duration: 0,
                        });
                    }
                }
            );
        },
    },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg: #283443;
$light_gray: #303133;
$cursor: #303133;
.login-logo {
    position: absolute;
    top: 32px;
    left: 32px;
    height: 200px;
    z-index: 100;
}

.login-box-wrapper {
    display: flex;
    justify-content: center; // 横向居中
    align-items: center; // 纵向居中
    height: 100vh;
    gap: 160px; // 左右间距
    padding: 0 60px; // 页面边缘留白
    box-sizing: border-box;
}

.login-notice {
    background-color: rgba(50, 50, 50, 0.4);
    color: #fff;
    backdrop-filter: blur(4px);
    padding: 20px;
    border-radius: 8px;
    font-size: 15px;
    line-height: 1.6;
    height: 70%;
    width: 700px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);

    h3 {
        margin-bottom: 21px;
        margin-left: 20px;
        font-size: 24px;
        color: #fff;
    }

    ul {
        padding-left: 18px;
        margin: 0;
    }

    li {
        margin-bottom: 16px;
        margin-left: 18px;
        font-size: 18px;
    }
}

.info {
    // position: fixed;
    margin-bottom: 10px;
    width: 100%;
    text-align: center;
    color: $bg;
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            background-color: rgba(255, 255, 255, 0.1); // 更通透
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            padding: 12px 15px;
            color: #fff; // 输入文字为白色
            caret-color: #fff;

            &::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }
        }
    }

    .el-form-item {
        border: none;
        background: transparent;
        color: #fff;
        margin-bottom: 20px;
    }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #525d63;
$light_gray: #eee;

.login-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    overflow-y: hidden;
    height: 100%;
    background: url(../../assets/admin-bg.jpg) center top / cover no-repeat;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        // padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $bg;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 35px;
        top: 2px;
        font-size: 16px;
        color: white;
        cursor: pointer;
        user-select: none;
    }
}
</style>


<style scoped="scoped">
.text {
    font-size: 1rem;
}

.item {
    padding: 18px 0;
}

.box-card {
    width: 480px;
    background-color: rgba(50, 50, 50, 0.4);
    border-radius: 8px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    color: #fff;
}

.login-container .el-input input:-webkit-autofill {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    -webkit-text-fill-color: #ffffff !important;
}

#app {
    overflow: hidden !important;
}
</style>
