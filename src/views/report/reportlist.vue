<template>
  <div class="report-container">
    <el-card>
      <div slot="header">
        <span>月度营业额报表</span>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%; margin-bottom: 30px;">
          <el-table-column prop="month" label="月份" width="120"></el-table-column>
          <el-table-column prop="revenue" label="营业额（元）"></el-table-column>
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
  }
};
</script>

<style scoped>
.report-container {
  padding: 24px;
}
</style>