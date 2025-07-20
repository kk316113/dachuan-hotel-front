<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="searchQuery" class="demo-form-inline">
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
          <el-input-number v-model="searchQuery.max_people" :min="1" placeholder="可住人数" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :data="tableData" border fit style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="房间号" prop="number" align="center" />
      <el-table-column label="房间类型" align="center">
        <template slot-scope="{ row }">{{ row.type ? row.type.typeName : '' }}</template>
      </el-table-column>
      <el-table-column label="价格" align="center">
        <template slot-scope="{ row }">¥{{ row.type ? row.type.price : '' }}</template>
      </el-table-column>
      <el-table-column label="状态" align="center">
         <template slot-scope="{ row }">
          <el-tag :type="row.state === 0 ? 'success' : 'info'">
            {{ row.state === 0 ? '空闲' : '已入住' }}
          </el-tag>
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

    <el-dialog title="编辑房间信息" :visible.sync="editDialogVisible" width="500px">
      <el-form :model="editForm" label-width="100px" ref="editFormRef">
        <el-form-item label="房间号">
          <el-input v-model="editForm.number" />
        </el-form-item>
        <el-form-item label="房间类型">
          <el-select v-model="editForm.type" placeholder="请选择房间类型">
            <el-option label="单人房" :value="1" />
            <el-option label="双人房" :value="2" />
            <el-option label="三人房" :value="3" />
            <el-option label="大床房" :value="4" />
            <el-option label="豪华套房" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="房间状态">
          <el-select v-model="editForm.state" placeholder="请选择房间状态">
            <el-option label="空闲" :value="0" />
            <el-option label="已入住" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="可住人数">
          <el-input-number v-model="editForm.max_people" :min="1" />
        </el-form-item>
        <el-form-item label="介绍">
          <el-input type="textarea" v-model="editForm.introduce" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
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
      tableData: [],
      loading: false,
      submitLoading: false,
      searchQuery: {
        number: '',
        type: null,
        state: null,
        max_people: null 
      },
      editDialogVisible: false,
      editForm: {}
    };
  },
  created() {
    this.listRooms();
  },
  methods: {
    listRooms() {
      this.loading = true;
      this.req({
        url: '/rooms',
        method: 'get',
        params: this.searchQuery 
      }).then(res => {
        this.tableData = res.data; 
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.error('获取房间列表失败', err);
      });
    },
//test
// listRooms() {
//   this.loading = true;
//   this.req({
//     url: '/rooms',
//     method: 'get'
//   }).then(res => {
//     let allRooms = res.data;
//     if (this.searchQuery.number) {
//       allRooms = allRooms.filter(room => 
//         room.number.includes(this.searchQuery.number)
//       );
//     }
//     if (this.searchQuery.type !== null && this.searchQuery.type !== '') {
//       allRooms = allRooms.filter(room => 
//         room.type.id === this.searchQuery.type
//       );
//     }
//     if (this.searchQuery.state !== null && this.searchQuery.state !== '') {
//       allRooms = allRooms.filter(room => 
//         room.state === this.searchQuery.state
//       );
//     }
//     if (this.searchQuery.max_people) {
//       allRooms = allRooms.filter(room => 
//         room.maxPeople >= this.searchQuery.max_people
//       );
//     }
//     this.tableData = allRooms;
//     this.loading = false;
//   }).catch(err => {
//     this.loading = false;
//     console.error('获取房间列表失败', err);
//   });
// },
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
        typeId: row.type.id,
        state: row.state,
        maxPeople: row.maxPeople,
        introduce: row.introduce
      };
      this.editDialogVisible = true;
    },
    submitUpdate() {
      this.submitLoading = true;
      const payload = {
          id: this.editForm.id,
          number: this.editForm.number,
          type: this.editForm.typeId,
          state: this.editForm.state,
          max_people: this.editForm.maxPeople,
          introduce: this.editForm.introduce
      };
      
      this.req({
        url: `/rooms/${payload.id}`,
        method: 'put',
        data: payload
      }).then(() => {
        this.editDialogVisible = false;
        this.$message.success('修改成功！');
        this.listRooms();
      }).finally(() => {
        this.submitLoading = false;
      });
    },
    handleDelete(row) {
      this.$confirm(`确定要删除房间【${row.number}】吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.req({
          url: `/rooms/${row.id}`,
          method: 'delete'
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
.filter-container {
  padding-bottom: 20px;
}
.app-container {
  padding: 20px;
}
</style>