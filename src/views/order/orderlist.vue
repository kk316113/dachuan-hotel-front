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

        <el-table-column label="订单状态" align="center">
            <template slot-scope="{row}">
                <el-tag :type="getTagType(row.flag)">{{ getFlagText(row.flag) }}</el-tag>
            </template>
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

<!-- <script>
export default {
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
        url: "/orders", // 核心修正：使用正确的 API 路径
        method: "get",
      }).then((res) => {
        this.tableData = res.data;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.error("获取待处理订单失败:", err);
      });
    },
    // "入住" 操作
    handleCheckIn(orderId) {
      this.$confirm("确定要为该订单办理入住吗？", "提示", {
        type: "success",
      }).then(() => {
        this.req({
          url: "/orders/check", // 核心修正：使用正确的 API 路径
          method: "get",
          params: { id: orderId }, // 根据文档，用 id 作为参数
        }).then((res) => {
          // API 文档中，code 为 0 是业务失败（不在入住时间）
          if (res.code === 1) {
            this.$message.success("办理入住成功！");
            this.listPendingOrders(); // 成功后刷新列表
          } else {
            // 如果 code 不为 1，说明是业务失败，弹出后端返回的 msg
            this.$message.error(res.msg || "办理入住失败，可能不在入住时间内");
          }
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
          url: "/orders", // 核心修正：使用正确的 API 路径
          method: "put",
          params: { id: orderId }, // 根据文档，用 id 作为参数
        }).then((res) => {
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
</script> -->
//test
<script>
export default {
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  methods: {
    listPendingOrders() {
      this.loading = true;
      this.req({
        url: "/orders",
        method: "get",
        params: { flag: 0 },
      }).then((res) => {
        // 核心修正 1：直接使用 res 作为数据源
        // 因为 json-server 返回的是数组，且你的拦截器可能未处理这种情况
        // 我们做一个兼容性判断，确保能拿到正确的数组
        this.tableData = Array.isArray(res) ? res : res.data;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.error("获取待处理订单失败:", err);
      });
    },
    // "入住" 操作 (保持不变)
    handleCheckIn(orderId) {
      this.$confirm("确定要为该订单办理入住吗？", "提示", {
        type: "success",
      }).then(() => {
        this.req({
          url: `/orders/${orderId}`,
          method: "patch",
          data: { flag: 1 },
        }).then((res) => {
          this.$message.success("模拟办理入住成功！");
          this.listPendingOrders();
        });
      }).catch(() => {
        this.$message.info("已取消操作");
      });
    },
    // "取消订单" 操作 (保持不变)
    handleCancel(orderId) {
      this.$confirm("确定要取消该订单吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.req({
          url: `/orders/${orderId}`,
          method: "patch",
          data: { flag: 2 },
        }).then((res) => {
          this.$message.success("模拟取消订单成功！");
          this.listPendingOrders();
        });
      }).catch(() => {
        this.$message.info("已取消操作");
      });
    },

    // 核心修正 3：添加辅助方法用于模板显示
    getFlagText(flag) {
        // 这个方法可以根据需要扩展，以匹配 historyOrder.vue
        if (flag === 0) return "未处理";
        return "未知状态";
    },
    getTagType(flag) {
        if (flag === 0) return "danger";
        return "info";
    }
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