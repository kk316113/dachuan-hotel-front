<template>
  <div class="report-container">
    <el-card  class="transparent-card">
      <div slot="header" class="report-title">
        <span>月度营业额报表</span>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%; margin-bottom: 30px;">
          <el-table-column prop="month" label="月份" width="120"></el-table-column>
          <el-table-column prop="revenue" label="营业额（元）"></el-table-column>
          <el-table-column label="柱状图">
            <template slot-scope="scope">
              <div class="bar" :style="{width: (scope.row.revenue / maxRevenue * 200) + 'px'}"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Report',
  data() {
    return {
      tableData: [
        { month: '2025-01', revenue: 12000 },
        { month: '2025-02', revenue: 15000 },
        { month: '2025-03', revenue: 18000 },
        // ...可以继续补充
      ]
    };
  },
    computed: {
    maxRevenue() {
      // 取最大值，避免除以0
      return Math.max(...this.tableData.map(item => item.revenue), 1);
    }
  },
  methods: {
    listReport() {
      this.loading = true;
      this.req({
        url: "/report/incomeMonthly",
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
  }, mounted() {
    this.listReport();
  }
};
</script>

<style scoped>
.report-container {
  padding: 24px;
}
.transparent-card {
  background: transparent !important;
  box-shadow: none;
  border: none !important;
}
.report-title {
  font-size: 22px;
  font-weight: bold;
}
.bar {
  height: 20px;
  background: #409EFF;
  border-radius: 4px;
  transition: width 0.3s;
  display: inline-block;
}
</style>