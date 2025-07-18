<template>
    <div class="navbar">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

        <breadcrumb class="breadcrumb-container" />

        <div class="right-menu">
            <el-avatar shape="square" :size="35" :src="require('@/assets/avatar.jpg')"
                style="margin: 0 5px -8px 0"></el-avatar>
            <el-dropdown style="cursor: pointer; font-size: 22px; padding-bottom: 15px">
                <span class="el-dropdown-link">
                    {{ adminName }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    <el-dropdown-item @click.native="dialogVisible = true">修改信息</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-dialog title="修改信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-input placeholder="用户名" v-model="admin.adminName">
                <template slot="prepend">登录账号</template>
            </el-input>
            <el-input placeholder="若需要修改密码，请输入" v-model="admin.password">
                <template slot="prepend">输入密码</template>
            </el-input>
            <el-input placeholder="确认密码" v-model="admin.confirmPassword">
                <template slot="prepend">确认密码</template>
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false"> 取 消</el-button>
                <el-button type="primary" @click="updateAdmin"> 确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
    components: {
        Breadcrumb,
        Hamburger,
    },
    computed: {
        ...mapGetters(["sidebar", "avatar"]),
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
        },
        async logout() {
            this.axios
                .post("http://localhost:9151/admin/logout")
                .then((res) => {
                    localStorage.removeItem("hasLogin");
                    this.$router.push(
                        `/`
                    );
                })
                .catch((res) => {
                    console.log("err: " + res);
                });
        },
        updateAdmin() {
            if (this.admin.adminName.trim() == "") {
                this.$message({
                    message: "请输入用户名",
                    type: "error",
                });
                return
            }
            if (this.admin.password.trim() != "" && this.admin.password != this.admin.confirmPassword) {
                this.$message({
                    message: "两次输入密码不一致",
                    type: "error",
                });
                return
            }
            this.req({
                url: "http://localhost:9151/admin/updateAdmin",
                data: {
                    id: JSON.parse(localStorage.getItem('userInfo')).id,
                    userName: this.admin.adminName,
                    password: this.admin.password,
                },
                method: "POST",
            }).then((res) => {
                this.dialogVisible = false
                this.$alert('修改成功！即将返回登录页，请重新登录', '修改成功', {
                    confirmButtonText: '确定',
                    callback: action => {
                        localStorage.removeItem("hasLogin");
                        this.$router.push(
                            `/`
                        );
                    }
                });
            })
                .catch((res) => {
                    console.log("err: " + res);
                });
        }
    },
    mounted() {
        console.log()
    },
    data() {
        return {
            adminName: JSON.parse(localStorage.getItem('userInfo')).admin_name,
            dialogVisible: false,
            admin: {
                adminName: JSON.parse(localStorage.getItem('userInfo')).admin_name,
                password: "",
                confirmPassword: "",
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;
        margin-right: 20px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
