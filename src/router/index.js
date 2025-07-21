import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  //测试页面
  {
    path: '/home',
    component: Layout,
    children: [{
      path: '/home',
      name: '/',
      component: () => import('@/views/index'),
      meta: {
        title: '主页',
        icon: 'iconfont icon-r-home'
      }
    }]
  },
  // 用户管理
  {
    path: '/user',
    component: Layout,
    // redirect: '/user/upload',
    meta: {
      title: '用户管理',
      icon: 'iconfont icon-yonghuguanli_huaban'
    },
    children: [{
        path: 'query-user',
        name: 'query-user',
        component: () => import('@/views/user/queryuser'),
        meta: {
          title: '用户列表',
          icon: 'iconfont icon-user-list',
        }
      },
      {
          path: 'change-user',
          name: 'change-user',
          component: () => import('@/views/user/changeuser'),
          meta: {
            title: '修改用户',
            icon: 'iconfont icon-xiugai',
          }
        },
    ]
  },

  // 订单管理
  {
    path: '/order',
    component: Layout,
    // redirect: '/user/upload',
    meta: {
      title: '订单管理',
      icon: 'iconfont icon-xiangqingchaxun'
    },
    children: [{
        path: 'order-list',
        name: 'order-list',
        component: () => import('@/views/order/orderlist'),
        meta: {
          title: '等待列表',
          icon: 'iconfont icon-loading-v',
        }
      },
      {
        path: 'order-reject',
        name: 'order-reject',
        component: () => import('@/views/order/historyOrder'),
        meta: {
          title: '订单列表',
          icon: 'iconfont icon-dingdanliebiao',
        }
      },
    ]
  },
  // 房间管理
  {
    path: '/room',
    component: Layout,
    // redirect: '/user/upload',
    meta: {
      title: '房间管理',
      icon: 'iconfont icon-24gf-building2'
    },
    children: [{
        path: 'room-list',
        name: 'room-list',
        component: () => import('@/views/room/roomlist'),
        meta: {
          title: '房间列表',
          icon: 'iconfont icon-fangjianliebiao',
        }
      },
      {
        path: 'room-search',
        name: 'room-search',
        component: () => import('@/views/room/roomsearch'),
        meta: {
          title: '详情查询',
          icon: 'iconfont icon-ziliaoku',
        },
      },
      {
        path: 'room-add',
        name: 'room-add',
        component: () => import('@/views/room/roomadd'),
        meta: {
          title: '添加房间',
          icon: 'iconfont icon-tianjiafangjian',
        }
      },
    ]
  },
  {
    path: '/report',
    component: Layout,
    meta: {
        title: '报表统计',
        icon: 'iconfont icon-r-list'
      },
    children: [{
      path: '/reportlist',
      name: '/reportlist',
      component: () => import('@/views/report/reportlist'),
      meta: {
        title: '收入月报',
        icon: 'iconfont icon-wenzhang'
      }
    },{
      path: '/rtypeSale',
      name: '/rtypeSale',
      component: () => import('@/views/report/rtypeSale'),
      meta: {
        title: '房型销量',
        icon: 'iconfont icon-r-setting'
      }
    }],
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()


export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
