<template>
  <div class="user-table">
    <div class="content-card">
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

      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" align="center" width="80"></el-table-column>
        <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="{row}">{{ row.sex === 1 ? '男' : '女' }}</template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
           <template slot-scope="{row}">
            <el-tag :type="row.state === 1 ? 'success' : 'info'">
              {{ row.state === 1 ? '会员' : '游客' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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
  </div>
</template>

<script>
export default {
  name: 'QueryUser',
  data() {
    return {
      tableData: [],
      loading: false,
      totalItems: 0, // 总条目数
      searchQuery: {
        name: "",
        sex: null,
        email: "",
        phone: "",
        page: 1,
        pageSize: 10
      },
    };
  },
  methods: {
    // 1.1 显示用户（分页查询）
    listUser() {
      this.loading = true;
      this.req({
        url: "/users",
        method: "get",
        params: this.searchQuery
      }).then((data) => { // 拦截器已处理，data 就是最终的数据数组
        // 注意：真实分页时，后端通常会返回 { records: [...], total: 100 }
        // 这里我们先假设返回的数据就是当前页的列表
        this.tableData = data;
        // 假设 total 也由后端返回，如果没有，则前端分页 :total="tableData.length" 只是假分页
        // this.totalItems = res.total;
        this.loading = false;
      }).catch(() => { this.loading = false; });
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
      this.listUser();
    },
    handleCurrentChange(val) {
      this.searchQuery.page = val;
      this.listUser();
    },
    handleEdit(id) {
      this.$router.push({ path: '/user/change-user', query: { id: id }});
    },
    // 1.2 删除用户
    handleDelete(id) {
      this.$confirm("确定删除该用户？", "提示", { type: "warning" })
        .then(() => {
          this.req({
            url: `/users/${id}`, // RESTful 风格，将 id 放在路径中
            method: "delete",
          }).then(() => {
            this.$message.success("删除成功");
            this.listUser();
          });
        }).catch(() => { this.$message.info("已取消删除"); });
    },
  },
  created() {
    this.listUser();
  },
};
</script>

<style scoped>
.user-table { margin: 2rem; }
.filter-container { padding-bottom: 20px; }
.pagination-container { display: flex; justify-content: center; margin-top: 20px; }
</style>