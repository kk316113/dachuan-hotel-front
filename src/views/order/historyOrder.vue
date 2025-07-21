<template>
  <div class="user-table">
    <div class="content-card">
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="订单ID" align="center" width="80"></el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center" width="80"></el-table-column>
        <el-table-column prop="roomId" label="房间ID" align="center" width="80"></el-table-column>
        <el-table-column prop="createTime" label="下单时间" align="center" width="180"></el-table-column>
        <el-table-column prop="inTime" label="预定入住时间" align="center" width="180"></el-table-column>
        <el-table-column prop="realPrice" label="总价" align="center">
            <template slot-scope="{row}">¥{{ row.realPrice }}</template>
        </el-table-column>
        <el-table-column prop="realPeople" label="入住人数" align="center"></el-table-column>
        <el-table-column prop="flag" label="订单状态" align="center">
            <template slot-scope="{row}">
                <el-tag :type="getTagType(row.flag)">{{ getFlagText(row.flag) }}</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryOrder',
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  methods: {
    // 获取已处理订单
    listProcessedOrders() {
      this.loading = true;
      this.req({
        url: "/orders/complete", // 遵循 API 文档
        method: "get",
      }).then((res) => {
        // 因为拦截器已处理，res 在这里就是最终的数据数组
        this.tableData = res;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.error("获取已处理订单失败:", err);
      });
    },
    // 辅助方法，用于在表格中显示状态文字
    getFlagText(flag) {
        switch (flag) {
            case 1: return "已入住";
            case 2: return "已退订";
            case 3: return "订单完成";
            default: return "未知状态";
        }
    },
    // 辅助方法，用于返回不同状态的标签颜色
    getTagType(flag) {
        switch (flag) {
            case 1: return "success";
            case 2: return "warning";
            case 3: return "info";
            default: return "primary";
        }
    }
  },
  created() {
    this.listProcessedOrders();
  },
};
</script>

<style scoped>
.user-table {
  margin: 2rem;
}
</style>