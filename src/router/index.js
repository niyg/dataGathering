/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-09 11:05:01
 * @LastEditTime: 2019-11-07 10:32:21
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '_v/layout'

Vue.use(Router)

/**
* hidden: true                当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)
* alwaysShow: true            当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式-                                              -如组件页面
                              只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
                              若你想不管路由下面的 children 声明的个数都显示你的根路由
                              你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根                                                路由(默认 false)
* redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
* name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
* meta : {
    title: 'title'            设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'          设置该路由的图标
    noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    affix: true               如果设置为true，则会一直固定在tag项中(默认 false)
  }
**/
export const constantRouterMap = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () => import('_v/redirect')
  }]
},
{
  path: '/login',
  component: () => import('_v/login'),
  hidden: true
},
{
  path: '/404',
  component: () => import('_v/err-page/404'),
  hidden: true
}
]

const createRouter = () => new Router({
  routes: constantRouterMap
})

const router = createRouter()

// 重新实例化一个新的路由，替换之前的路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export const asyncRouterMap = [
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('_v/dashboard'),
  //       name: 'Dashboard',
  //       meta: {
  //         title: '首页',
  //         icon: 'dashboard',
  //         noCache: true,
  //         affix: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/role',
    component: Layout,
    redirect: 'noredirect',
    name: 'Auth',
    alwaysShow: true,
    meta: {
      title: '权限管理',
      icon: 'role'
    },
    children: [{
      path: 'role',
      component: () => import('_v/auth/role'),
      name: 'Role',
      meta: {
        title: '角色管理',
        module: 'role',
        request: {
          list: 'roleList',
          add: 'roleAdd',
          edit: 'roleEdit',
          det: 'roleDet',
          del: 'roleDel'
        },
        roles: ['add', 'edit', 'dels', 'det']
      }
    },
    {
      path: 'accounts',
      component: () => import('_v/auth/accounts'),
      name: 'Accounts',
      meta: {
        title: '账号管理',
        module: 'accounts',
        request: {
          list: 'accountsList',
          add: 'accountsAdd',
          edit: 'accountsEdit',
          det: 'accountsDet',
          del: 'accountsDel'
        },
        roles: ['add', 'edit', 'dels', 'det', 'reset']
      }
    }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default router
