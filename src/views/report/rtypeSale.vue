<template>
  <div class="rtype-sale-container">
    <el-card class="transparent-card no-border-card">
      <div slot="header" class="report-title">
        <span>房型销量统计</span>
      </div>
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="roomType" label="房型" width="180"></el-table-column>
        <el-table-column prop="saleCount" label="销量"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RtypeSale',
  data() {
    return {
      tableData: [
        { roomType: '大床房', saleCount: 120 },
        { roomType: '双床房', saleCount: 98 },
        { roomType: '套房', saleCount: 45 },
        // ...可以继续补充
      ]
    };
    },
  methods: {
    rtypeListGet() {
      this.loading = true;
      this.req({
        url: "/report/rtypeSale",
        method: "get",
      })
        .then((res) => {
           const { roomTypeList, SaleList } = res.data;
          // 房型编号与名称映射
          const roomTypeMap = {
            0: '大床房',
            1: '单人房',
            2: '双人床',
            3: '三人床',
            4: '大床房',
            5: '豪华套房'
          };
          // 合并为对象数组
          let tableData = roomTypeList.map((type, idx) => ({
            roomType: roomTypeMap[type] || `类型${type}`,
            saleCount: SaleList[idx] || 0
          }));
          // 按销量降序排序
          tableData.sort((a, b) => b.saleCount - a.saleCount);
          this.tableData = tableData;
          this.loading = false;
        })
        .catch((err) => {
          console.error("获取房间列表失败:", err);
          this.loading = false;
        });
    }, mounted() {
    this.rtypeListGet();
  }
  }
};
</script>

<style scoped>
.rtype-sale-container {
  padding: 24px;
}
.transparent-card {
  background: transparent !important;
  box-shadow: none;
}
.no-border-card {
  border: none !important;
}
.report-title {
  font-size: 22px;
  font-weight: bold;
}
</style>