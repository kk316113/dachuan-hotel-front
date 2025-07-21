<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar shape="square" :size="35" :src="require('@/assets/avatar.jpg')" style="vertical-align: middle; margin-right: 5px;"></el-avatar>
          <span class="el-dropdown-link">
            欢迎您, {{ adminName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="openUpdateDialog">修改信息</el-dropdown-item>
          <el-dropdown-item  @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-input placeholder="用户名" v-model="admin.adminName">
        <template slot="prepend">登录账号</template>
      </el-input>
      <el-input placeholder="若需要修改密码，请输入" v-model="admin.password" show-password>
        <template slot="prepend">输入密码</template>
      </el-input>
      <el-input placeholder="确认密码" v-model="admin.confirmPassword" show-password>
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
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      dialogVisible: false,
      admin: {
        adminName: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    ...mapGetters(["sidebar"]),
    // 使用计算属性来安全地获取用户信息
    userInfo() {
      try {
        return JSON.parse(localStorage.getItem('userInfo')) || {};
      } catch (e) {
        return {};
      }
    },
    adminName() {
      // 从安全的 userInfo 中获取名字用于显示
      return this.userInfo.adminName || '管理员';
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    
    // 退出登录方法
    logout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('hasLogin');
        this.$router.push('/login');
      }).catch(() => {
        // 用户点击取消，不做任何事
      });
    },

    // 打开对话框时，填充当前用户信息
    openUpdateDialog() {
        this.admin = {
            adminName: this.adminName,
            password: '',
            confirmPassword: ''
        };
        this.dialogVisible = true;
    },

    // 修改管理员信息方法
    updateAdmin() {
      if (this.admin.adminName.trim() === "") {
        this.$message.error("用户名不能为空");
        return;
      }
      if (this.admin.password && (this.admin.password !== this.admin.confirmPassword)) {
        this.$message.error("两次输入密码不一致");
        return;
      }
      
      const payload = {
        id: this.userInfo.id,
        adminName: this.admin.adminName,
        password: this.admin.password,
      };

      // 假设你的更新接口路径是 /admin/updateAdmin
      this.req({
        url: "/admin/updateAdmin",
        method: "put",
        data: payload
      }).then(() => {
        this.dialogVisible = false;
        this.$alert('信息修改成功！请重新登录。', '操作成功', {
          confirmButtonText: '确定',
          callback: () => {
            this.logout();
          }
        });
      });
    },
    handleClose() {
        this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: rgba(102, 102, 102, 0.4);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    ::v-deep .hamburger {
      fill: #fff !important;
    }

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

    .avatar-container {
      height: 100%;
      display: flex;
      align-items: center;

      .avatar-wrapper {
        cursor: pointer;
        
        .el-dropdown-link {
          color: #ffffff !important;
          font-size: 16px;
        }
      }
    }
  }
  ::v-deep .breadcrumb-container {
    .el-breadcrumb__inner a,
    .el-breadcrumb__inner.is-link {
      color: #e0e0e0; 
      font-weight: normal;
      transition: color 0.3s;
    }
    // 鼠标悬浮时高亮
    .el-breadcrumb__inner a:hover,
    .el-breadcrumb__inner.is-link:hover {
      color: #ffffff;
    }
    
    // 当前页面（非链接）的文字颜色
    .el-breadcrumb__inner:not(.is-link) {
      color: #ffffff;
      font-weight: bold;
    }
    
    .el-breadcrumb__separator {
      color: #a0a0a0;
    }
  }
}
</style>