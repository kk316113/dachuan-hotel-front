<template>
  <div class="app-container">
    <div class="content-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column prop="id" label="ID" align="center" width="80" />
        <el-table-column prop="number" label="房间号" align="center" />
        <el-table-column prop="type.typeName" label="房间类型" align="center" />
        <el-table-column label="价格" align="center">
          <template slot-scope="{row}">¥{{ row.type.price }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state === 0 ? 'success' : 'info'">
              {{ row.state === 0 ? '空闲' : '已入住' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="maxPeople" label="可住人数" align="center" />
        <el-table-column prop="introduce" label="介绍" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoomList',
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
      }).then((data) => {
          // 智能拦截器已处理，data 就是最终的房间数组
          this.tableData = data;
          this.loading = false;
        }).catch(() => {
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
.app-container { padding: 20px; }
</style>