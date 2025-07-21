<template>
  <div class="app-container">
    <div class="content-card">
      <div class="filter-container">
        <el-form :inline="true" :model="searchQuery">
          <el-form-item label="房间号">
            <el-input v-model="searchQuery.number" placeholder="请输入房间号" clearable />
          </el-form-item>
          <el-form-item label="房间类型">
            <el-select v-model="searchQuery.type" placeholder="请选择房间类型" clearable>
              <el-option label="单人房" :value="1" />
              <el-option label="双人房" :value="2" />
              <el-option label="三人房" :value="3" />
              <el-option label="大床房" :value="4" />
              <el-option label="豪华套房" :value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="房间状态">
            <el-select v-model="searchQuery.state" placeholder="请选择房间状态" clearable>
                <el-option label="空闲" :value="0" />
                <el-option label="已入住" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="可住人数">
            <el-input-number v-model="searchQuery.max_people" :min="1" placeholder="人数" />
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
          <template slot-scope="{ row }">{{ row.type.typeName }}</template>
        </el-table-column>
        <el-table-column label="价格" align="center">
          <template slot-scope="{ row }">¥{{ row.type.price }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.state === 0 ? 'success' : 'info'">{{ row.state === 0 ? '空闲' : '已入住' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="可住人数" prop="maxPeople" align="center" />
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="编辑房间信息" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px">
        <el-form-item label="房间号" prop="number">
          <el-input v-model.number="editForm.number" />
        </el-form-item>
        <el-form-item label="房间类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择房间类型" style="width:100%;">
            <el-option label="单人房" :value="1" />
            <el-option label="双人房" :value="2" />
            <el-option label="三人房" :value="3" />
            <el-option label="大床房" :value="4" />
            <el-option label="豪华套房" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="可住人数" prop="max_people">
          <el-input-number v-model="editForm.max_people" :min="1" style="width:100%;" />
        </el-form-item>
        <el-form-item label="房间状态" prop="state">
          <el-select v-model="editForm.state" placeholder="请选择房间状态" style="width:100%;">
            <el-option label="空闲" :value="0" />
            <el-option label="已入住" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <el-input type="textarea" v-model="editForm.introduce" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpdate" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RoomSearch',
  data() {
    return {
      tableData: [], loading: false, submitLoading: false,
      searchQuery: { number: '', type: null, state: null, max_people: null },
      dialogVisible: false,
      editForm: {},
      rules: {
        number: [ { required: true, message: '房间号是必填项', trigger: 'blur' } ],
        type: [ { required: true, message: '房间类型是必填项', trigger: 'change' } ],
        max_people: [ { required: true, message: '可住人数是必填项', trigger: 'blur' } ]
      }
    };
  },
  created() { this.listRooms(); },
  methods: {
    listRooms() {
      this.loading = true;
      this.req({
        url: '/rooms', method: 'get', params: this.searchQuery 
      }).then(data => {
        this.tableData = data; 
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    handleSearch() { this.listRooms(); },
    resetSearchForm() {
      this.searchQuery = { number: '', type: null, state: null, max_people: null };
      this.listRooms();
    },
    handleUpdate(row) {
      this.editForm = {
        id: row.id,
        number: row.number,
        type: row.type.id,
        state: row.state,
        max_people: row.maxPeople,
        introduce: row.introduce
      };
      this.dialogVisible = true;
      this.$nextTick(() => { this.$refs.editFormRef.clearValidate(); });
    },
    submitUpdate() {
      this.$refs.editFormRef.validate((valid) => {
        if(valid) {
          this.submitLoading = true;
          this.req({
            url: '/rooms',
            method: 'put',
            data: this.editForm
          }).then(() => {
            this.dialogVisible = false;
            this.$message.success('修改成功！');
            this.listRooms();
          }).finally(() => { this.submitLoading = false; });
        }
      });
    },
    handleDelete(row) {
      this.$confirm(`确定要删除房间【${row.number}】吗？`, '提示', { type: 'warning' })
      .then(() => {
        this.req({
          url: '/rooms',
          method: 'delete',
          params: { number: row.number } 
        }).then(() => {
          this.$message.success('删除成功！');
          this.listRooms();
        });
      }).catch(() => { this.$message.info('已取消删除'); });
    }
  }
};
</script>

<style scoped>
.app-container { padding: 20px; }

.filter-container { padding-bottom: 20px; }
</style>