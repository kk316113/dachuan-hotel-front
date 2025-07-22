<template>
  <div class="user-table-container">
    <div class="content-card">
      <!-- 搜索区域 -->
      <div class="filter-container">
        <el-form :inline="true" :model="searchQuery">
          <el-form-item label="用户名">
            <el-input v-model="searchQuery.name" placeholder="支持模糊查询" clearable />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="searchQuery.sex" placeholder="性别" clearable>
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="searchQuery.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchQuery.phone" placeholder="请输入手机号" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 用户列表表格 -->
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <!-- 【核心修正】将原来的ID列改为显示递增序号 -->
        <el-table-column label="序号" align="center" width="80">
          <template slot-scope="scope">
            {{ (searchQuery.page - 1) * searchQuery.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="{row}">{{ row.sex === 1 ? '男' : '女' }}</template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" align="center">
           <template slot-scope="{row}">
             <el-tag :type="row.state === 1 ? 'success' : 'info'">{{ row.state === 1 ? '会员' : '游客' }}</el-tag>
           </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="180">
           <template slot-scope="{row}">{{ formatDateTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchQuery.page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="searchQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑用户信息的弹窗 -->
    <el-dialog title="编辑用户信息" :visible.sync="editDialogVisible" width="600px" @close="cancelEdit">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户ID">
          <el-input :value="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editForm.sex" placeholder="请选择性别" style="width:100%;">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="editForm.state" placeholder="请选择状态" style="width:100%;">
            <el-option label="会员" :value="1"></el-option>
            <el-option label="游客" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="submitUpdate" :loading="submitLoading">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'QueryUser',
  data() {
    return {
      tableData: [],
      loading: false,
      totalItems: 0,
      searchQuery: {
        name: "",
        sex: null,
        email: "",
        phone: "",
        page: 1,
        pageSize: 10
      },
      editDialogVisible: false,
      submitLoading: false,
      editForm: {},
      editRules: {
        userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
      }
    };
  },
  methods: {
    // 【核心修正】显示用户（分页查询）
    listUser() {
      this.loading = true;
      this.req({
        url: "/users",
        method: "get",
        params: this.searchQuery
      }).then((data) => {
        // 假设 this.req 成功时直接返回 data 数组
        const resultData = data || [];
        this.tableData = resultData;

        // 【前端分页技巧】
        // 如果返回的数据量等于请求的每页数量，我们就假设还有下一页
        if (resultData.length === this.searchQuery.pageSize) {
          // “欺骗”分页组件，告诉它总数比当前已加载的至少多1，这样“下一页”按钮就可以点了
          this.totalItems = this.searchQuery.page * this.searchQuery.pageSize + 1;
        } else {
          // 如果返回的数据量小于每页数量，说明这是最后一页
          // 我们可以计算出真实的总数
          this.totalItems = (this.searchQuery.page - 1) * this.searchQuery.pageSize + resultData.length;
        }
        
      }).catch(() => {
        this.tableData = [];
        this.totalItems = 0;
      }).finally(() => {
        this.loading = false;
      });
    },
    formatDateTime(timestamp) {
      if (!timestamp) return 'N/A';
      const date = new Date(timestamp);
      return date.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      }).replace(/\//g, '-');
    },
    handleSearch() {
        this.searchQuery.page = 1;
        this.listUser();
    },
    resetQuery() {
      this.searchQuery = { name: "", sex: null, email: "", phone: "", page: 1, pageSize: 10 };
      this.listUser();
    },
    handleSizeChange(val) {
      this.searchQuery.pageSize = val;
      this.searchQuery.page = 1;
      this.listUser();
    },
    handleCurrentChange(val) {
      this.searchQuery.page = val;
      this.listUser();
    },
    handleEdit(row) {
      this.editForm = { ...row };
      this.editDialogVisible = true;
    },
    submitUpdate() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.req({
            url: '/users',
            method: 'put',
            data: this.editForm
          }).then(() => {
            this.$message.success('修改成功！');
            this.cancelEdit();
            this.listUser();
          }).catch(() => {
            // 拦截器已处理错误提示
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    cancelEdit() {
      this.editDialogVisible = false;
      if (this.$refs.editFormRef) {
        this.editForm = {}; // 清空表单
        this.$refs.editFormRef.clearValidate();
      }
    },
    handleDelete(id) {
      this.$confirm("确定删除该用户吗？此操作不可逆。", "警告", { type: "warning" })
        .then(() => {
          this.req({
            url: `/users`,
            method: "delete",
            params: { id: id }
          }).then(() => {
            this.$message.success("删除成功");
            this.listUser();
          });
        }).catch(() => { 
          this.$message.info("已取消删除"); 
        });
    },
  },
  created() {
    this.listUser();
  },
};
</script>

<style scoped>
.user-table-container { margin: 2rem; }
/* .content-card { background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); } */
.filter-container { padding-bottom: 20px; border-bottom: 1px solid #ebeef5; margin-bottom: 20px; }
.pagination-container { display: flex; justify-content: center; margin-top: 20px; }
</style>
