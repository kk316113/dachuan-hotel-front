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

    <!-- 快捷操作入口 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="actions-card">
           <div class="card-header">
             <span>快捷操作</span>
           </div>
           <div class="card-body">
             <div class="actions-grid">
              <div class="action-item" v-for="action in quickActions" :key="action.title" @click="handleActionClick(action.path)">
                <i :class="action.icon"></i>
                <span>{{ action.title }}</span>
              </div>
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
      // 快捷操作按钮 (path需要与您的路由配置匹配)
      quickActions: [
        { title: '查询用户', icon: 'el-icon-user-solid', path: '/user/query-user' },
        { title: '添加房间', icon: 'el-icon-circle-plus', path: '/room/add-room' },
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
    
    // 【核心修正】获取仪表盘统计数据
    async getDashboardStats() {
      this.loadingStats = true;
      try {
        // 使用 Promise.all 并发请求所有四个API，提高加载速度
        const [
          checkinsData, 
          roomsData, 
          pendingOrdersData, 
          monthlyIncomeData
        ] = await Promise.all([
          this.req({ url: '/dashboard/checkins/today', method: 'get' }),
          this.req({ url: '/dashboard/rooms/available', method: 'get' }),
          this.req({ url: '/orders/pending/count', method: 'get' }),
          this.req({ url: '/report/income/currentMonth', method: 'get' })
        ]);

        // 从API响应中提取真实数据
        const checkInsToday = checkinsData ? checkinsData.todayCheckins : 0;
        const availableRooms = roomsData ? roomsData.availableRooms : 0;
        const pendingOrders = pendingOrdersData ? pendingOrdersData.pendingCount : 0;
        const monthlyIncome = monthlyIncomeData ? monthlyIncomeData.totalIncome : 0;

        // 更新卡片数据
        this.statsCards = [
          { title: '今日入住', value: checkInsToday, icon: 'el-icon-s-home', color: '#409EFF' },
          { title: '空闲房间', value: availableRooms, icon: 'el-icon-house', color: '#67C23A' },
          { title: '待处理订单', value: pendingOrders, icon: 'el-icon-s-order', color: '#E6A23C' },
          { title: '本月总收入 (元)', value: monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: 'el-icon-money', color: '#F56C6C' }
        ];

      } catch (err) {
        // 您的 request.js 拦截器会自动弹出错误提示
        console.error("获取主页数据失败:", err);
      } finally {
        this.loadingStats = false;
      }
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

.actions-card {
  background-color: rgba(40, 43, 51, 0.85);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  overflow: hidden; /* 确保子元素的边框不会溢出 */
}

.actions-card .card-header {
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 18px;
  font-weight: bold;
}

.actions-card .card-body {
  padding: 20px;
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
