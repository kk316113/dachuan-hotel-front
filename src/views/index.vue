<template>
  <div class="dashboard-container">
    <!-- 顶部问候语 -->
    <el-row :gutter="20" class="welcome-header">
      <el-col :span="24">
        <h1>{{ welcomeMessage }}</h1>
        <p>欢迎使用大川酒店后台管理系统</p>
      </el-col>
    </el-row>

    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="stats-cards" v-loading="loadingStats">
      <el-col :span="6" v-for="card in statsCards" :key="card.title">
        <div class="stat-card">
          <div class="card-content">
            <i :class="[card.icon, 'card-icon']" :style="{ color: card.color }"></i>
            <div class="card-text">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value">{{ card.value }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="actions-card">
           <div class="card-header">快捷操作</div>
           <div class="actions-grid">
            <div class="action-item" v-for="action in quickActions" :key="action.title" @click="handleActionClick(action.path)">
              <i :class="action.icon"></i>
              <span>{{ action.title }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      loadingStats: false,
      welcomeMessage: '',
      // 初始化数据卡片，等待API填充
      statsCards: [
        { title: '今日入住', value: '-', icon: 'el-icon-s-home', color: '#409EFF' },
        { title: '空闲房间', value: '-', icon: 'el-icon-house', color: '#67C23A' },
        { title: '待处理订单', value: '-', icon: 'el-icon-s-order', color: '#E6A23C' },
        { title: '本月总收入 (元)', value: '-', icon: 'el-icon-money', color: '#F56C6C' }
      ],
      quickActions: [
        { title: '查询用户', icon: 'el-icon-user-solid', path: '/user/query-user' },
        { title: '添加房间', icon: 'el-icon-circle-plus', path: '/room/room-add' },
        { title: '查询房间', icon: 'el-icon-search', path: '/room/room-search' },
        { title: '月度报表', icon: 'el-icon-s-data', path: '/report/report-list' },
        { title: '房型销量', icon: 'el-icon-pie-chart', path: '/report/rtype-sale' }
      ]
    };
  },
  methods: {
    // 设置动态问候语
    setWelcomeMessage() {
      const hour = new Date().getHours();
      if (hour < 6) this.welcomeMessage = "凌晨好！";
      else if (hour < 12) this.welcomeMessage = "早上好！";
      else if (hour < 14) this.welcomeMessage = "中午好！";
      else if (hour < 18) this.welcomeMessage = "下午好！";
      else this.welcomeMessage = "晚上好！";
    },
    getDashboardStats() {
      this.loadingStats = true;
      // 这里模拟一个API请求，您可以替换为您真实的 this.req 调用
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            checkInsToday: 25,
            availableRooms: 102,
            pendingOrders: 8,
            monthlyIncome: 128500
          });
        }, 1000); // 模拟1秒延迟
      }).then(data => {
        this.statsCards = [
          { title: '今日入住', value: data.checkInsToday, icon: 'el-icon-s-home', color: '#409EFF' },
          { title: '空闲房间', value: data.availableRooms, icon: 'el-icon-house', color: '#67C23A' },
          { title: '待处理订单', value: data.pendingOrders, icon: 'el-icon-s-order', color: '#E6A23C' },
          { title: '本月总收入 (元)', value: data.monthlyIncome.toLocaleString(), icon: 'el-icon-money', color: '#F56C6C' }
        ];
        this.loadingStats = false;
      }).catch(() => {
        this.loadingStats = false;
        this.$message.error("获取主页数据失败");
      });
    },

    // 处理快捷操作点击事件
    handleActionClick(path) {
      if (path) {
        this.$router.push(path);
      } else {
        this.$message.info('该功能暂未开放');
      }
    }
  },
  created() {
    this.setWelcomeMessage();
    this.getDashboardStats(); // 页面创建时加载数据
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
  /* background: linear-gradient(135deg, #2c3e50, #34495e); */
  min-height: calc(100vh - 50px);
}

.welcome-header {
  color: white;
  margin-bottom: 20px;
}

.welcome-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
}

.welcome-header p {
  margin: 0;
  font-size: 16px;
  color: #bdc3c7;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  background-color: rgba(40, 43, 51, 0.85);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.card-icon {
  font-size: 40px;
  margin-right: 20px;
}

.card-text {
  flex: 1;
}

.card-title {
  color: #bdc3c7;
  font-size: 14px;
  margin-bottom: 8px;
}

.card-value {
  font-size: 26px;
  font-weight: bold;
}

.actions-card, .card-header {
  background-color: rgba(40, 43, 51, 0.85);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.05);
}

.action-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-5px);
  color: #409EFF;
}

.action-item i {
  font-size: 32px;
  margin-bottom: 15px;
}

.action-item span {
  font-size: 14px;
}
</style>
