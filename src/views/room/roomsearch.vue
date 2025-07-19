<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="searchQuery" class="demo-form-inline">
        <el-form-item label="房间号">
          <el-input v-model="searchQuery.number" placeholder="请输入房间号" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间类型">
          <el-select v-model="searchQuery.type" placeholder="请选择房间类型" clearable>
            <el-option label="单人房" :value="1"></el-option>
            <el-option label="双人房" :value="2"></el-option>
            <el-option label="三人房" :value="3"></el-option>
            <el-option label="大床房" :value="4"></el-option>
            <el-option label="豪华套房" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间状态">
          <el-select v-model="searchQuery.state" placeholder="请选择房间状态" clearable>
            <el-option label="空闲" :value="0"></el-option>
            <el-option label="已入住" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可住人数">
            <el-input-number v-model="searchQuery.max_people" :min="1" placeholder="可住人数"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :data="tableData" border fit style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="80"></el-table-column>
       <el-table-column label="房间号" prop="number" align="center"></el-table-column>
       <el-table-column label="房间类型" align="center">
         <template slot-scope="{row}"><span>{{ row.type.typeName }}</span></template>
       </el-table-column>
       <el-table-column label="价格" align="center">
         <template slot-scope="{row}"><span>¥{{ row.type.price }}</span></template>
       </el-table-column>
       <el-table-column label="状态" prop="state" align="center"></el-table-column>
       <el-table-column label="可住人数" prop="maxPeople" align="center"></el-table-column>
       <el-table-column label="介绍" prop="introduce" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑房间信息" :visible.sync="editDialogVisible">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="房间号">
          <el-input v-model="editForm.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间类型">
          <el-select v-model="editForm.type" placeholder="请选择房间类型">
            <el-option label="单人房" :value="1"></el-option>
            <el-option label="双人房" :value="2"></el-option>
            <el-option label="三人房" :value="3"></el-option>
            <el-option label="大床房" :value="4"></el-option>
            <el-option label="豪华套房" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间状态">
          <el-select v-model="editForm.state" placeholder="请选择房间状态">
            <el-option label="空闲" :value="0"></el-option>
            <el-option label="已入住" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可住人数">
          <el-input-number v-model="editForm.max_people" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input type="textarea" v-model="editForm.introduce"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate">确 定</el-button>
      </div>
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
      searchQuery: { number: '', type: null, state: null, max_people: null },
      editDialogVisible: false,
      editForm: {
        id: null,
        number: '',
        type: null,
        state: null,
        max_people: null,
        introduce: ''
      }
    };
  },
  created() {
    this.listRooms();
  },
  methods: {
    // listRooms() {
    //   this.loading = true;
    //   this.req({
    //       url: "/rooms",
    //       method: "get",
    //       params: this.searchQuery
    //   }).then((res) => {
    //       this.tableData = res.data;
    //       for (var i = 0; i < this.tableData.length; ++i) {
    //           if (this.tableData[i].state == 0) {
    //               this.tableData[i].state = "空闲";
    //           } else if (this.tableData[i].state == 1) {
    //               this.tableData[i].state = "已入住";
    //           }
    //       }
    //       this.loading = false;
    //   }).catch(err => {
    //       this.loading = false;
    //       console.error("获取房间列表失败", err);
    //   });
    // },
    //test
    listRooms() {
      this.loading = true; // 开始加载

      // --- 关键改动在这里 ---
      // 1. 将上面提供的 JSON 数组粘贴到这里
      const staticRoomData = [
        { "id": 101, "number": "101", "type": { "id": 4, "typeName": "大床房", "price": 350.00 }, "state": 0, "maxPeople": 2, "introduce": "视野开阔，配备舒适的1.8米宽大床，适合商旅人士。" },
        { "id": 202, "number": "202", "type": { "id": 2, "typeName": "双人房", "price": 420.00 }, "state": 1, "maxPeople": 2, "introduce": "房间内有两张独立的单人床，适合朋友或同事结伴出游。" },
        { "id": 305, "number": "305", "type": { "id": 1, "typeName": "单人房", "price": 280.00 }, "state": 0, "maxPeople": 1, "introduce": "经济实惠的单人房，设施齐全，安静舒适。" },
        { "id": 508, "number": "508", "type": { "id": 5, "typeName": "豪华套房", "price": 880.00 }, "state": 0, "maxPeople": 3, "introduce": "包含独立客厅和卧室的豪华套房，提供尊贵体验。" },
        { "id": 203, "number": "203", "type": { "id": 2, "typeName": "双人房", "price": 420.00 }, "state": 0, "maxPeople": 2, "introduce": "房间内有两张独立的单人床，窗外是花园景色。" },
        { "id": 301, "number": "301", "type": { "id": 3, "typeName": "三人房", "price": 550.00 }, "state": 1, "maxPeople": 3, "introduce": "适合家庭出游，包含一张双人床和一张单人床。" }
      ];

      // 2. 使用 setTimeout 模拟网络延迟，让 loading 效果更明显
      setTimeout(() => {
        // 3. 将静态数据赋值给 tableData，并保留你原有的数据处理逻辑
        this.tableData = staticRoomData;
        for (var i = 0; i < this.tableData.length; ++i) {
          if (this.tableData[i].state == 0) {
            this.tableData[i].state = "空闲";
          } else if (this.tableData[i].state == 1) {
            this.tableData[i].state = "已入住";
          }
        }
        this.loading = false; // 数据加载完成，结束 loading
      }, 500); // 模拟500毫秒的延迟
    },
    handleSearch() { this.listRooms(); },
    resetSearchForm() {
      this.searchQuery = { number: '', type: null, state: null, max_people: null };
      this.listRooms();
    },
    // 1. 修改 - 打开对话框并填充数据
    handleUpdate(row) {
      this.editForm = Object.assign({}, row); 
      if (typeof row.type === 'object' && row.type !== null) {
        this.editForm.type = row.type.id;
      }
      if (row.state === '空闲') {
        this.editForm.state = 0;
      } else if (row.state === '已入住') {
        this.editForm.state = 1;
      }
      this.editDialogVisible = true; // 打开对话框
    },

    // 2. 修改 - 提交更新
    submitUpdate() {
      this.req({
        url: '/rooms',
        method: 'put',
        data: this.editForm 
      }).then(res => {
        this.editDialogVisible = false; // 关闭对话框
        this.$message.success('修改成功！');
        this.listRooms(); // 刷新列表
      });
    },

    // 3. 删除
    handleDelete(row) {
      this.$confirm(`确定要删除房间【${row.number}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.req({
          url: '/rooms',
          method: 'delete',
          params: { number: row.number }
        }).then(res => {
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
.filter-container { padding-bottom: 20px; }
.app-container { padding: 20px; }
</style>