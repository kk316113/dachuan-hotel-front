<template>
  <div class="app-container">
    <el-row>
      <el-col :span="16" :offset="4">
        <div class="content-card">
          <div class="card-header">
            <span>修改用户信息</span>
          </div>
          <!-- v-if="userForm.id" 确保在数据加载完成前不显示表单，避免闪烁 -->
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
              <!-- 假设后端返回的创建时间字段是 createTime -->
              <el-input :value="userForm.createTime" disabled></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitUpdate" :loading="loading">确认修改</el-button>
                <el-button @click="goBack">返回列表</el-button>
            </el-form-item>
          </el-form>
          <!-- 数据加载时显示loading状态 -->
          <div v-else v-loading="loading" style="text-align: center; padding: 20px;">正在加载用户信息...</div>
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
        phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 【核心改造】根据 ID 查询用户信息
    getUserDetail(id) {
      this.loading = true;
      // 【最终方案】既然后端强制要求分页，我们就提供分页参数来请求列表
      this.req({
        url: `/users`, 
        method: 'get',
        params: {
          page: 1,        // 请求第一页
          pageSize: 100   // 请求一个足够大的数量，确保能包含目标用户
        }
      }).then(response => {
        // 这里的 response 是后端返回的完整对象 { code, msg, data }
        // data 属性就是那个 List<User>
        if (response && response.code === 1 && Array.isArray(response.data)) {
          // 在返回的列表中，用 find 方法找到 ID 匹配的用户
          // 使用 == 进行比较，因为从 URL 获取的 id 可能是字符串，而 user.id 是数字
          const user = response.data.find(u => u.id == id);
          
          if (user) {
            // 如果找到了用户，填充表单
            this.userForm = {
              ...user,
              // 后端返回的可能是 userName，也可能是 user_name，做兼容处理
              user_name: user.userName || user.user_name 
            };
          } else {
            this.$message.error(`在返回的用户列表中未找到ID为 ${id} 的用户`);
            this.goBack();
          }
        } else {
          this.$message.error(response.msg || '获取用户列表失败');
          this.goBack();
        }
      }).catch((err) => {
        this.$message.error('获取用户信息时出错');
        console.error("获取用户详情失败:", err);
        this.goBack();
      }).finally(() => {
        this.loading = false;
      });
    },
    
    // 提交修改的方法是正确的，保持不变
    submitUpdate() {
      this.$refs.userFormRef.validate(valid => {
        if (valid) {
          this.loading = true;
          this.req({
            url: '/users',
            method: 'put',
            data: this.userForm 
          }).then((response) => {
            if (response && response.code === 1) {
              this.$message.success('修改成功！');
              this.goBack(); 
            } else {
              this.$message.error(response.msg || '修改失败，请重试');
            }
          }).catch((err) => {
            this.$message.error('请求服务器时发生错误');
            console.error("提交修改失败:", err);
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    },

    goBack() {
      // 返回上一页是更好的用户体验
      this.$router.go(-1);
    }
  },
  created() {
    const userId = this.$route.query.id;
    if (userId) {
      this.getUserDetail(userId);
    } else {
      this.$message.error('未在URL中找到用户ID');
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
