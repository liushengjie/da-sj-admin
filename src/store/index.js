import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import res from './module/res'
import resource from './module/resource'
import service from './module/service'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
	app,
	res,
    resource,
    service
  }
})
