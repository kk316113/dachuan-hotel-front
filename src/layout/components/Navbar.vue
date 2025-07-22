<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar shape="square" :size="35" :src="admin.image" style="vertical-align: middle; margin-right: 5px;"></el-avatar>
          <span class="el-dropdown-link">
            欢迎您, {{ admin.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="openAvatarDialog">修改头像</el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改头像" :visible.sync="avatarDialogVisible" width="400px" :append-to-body="true">
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :on-change="handleAvatarChange"
        :auto-upload="false"
        accept="image/jpeg,image/png,image/gif"
      >
        <img v-if="newAvatarUrl" :src="newAvatarUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div class="upload-tip">请选择图片，推荐大小200x200，格式为JPG/PNG/GIF</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="avatarDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAvatar" :loading="uploading">确 定 上 传</el-button>
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
      admin: {
        id: null,
        name: '管理员',
        image: require('@/assets/avatar.jpg') // 默认头像
      },
      avatarDialogVisible: false,
      uploading: false,
      newAvatarFile: null,
      newAvatarUrl: ''
    }
  },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    
    // 获取管理员信息的方法
    getAdminInfo() {
      const adminId = localStorage.getItem('id');
      if (!adminId) {
        console.warn("在 localStorage 中未找到 'id'，无法获取管理员信息");
        return; // 如果没有ID，则不发送请求
      }
      this.admin.id = adminId;

      this.req({
        url: '/admins',
        method: 'get',
        params: { id: this.admin.id }
      }).then(data => {
        if (data) {
          this.admin.name = data.adminName || '管理员';
          if (data.image) {
            this.admin.image = data.image;
          }
        }
      }).catch(err => {
        console.error("Navbar: GET /admins 请求失败:", err);
        // 页面加载时的查询失败可以不打扰用户，只在控制台报错
      });
    },

    logout() {
      this.$confirm('确定要退出登录吗？', '提示', { type: 'warning' })
        .then(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          localStorage.removeItem('hasLogin');
          localStorage.removeItem('id');
          this.$router.push('/login');
        }).catch(() => {});
    },

    // 【核心修正】打开修改头像弹窗时，不再查询信息
    openAvatarDialog() {
      // 检查ID是否存在，如果页面加载时获取失败，在这里给用户一个提示
      if (!this.admin.id) {
        this.$message.error("无法获取管理员ID，请刷新页面或重新登录后再试。");
        return;
      }
      // 准备并打开弹窗
      this.newAvatarFile = null;
      this.newAvatarUrl = '';
      this.avatarDialogVisible = true;
    },

    handleAvatarChange(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return;
      }
      this.newAvatarFile = file.raw;
      this.newAvatarUrl = URL.createObjectURL(file.raw);
    },

    submitAvatar() {
      if (!this.newAvatarFile) {
        this.$message.warning("请先选择一张图片");
        return;
      }
      if (!this.admin.id) {
        this.$message.error("无法获取管理员ID，请刷新页面或重新登录后再试！");
        return;
      }
      this.uploading = true;
      const formData = new FormData();
      formData.append('image', this.newAvatarFile);
      formData.append('id', this.admin.id);

      this.req({
        url: '/upload',
        method: 'post',
        data: formData
      }).then(newUrl => {
        this.$message.success("头像上传成功！");
        this.admin.image = newUrl;
        this.avatarDialogVisible = false;
      }).catch(err => {
        console.error("头像上传失败:", err);
      }).finally(() => {
        this.uploading = false;
      });
    }
  },
  created() {
    // 【核心修正】组件创建时，自动请求管理员信息
    this.getAdminInfo();
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
    .el-breadcrumb__inner a:hover,
    .el-breadcrumb__inner.is-link:hover {
      color: #ffffff;
    }
    .el-breadcrumb__inner:not(.is-link) {
      color: #ffffff;
      font-weight: bold;
    }
    .el-breadcrumb__separator {
      color: #a0a0a0;
    }
  }
}

/* 上传组件样式 */
.avatar-uploader {
  text-align: center;
  margin-bottom: 10px;
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 6px;
}
.upload-tip {
  text-align: center;
  color: #8c939d;
  font-size: 12px;
}
</style>
