<template>
  <div class="user-table">
    <div class="content-card">
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="订单ID" align="center" width="80"></el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center" width="80"></el-table-column>
        <el-table-column prop="roomId" label="房间ID" align="center" width="80"></el-table-column>
        
        <!-- 【核心修正】使用格式化函数来显示时间 -->
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
      }).then((data) => {
        // 因为拦截器已处理，data 在这里就是最终的数据数组
        this.tableData = data || [];
      }).catch(err => {
        console.error("获取已处理订单失败:", err);
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
