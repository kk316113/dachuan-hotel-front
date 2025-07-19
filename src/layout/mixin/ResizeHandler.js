import store from '@/store'

// 定义两个临界点
const TABLET_WIDTH = 992 // 小于这个宽度，进入“平板模式”（侧边栏缩略）
const MOBILE_WIDTH = 768 // 小于这个宽度，进入“移动模式”（侧边栏隐藏）

export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    this.$_resizeHandler()
  },
  methods: {
    $_resizeHandler() {
      if (!document.hidden) {
        const currentWidth = document.body.getBoundingClientRect().width
        // 1. 判断是否为移动模式
        if (currentWidth < MOBILE_WIDTH) {
          store.dispatch('app/toggleDevice', 'mobile')
          // 在移动模式下，强制关闭侧边栏（进入抽屉模式）
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        } 
        // 2. 判断是否为平板模式
        else if (currentWidth < TABLET_WIDTH) {
          store.dispatch('app/toggleDevice', 'desktop') // 设备模式依然是'desktop'
          // 但在平板模式下，强制关闭侧边栏（让它变成缩略版）
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        } 
        // 3. 否则就是桌面模式
        else {
          store.dispatch('app/toggleDevice', 'desktop')
          // 在桌面模式下，强制展开侧边栏
          store.dispatch('app/openSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}