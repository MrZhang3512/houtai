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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    //在vue-admin中路由是由子路由决定的，如果子路由有一个以上，那么该路由为嵌套路由，如果只有一个，该路由为根路由
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
//自定义一个员工管理模块
  {
    path: '/waiters',
    component: Layout,
    redirect: '/waiters/waiter',
    name: 'Waiters',
    // meta: { title: '员工管理', icon: 'user' },
    children: [
      {
        path: 'waiter',
        name: 'Waiter',
        component: () => import('@/views/waiters/index'),
        meta: { title: '员工管理', icon: 'user' }
      },
      //详情页面
      {
        path: 'detail/:id',
        name: 'Detail',
        component: () => import('@/views/details/index'),
        hidden: true,
        meta: { titile:"详情"}
      }
    ]
  },
  //自定义一个顾客管理
  {
    path: '/customers',
    component: Layout,
    name: 'Customers',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/customers/index'),
        meta: { title: '顾客管理', icon: 'user' }
      }
    ]
  },
  //自定义一个产品管理模块
  {
    path: '/products',
    component: Layout,
    name: 'Products',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/products/index'),
        meta: { title: '产品管理', icon: 'example' }
      }
    ]
  },
  //自定义一个栏目管理
  {
    path: '/categorys',
    component: Layout,
    name: 'Categorys',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/categorys/index'),
        meta: { title: '栏目管理', icon: 'tree' }
      }
    ]
  },
  //自定义一个订单管理
  {
    path: '/orders',
    component: Layout,
    name: 'Orders',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/orders/index'),
        meta: { title: '订单管理', icon: 'form' }
      }
    ]
  },


 
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
