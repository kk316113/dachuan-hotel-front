<template>
  <div class="rtype-sale-container">
    <el-card class="transparent-card no-border-card">
      <div slot="header" class="report-title">
        <span>近十二个月房型销量排名</span>
      </div>

      <el-row :gutter="30">
        <el-col :span="12">
          <div ref="pieChart" style="width: 100%; height: 400px;">
            <div v-if="!validData.length" class="no-data-pie">
              暂无销售数据
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div ref="roseChart" style="width: 100%; height: 400px;">
            <div v-if="!validData.length" class="no-data-pie">
              暂无销售数据
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 推荐使用这种方式引入

export default {
  name: 'RtypeSale',
  data() {
    return {
      tableData: [],
      pieChartInstance: null,
      roseChartInstance: null,
      colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#1abc9c'],
      loading: false
    };
  },
  computed: {
    // 过滤出销售数量大于0的有效数据
    validData() {
      return this.tableData.filter(item => item.saleCount > 0);
    }
  },
  watch: {
    // 监听有效数据变化，当数据更新时自动重新绘制图表
    validData: {
      deep: true, // 深度监听数组内部对象的变化
      handler(newVal) {
        if (newVal.length > 0) {
          this.$nextTick(() => {
            this.drawPieChart();
            this.drawRoseChart();
          });
        } else {
          this.clearCharts(); // 数据为空时清空图表
        }
      }
    }
  },
  methods: {
    rtypeListGet() {
      this.loading = true;
      this.req({
        url: "/report/rTypeSale",
        method: "get"
      })
        .then((res) => {
          const { roomTypeList, saleList } = res.data.data;
          const roomTypeMap = {
            1: '单人房',
            2: '双人床',
            3: '三人床',
            4: '大床房',
            5: '豪华套房'
          };
          
          // 将后端数据映射并排序
          const tableData = roomTypeList.map((type, idx) => ({
            roomType: roomTypeMap[type] || `类型${type}`,
            saleCount: saleList[idx] || 0
          })).sort((a, b) => b.saleCount - a.saleCount);
          
          this.tableData = tableData;
        })
        .catch((err) => {
          console.error("获取房型销量失败:", err);
          this.$message.error("获取房型销量数据失败");
          this.tableData = []; // 清空数据以显示“暂无数据”
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    // 销毁并清空图表实例
    clearCharts() {
        if (this.pieChartInstance) {
            this.pieChartInstance.dispose();
            this.pieChartInstance = null;
        }
        if (this.roseChartInstance) {
            this.roseChartInstance.dispose();
            this.roseChartInstance = null;
        }
    },

    drawPieChart() {
      // 确保DOM元素已存在
      if (!this.$refs.pieChart) return;
      
      // 初始化图表实例
      if (!this.pieChartInstance) {
        this.pieChartInstance = echarts.init(this.$refs.pieChart);
      }
      
      const isSingleData = this.validData.length === 1;
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(30, 30, 30, 0.8)',
          borderColor: '#555',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            color: '#ffffff'
          },
          formatter: (name) => {
            const item = this.validData.find(d => d.roomType === name);
            return `${name}: ${item ? item.saleCount : 0}`;
          }
        },
        series: [
          {
            name: '销量占比',
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: !isSingleData,
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgba(40, 43, 51, 0.85)',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: isSingleData ? '{b}: {c}' : '{b}\n{d}%',
              color: '#eee',
              fontWeight: 'bold',
              fontSize: 14
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 15
            },
            emphasis: {
              scale: true,
              scaleSize: 10,
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            data: this.validData.map((item, idx) => ({
              value: item.saleCount,
              name: item.roomType,
              itemStyle: {
                color: this.colors[idx % this.colors.length]
              }
            }))
          }
        ]
      };
      
      this.pieChartInstance.setOption(option, true);
    },

    drawRoseChart() {
      // 确保DOM元素已存在
      if (!this.$refs.roseChart) return;
      
      // 初始化图表实例
      if (!this.roseChartInstance) {
        this.roseChartInstance = echarts.init(this.$refs.roseChart);
      }
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(30, 30, 30, 0.8)',
          borderColor: '#555',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '销量',
            type: 'pie',
            radius: ['15%', '95%'],
            center: ['50%', '50%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 8
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 14
            },
            labelLine: {
              length: 10,
              length2: 0,
              smooth: true
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: (idx) => Math.random() * 200,
            data: this.validData.map((item, idx) => ({
              value: item.saleCount,
              name: item.roomType,
              itemStyle: {
                color: this.colors[idx % this.colors.length],
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }))
          }
        ]
      };
      
      this.roseChartInstance.setOption(option, true);
    },

    resizeCharts() {
      if (this.pieChartInstance) {
        this.pieChartInstance.resize();
      }
      if (this.roseChartInstance) {
        this.roseChartInstance.resize();
      }
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
/* 样式保持不变 */
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
.no-data-pie {
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
</style>