import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

//导入waiters模块仓库
import waiters from './waiters/index'
//导入customers模块仓库
import customers from './customers/index'
//导入产品模块仓库
import products from './products/index'
//导入栏目管理仓库
import categorys from './categorys/index'
//导入订单模块仓库
import orders from './orders/index'
//导入地址仓库
import address from './address/index'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    waiters,
    customers,
    products,
    categorys,
    orders,
    address
  },
  getters
})

export default store
