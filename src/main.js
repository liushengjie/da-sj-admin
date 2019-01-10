// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import config from '@/config'
import commoncss from '@/assets/common.css'
import $ from 'jquery'
import draggable from 'jquery-ui/ui/widgets/draggable'
import droppable from 'jquery-ui/ui/widgets/droppable'
import 'iview/dist/styles/iview.css'
import env from '../config/env'
// if (env === 'development') require('@/mock')

Vue.use(iView)
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

Array.prototype.remove = function (val) {
  let index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
