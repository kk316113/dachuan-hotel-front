<template>
  <div class="app-container">
    <el-row>
      <el-col :span="16" :offset="4">
        <div class="content-card">
          <div class="card-header">
            <span>修改用户信息</span>
          </div>
          <el-form v-if="userForm.id" :model="userForm" :rules="rules" ref="userFormRef" label-width="100px" class="change-form">
            <el-form-item label="用户ID">
              <el-input :value="userForm.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="user_name">
              <el-input v-model="userForm.user_name" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="userForm.sex" placeholder="请选择性别" style="width:100%;">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="userForm.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="userForm.state" placeholder="请选择状态" style="width:100%;">
                <el-option label="会员" :value="1"></el-option>
                <el-option label="游客" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-input :value="userForm.createTime" disabled></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitUpdate" :loading="loading">确认修改</el-button>
                <el-button @click="goBack">返回列表</el-button>
            </el-form-item>
          </el-form>
          <div v-else v-loading="loading">正在加载用户信息...</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ChangeUser',
  data() {
    return {
      loading: false,
      userForm: {}, // 初始化为空对象，通过查询填充
      rules: {
        user_name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        // 可根据需要添加其他验证规则
      }
    }
  },
  methods: {
    // 1.3 (前半部分) 根据 ID 查询用户信息
    getUserDetail(id) {
      this.loading = true;
      // 注意：你的 API 文档没有提供“根据ID查询单个用户”的接口
      // 这里我们假设它是一个标准的 GET /users/{id} 接口
      this.req({
        url: `/users/${id}`,
        method: 'get'
      }).then(data => {
        // 将后端返回的 userName 映射到表单需要的 user_name
        this.userForm = {
          ...data,
          user_name: data.userName 
        };
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    // 1.3 (后半部分) 提交修改
    submitUpdate() {
      this.$refs.userFormRef.validate(valid => {
        if (valid) {
          this.loading = true;
          this.req({
            url: '/users',
            method: 'put',
            data: this.userForm // 表单数据对象的字段名已和 API 一致
          }).then(() => {
            this.$message.success('修改成功！');
            this.loading = false;
            this.goBack(); // 修改成功后返回列表页
          }).catch(() => { this.loading = false; });
        }
      });
    },
    goBack() {
      this.$router.push('/user/query-user');
    }
  },
  created() {
    const userId = this.$route.query.id;
    if (userId) {
      this.getUserDetail(userId);
    } else {
      this.$message.error('未提供用户ID');
      this.goBack();
    }
  }
}
</script>

<style scoped>
.app-container { padding: 20px; }
.content-card { background-color: rgba(50, 50, 50, 0.4); backdrop-filter: blur(4px); border-radius: 8px; padding: 20px; color: #fff; box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); }
.card-header { font-size: 18px; font-weight: bold; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 20px; }
.change-form { margin-top: 20px; }
</style>