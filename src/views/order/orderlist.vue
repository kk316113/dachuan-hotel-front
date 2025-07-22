<template>
  <div class="user-table">
    <div class="content-card">
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="订单ID" align="center" width="80"></el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center" width="80"></el-table-column>
        <el-table-column prop="roomId" label="房间ID" align="center" width="80"></el-table-column>
        <el-table-column label="下单时间" align="center" width="180">
            <template slot-scope="{row}">{{ formatDateTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="预定入住时间" align="center" width="180">
            <template slot-scope="{row}">{{ formatDateTime(row.inTime) }}</template>
        </el-table-column>

        <el-table-column prop="realPrice" label="总价" align="center">
            <template slot-scope="{row}">¥{{ row.realPrice }}</template>
        </el-table-column>
        <el-table-column prop="realPeople" label="入住人数" align="center"></el-table-column>
        <el-table-column label="订单状态" align="center">
            <el-tag type="danger">未处理</el-tag>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleCheckIn(scope.row.id)">入住</el-button>
            <el-button type="danger" size="mini" @click="handleCancel(scope.row.id)">取消订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderList',
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  methods: {
    // 获取待处理订单
    listPendingOrders() {
      this.loading = true;
      this.req({
        url: "/orders",
        method: "get",
      }).then((data) => {
        // 因为拦截器已处理，data 在这里就是最终的数据数组
        this.tableData = data || [];
      }).catch(err => {
        console.error("获取待处理订单失败:", err);
      }).finally(() => {
        this.loading = false;
      });
    },

    // 【新增】格式化时间戳的辅助函数
    formatDateTime(timestamp) {
      if (!timestamp) return 'N/A';
      const date = new Date(timestamp);
      return date.toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false 
      }).replace(/\//g, '-');
    },

    // "入住" 操作
    handleCheckIn(orderId) {
      this.$confirm("确定要为该订单办理入住吗？", "提示", {
        type: "success",
      }).then(() => {
        this.req({
          url: "/orders/checkIn", // 遵循 API 文档
          method: "get",
          params: { id: orderId },
        }).then(() => {
          // 能进入 .then 说明 code 就是 1，拦截器已处理失败情况
          this.$message.success("办理入住成功！");
          this.listPendingOrders(); // 成功后刷新列表
        });
      }).catch(() => {
        this.$message.info("已取消操作");
      });
    },
    // "取消订单" 操作
    handleCancel(orderId) {
      this.$confirm("确定要取消该订单吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.req({
          url: "/orders", // 遵循 API 文档
          method: "put",
          params: { id: orderId },
        }).then(() => {
          this.$message.success("取消订单成功！");
          this.listPendingOrders(); // 成功后刷新列表
        });
      }).catch(() => {
        this.$message.info("已取消操作");
      });
    },
  },
  created() {
    this.listPendingOrders();
  },
};
</script>

<style scoped>
.user-table {
  margin: 2rem;
}

</style>
