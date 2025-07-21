<template>
  <div class="app-container">
    <div class="content-card">
      <div class="filter-container">
        <el-form :inline="true" :model="searchQuery" class="demo-form-inline">
          <el-form-item label="房间号">
            <el-input v-model="searchQuery.number" placeholder="请输入房间号" clearable />
          </el-form-item>
          <el-form-item label="房间类型">
            <el-select v-model="searchQuery.type" placeholder="请选择房间类型" clearable>
              <el-option v-for="(label, value) in typeMap" :key="value" :label="label" :value="parseInt(value)" />
            </el-select>
          </el-form-item>
          <el-form-item label="房间状态">
            <el-select v-model="searchQuery.state" placeholder="请选择房间状态" clearable>
              <el-option label="空闲" :value="0" />
              <el-option label="已入住" :value="1" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="可住人数">
            <el-input v-model.number="searchQuery.max_people" placeholder="请输入可住人数" clearable />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetSearchForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table v-loading="loading" :data="tableData" border fit stripe style="width: 100%;">
        <el-table-column label="ID" prop="id" align="center" width="80" />
        <el-table-column label="房间号" prop="number" align="center" />
        
        <el-table-column label="房间类型" align="center">
          <template slot-scope="{ row }">{{ typeMap[row.type] || '未知类型' }}</template>
        </el-table-column>
        
        <el-table-column label="状态" align="center">
            <template slot-scope="{ row }">
            <el-tag :type="row.state === 0 ? 'success' : 'info'">{{ row.state === 0 ? '空闲' : '已入住' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="可住人数" prop="maxPeople" align="center" />
        <el-table-column label="介绍" prop="introduce" align="center" show-overflow-tooltip />
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="编辑房间信息" :visible.sync="editDialogVisible" width="500px">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item label="房间号" prop="number">
          <el-input v-model.number="editForm.number" />
        </el-form-item>
        <el-form-item label="房间类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择房间类型">
            <el-option v-for="(label, value) in typeMap" :key="value" :label="label" :value="parseInt(value)" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="可住人数" prop="max_people">
          <el-input v-model.number="editForm.max_people" placeholder="请输入可住人数" />
        </el-form-item>

        <el-form-item label="房间状态" prop="state">
          <el-select v-model="editForm.state" placeholder="请选择房间状态">
            <el-option label="空闲" :value="0" />
            <el-option label="已入住" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input type="textarea" v-model="editForm.introduce" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="editDialogVisible = false">取消</el-button> <el-button type="primary" @click="submitUpdate" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RoomSearch',
  data() {
    return {
      tableData: [], 
      loading: false, 
      submitLoading: false, 
      editDialogVisible: false, // 【修正】原代码变量名是 dialogVisible，与 el-dialog 的 v-model 不一致，已统一为 editDialogVisible
      typeMap: {
        1: '单人房',
        2: '双人房',
        3: '三人房',
        4: '大床房',
        5: '豪华套房'
      },
      searchQuery: { number: '', type: null, state: null, max_people: null },
      editForm: {},
      rules: {
        number: [{ required: true, message: '房间号是必填项', trigger: 'blur' }],
        type: [{ required: true, message: '房间类型是必填项', trigger: 'change' }],
        max_people: [{ required: true, message: '可住人数是必填项', trigger: 'blur' }]
      }
    };
  },
  created() { 
    this.listRooms(); 
  },
  methods: {
    listRooms() {
      this.loading = true;
      this.req({
        url: '/rooms', method: 'get', params: this.searchQuery
      }).then(data => {
        this.tableData = data || []; // 确保即使返回 null 也不会报错
      }).finally(() => {
        this.loading = false;
      });
    },
    handleSearch() { 
      this.listRooms(); 
    },
    resetSearchForm() {
      this.searchQuery = { number: '', type: null, state: null, max_people: null };
      this.listRooms();
    },
    handleUpdate(row) {
      this.editForm = {
        id: row.id,
        number: row.number,
        type: row.type,
        state: row.state,
        max_people: row.maxPeople, // 命名保持不变
        introduce: row.introduce
      };
      this.editDialogVisible = true; // 【修正】使用统一后的变量名
      this.$nextTick(() => { 
        if (this.$refs.editFormRef) { 
          this.$refs.editFormRef.clearValidate(); 
        } 
      });
    },
    submitUpdate() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.req({
            url: '/rooms', method: 'put', data: this.editForm
          }).then(() => {
            this.editDialogVisible = false; // 【修正】使用统一后的变量名
            this.$message.success('修改成功！');
            this.listRooms();
          }).finally(() => { 
            this.submitLoading = false; 
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm(`确定要删除房间【${row.number}】吗？`, '提示', { type: 'warning' })
        .then(() => {
          this.req({
            url: '/rooms', method: 'delete', params: { number: row.number }
          }).then(() => {
            this.$message.success('删除成功！');
            this.listRooms();
          });
        }).catch(() => { 
          this.$message.info('已取消删除'); 
        });
    }
  }
};
</script>

<style scoped>
.app-container { padding: 20px; }
/* .content-card { background-color: rgba(50, 50, 50, 0.4); backdrop-filter: blur(4px); border-radius: 8px; padding: 20px; color: #fff; box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); } */
.filter-container { padding-bottom: 20px; }
</style>