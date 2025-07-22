<template>
  <div class="rtype-sale-container">
    <el-card class="transparent-card no-border-card" v-loading="loading">
      <div slot="header" class="report-title">
        <span>近十二个月房型销量排名</span>
      </div>

      <!-- 【样式修改】调整栅格布局比例 -->
      <el-row :gutter="30">
        <!-- 左侧：标准饼图 -->
        <el-col :span="10">
          <div class="chart-title">销量占比</div>
          <div ref="pieChart" style="width: 100%; height: 400px;">
            <div v-if="!validData.length" class="no-data-placeholder">
              暂无有效销售数据
            </div>
          </div>
        </el-col>

        <!-- 右侧：销量排行榜表格 -->
        <el-col :span="14">
          <div class="chart-title">销量排行榜</div>
          <!-- 【样式修改】移除固定宽度，设置高度与图表一致 -->
          <el-table :data="tableData" style="width: 100%;" height="400px" empty-text="暂无数据">
            <el-table-column label="排名" width="80" align="center">
              <template slot-scope="scope">
                <span class="rank-badge" :class="'rank-' + (scope.$index + 1)">{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="roomType" label="房型"></el-table-column>
            <el-table-column prop="saleCount" label="销量" align="right" width="120">
                <template slot-scope="scope">
                    {{ scope.row.saleCount.toLocaleString() }}
                </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'RtypeSale',
  data() {
    return {
      tableData: [],
      pieChartInstance: null,
      colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
      loading: false
    };
  },
  computed: {
    validData() {
      return this.tableData.filter(item => item.saleCount > 0);
    }
  },
  watch: {
    validData: {
      deep: true,
      handler(newData) {
        this.$nextTick(() => {
          if (newData.length > 0) {
            this.drawPieChart();
          } else {
            this.clearCharts();
          }
        });
      }
    }
  },
  methods: {
    rtypeListGet() {
      this.loading = true;
      this.req({
        url: "/report/rTypeSale",
        method: "get"
      }).then((data) => {
        if (data && data.roomTypeList && data.saleList) {
          const { roomTypeList, saleList } = data;
          const roomTypeMap = {
            1: '单人房', 2: '双人房', 3: '三人房', 4: '大床房', 5: '豪华套房'
          };
          if (roomTypeList.length !== saleList.length) {
              this.$message.error("API返回的数据格式有误，数组长度不匹配");
              return;
          }
          this.tableData = roomTypeList.map((type, idx) => ({
            roomType: roomTypeMap[type] || `未知类型 ${type}`,
            saleCount: saleList[idx] || 0
          })).sort((a, b) => b.saleCount - a.saleCount);
        } else {
            this.tableData = [];
        }
      }).catch((err) => {
        console.error("获取房型销量失败:", err);
        this.$message.error("获取房型销量数据失败");
        this.tableData = [];
      }).finally(() => {
        this.loading = false;
      });
    },
    clearCharts() {
      if (this.pieChartInstance) {
        this.pieChartInstance.dispose();
        this.pieChartInstance = null;
      }
    },
    drawPieChart() {
      if (!this.$refs.pieChart) return;
      if (!this.pieChartInstance) {
        this.pieChartInstance = echarts.init(this.$refs.pieChart);
      }
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(30, 30, 30, 0.8)',
          borderColor: '#555',
          textStyle: { color: '#fff' }
        },
        // 【核心修正】将图例移动到下方
        legend: {
          orient: 'horizontal',
          bottom: 10,
          textStyle: { color: '#ffffff' },
        },
        series: [{
          name: '销量占比',
          type: 'pie',
          // 【核心修正】调整半径和中心点，为底部图例留出空间
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: 'rgba(40, 43, 51, 0.85)',
            borderWidth: 2
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold',
              color: '#fff'
            }
          },
          labelLine: { show: false },
          data: this.validData.map((item, idx) => ({
            value: item.saleCount,
            name: item.roomType,
            itemStyle: { color: this.colors[idx % this.colors.length] }
          }))
        }]
      };
      
      this.pieChartInstance.setOption(option, true);
    },
    resizeCharts() {
      if (this.pieChartInstance) this.pieChartInstance.resize();
    }
  },
  mounted() {
    this.rtypeListGet();
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts);
    this.clearCharts();
  }
};
</script>

<style scoped>
.rtype-sale-container {
  padding: 24px;
}
.transparent-card {
  background-color: rgba(40, 43, 51, 0.85);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}
.no-border-card {
  border: none !important;
}
.report-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
  text-align: center;
}
.no-data-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #aaa;
  font-size: 16px;
  background: rgba(30, 30, 30, 0.2);
  border-radius: 4px;
  font-style: italic;
}
.chart-title {
  font-size: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}
.rank-badge {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  text-align: center;
  color: #fff;
  font-weight: bold;
  background-color: #606266;
}
.rank-1 {
  background: linear-gradient(135deg, #fceabb, #f8b500);
  color: #8c5307;
  box-shadow: 0 0 5px #f8b500;
}
.rank-2 {
  background: linear-gradient(135deg, #e6e9f0, #eef1f5);
  color: #6c7a89;
  box-shadow: 0 0 5px #e6e9f0;
}
.rank-3 {
  background: linear-gradient(135deg, #f0c7a1, #d6893e);
  color: #6d3f11;
  box-shadow: 0 0 5px #d6893e;
}
.transparent-card >>> .el-table,
.transparent-card >>> .el-table__expanded-cell {
  background-color: transparent;
}
.transparent-card >>> .el-table th,
.transparent-card >>> .el-table tr {
  background-color: transparent;
  color: #eee;
  /* 【样式修改】增加行高 */
  height: 50px;
}
.transparent-card >>> .el-table td, 
.transparent-card >>> .el-table th.is-leaf {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
}
.transparent-card >>> .el-table th {
  color: #fff;
}
.transparent-card >>> .el-table::before {
  height: 0px;
}
.transparent-card >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>