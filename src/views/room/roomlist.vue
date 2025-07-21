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
      
      <el-table-column prop="typeText" label="房间类型" align="center" width="150" />
      
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
        .then((roomList) => { // 1. 直接接收拦截器返回的房间数组
          
          // 2. 在这里循环处理数据
          roomList.forEach(room => {
            // 为每个 room 对象添加一个新的属性 typeText
            switch (room.type) {
              case 1: room.typeText = "单人房"; break;
              case 2: room.typeText = "双人房"; break;
              case 3: room.typeText = "三人房"; break;
              case 4: room.typeText = "大床房"; break;
              case 5: room.typeText = "豪华套房"; break;
              default: room.typeText = "未知类型";
            }
          });
          
          this.tableData = roomList; // 3. 将处理好的数据赋值给表格
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