import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
// import './assets/font/iconfont.css'

import App from './App'
import store from './store'
import router from './router'
import request from '@/utils/request'

// import './assets/font2/iconfont.css'
import '@/icons' // icon
import '@/permission' // permission control
import '@/assets/custom.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
zhLocale.el.pagination = {
  goto: '跳至',
  pagesize: '条/页',
  total: `共计 {total} 条`,
  pageClassifier: '页',
};
Vue.use(ElementUI, {
  locale: zhLocale,
});

axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);

Vue.use(ElementUI, { locale })

Vue.prototype.req = request

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
