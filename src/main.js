import Vue from 'vue'

import App from './App.vue'

import router from './router'

import store from './store' // 状态管理

import 'normalize.css' // 重置不同浏览器之间的标签默认样式

import Element from 'element-ui' // 引入element-ui

import config from './config' // 引入全局配置

import '@/styles/index.less' // 引入全局样式

import '@/assets/icons' // icon

import './permission' // permission control

import wsCache from './cache' // 本地存储

import api from '@/api' // 引入api

import VueLazyload from 'vue-lazyload' // 图片懒加载

import Viewer from 'v-viewer'

import 'viewerjs/dist/viewer.css'

Vue.use(Viewer)

Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

Vue.use(VueLazyload)

import importDirective from '@/directive'
importDirective(Vue)

Vue.use(Element, { size: config.el_size })

Vue.config.productionTip = false

Vue.prototype.$config = config
Vue.prototype.$wsCache = wsCache
Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
