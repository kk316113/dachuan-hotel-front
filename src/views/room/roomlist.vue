<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      fit
      highlight-current-row
      style="width: 75%; margin: 0 auto;"
    >
      <el-table-column prop="id" label="ID" align="center" width="80" />
      <el-table-column prop="number" label="房间号" align="center" width="120" />
      <el-table-column prop="type.typeName" label="房间类型" align="center" width="150" />
      <el-table-column prop="state" label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state === 0 ? 'success' : 'info'">
             {{ scope.row.state === 0 ? '空闲' : '已入住' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="introduce" label="介绍" min-width="300" header-align="center" />
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  methods: {
    listRooms() {
      this.loading = true;
      this.req({
        url: "/rooms",
        method: "get",
      })
        .then((res) => {
          // --- 唯一的、最关键的修改在这里 ---
          // 从返回的对象 res 中，取出 data 属性（即房间数组）
          this.tableData = res.data;
          
          this.loading = false;
        })
        .catch((err) => {
          console.error("获取房间列表失败:", err);
          this.loading = false;
        });
    },
  },
  created() {
    this.listRooms();
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>