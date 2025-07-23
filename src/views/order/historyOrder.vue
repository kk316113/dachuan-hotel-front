<template>
  <div class="user-table">
    <div class="content-card">
      <!-- 表格现在绑定到 paginatedData 计算属性 -->
      <el-table v-loading="loading" :data="paginatedData" stripe style="width: 100%">
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
        <el-table-column prop="flag" label="订单状态" align="center">
            <template slot-scope="{row}">
                <el-tag :type="getTagType(row.flag)">{{ getFlagText(row.flag) }}</el-tag>
            </template>
        </el-table-column>
      </el-table>

      <!-- 【新增】分页组件 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryOrder',
  data() {
    return {
      allOrders: [], // 【修改】用于存储从后端获取的所有订单
      loading: false,
      // 【新增】分页相关状态
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    // 【新增】计算总条目数
    totalItems() {
      return this.allOrders.length;
    },
    // 【新增】计算当前页应该显示的数据
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.allOrders.slice(start, end);
    }
  },
  methods: {
    // 获取已处理订单
    listProcessedOrders() {
      this.loading = true;
      this.req({
        url: "/orders/complete",
        method: "get",
      }).then((data) => {
        // 【修改】将获取到的所有数据存入 allOrders
        this.allOrders = data || [];
      }).catch(err => {
        console.error("获取已处理订单失败:", err);
        this.allOrders = []; // 失败时清空
      }).finally(() => {
        this.loading = false;
      });
    },

    // 【新增】处理每页显示数量变化
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      this.currentPage = 1; // 切换每页大小时，回到第一页
    },

    // 【新增】处理当前页码变化
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },

    // 格式化时间戳的辅助函数
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
/* .content-card {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
} */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
