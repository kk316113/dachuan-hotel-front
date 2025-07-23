<template>
  <div class="report-container">
    <el-card class="transparent-card" v-loading="loading">
      <div slot="header" class="report-title">
        <span>近12个月营业额报表</span>
      </div>
      <el-row :gutter="30">
        <el-col :span="14">
          <div ref="chart" style="width: 100%; height: 600px;"></div>
        </el-col>
        <el-col :span="10">
          <div class="table-title">月度数据详情</div>
          <el-table :data="tableData" style="width: 100%;" height="540px" empty-text="暂无数据">
            <el-table-column prop="month" label="月份" width="100"></el-table-column>
            <el-table-column prop="revenue" label="营业额 (元)" align="right">
              <template slot-scope="scope">
                {{ scope.row.revenue.toLocaleString() }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// 引入 ECharts 核心模块
import * as echarts from 'echarts';

export default {
  name: 'IncomeReport',
  data() {
    return {
      loading: false,
      tableData: [],      // 表格使用的数据
      chartInstance: null // ECharts 实例
    };
  },
  methods: {
    // 调用API获取报表数据
    listReport() {
      this.loading = true;
      this.req({
        url: "/report/incomeMonthly",
        method: "get",
      }).then((data) => {
        if (data && data.monthList && data.incomeList) {
          const { tableData, chartData } = this.processReportData(data.monthList, data.incomeList);
          this.tableData = tableData;
          // 使用 $nextTick 确保 DOM 更新后再初始化图表
          this.$nextTick(() => {
            this.initChart(chartData);
          });
        }
      }).catch((err) => {
        console.error("获取月度报表失败:", err);
        this.$message.error("获取报表数据失败");
      }).finally(() => {
        this.loading = false;
      });
    },

    // 数据处理函数，同时生成表格和图表所需的数据
    processReportData(months, incomes) {
      if (months.length !== incomes.length) return { tableData: [], chartData: { months: [], incomes: [] } };

      const combinedData = months.map((month, index) => ({
        date: new Date(this.formatMonth(month)),
        monthStr: this.formatMonth(month),
        revenue: incomes[index]
      }));

      // 按日期升序排列，用于图表
      const sortedForChart = [...combinedData].sort((a, b) => a.date - b.date);
      const chartData = {
        months: sortedForChart.map(d => d.monthStr),
        incomes: sortedForChart.map(d => d.revenue)
      };

      // 按日期降序排列，用于表格（最新的在最上面）
      const sortedForTable = [...combinedData].sort((a, b) => b.date - a.date);
      const tableData = sortedForTable.map(d => ({ month: d.monthStr, revenue: d.revenue }));

      return { tableData, chartData };
    },

    // 格式化月份，智能判断年份
    formatMonth(month) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const year = month > currentMonth ? currentYear - 1 : currentYear;
      return `${year}-${String(month).padStart(2, '0')}`;
    },

    // 初始化 ECharts 图表
    initChart({ months, incomes }) {
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }
      this.chartInstance = echarts.init(this.$refs.chart);

      const option = {
        textStyle: {
          color: '#eee'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const p = params[0];
            return `${p.axisValue}<br/>营业额: ${p.data.toLocaleString()} 元`;
          },
          backgroundColor: 'rgba(50,50,50,0.7)',
          borderColor: '#333',
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: months,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          }
        },
        yAxis: {
          type: 'value',
          max: 3000,
          min: 0,
          interval: 300,
          axisLabel: {
            formatter: '{value} 元'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        series: [{
          name: '月度营业额',
          type: 'line',
          data: incomes,
          smooth: true,
          itemStyle: {
            color: '#409EFF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0)' }
            ])
          }
        }]
      };

      this.chartInstance.setOption(option);
    },

    // 响应式调整图表大小
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    }
  },
  created() {
    this.listReport();
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }
};
</script>

<style scoped>
.report-container {
  padding: 24px;
}
.transparent-card {
  background-color: rgba(40, 43, 51, 0.85);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.report-title,
.table-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}
.table-title {
  font-size: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.transparent-card>>>.el-table {
  background-color: transparent;
  color: #eee;
}
.transparent-card>>>.el-table th,
.transparent-card>>>.el-table tr {
  background-color: transparent;
}
.transparent-card>>>.el-table td,
.transparent-card>>>.el-table th.is-leaf {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}
.transparent-card>>>.el-table th {
  color: #fff;
}
.transparent-card>>>.el-table::before {
  height: 0px;
}
.transparent-card>>>.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: rgba(255, 255, 255, 0.05);
}
.transparent-card>>>.el-card__header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.transparent-card>>>.el-loading-mask {
  background-color: rgba(40, 43, 51, 0.5);
}
</style>
