import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import('@/components/pages/index/index')
const ShoppingMall = () => import('@/components/pages/index/shoppingMall')
const Category = () => import('@/components/pages/category/category')
const ShoppingCart = () => import('@/components/pages/shoppingCart/shoppingCart')
const Member = () => import('@/components/pages/member/member')
const Register = () => import('@/components/pages/member/register')
const Login = () => import('@/components/pages/member/login')
const Order = () => import('@/components/pages/member/order')
const GoodsList = () => import('@/components/pages/goods/goodsList')
const GoodsDetail = () => import('@/components/pages/goods/goodsDetail')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'Index',
      component: Index,
      children: [
        {
          path: '',
          redirect: {
            name: 'shoppingMall'
          }
        },
        {
          path: 'shoppingMall',
          name: 'shoppingMall',
          component: ShoppingMall,
          meta: {
            keepAlive: true,
            keepAliveApp: true
          }
        },
        {
          path: 'category',
          name: 'category',
          component: Category,
          meta: {
            keepAlive: true,
            keepAliveApp: true
          }
        },
        {
          path: 'shoppingCart',
          name: 'shoppingCart',
          component: ShoppingCart,
          meta: {
            keepAlive: true,
            keepAliveApp: true
          }
        },
        {
          path: 'member',
          name: 'member',
          component: Member,
          meta: {
            keepAlive: false,
            keepAliveApp: true
          }
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/goodsList',
      name: 'goodsList',
      component: GoodsList,
      meta: {
        keepAlive: true,
        keepAliveApp: true,
        isGoodsDetail: false
      }
    },
    {
      path: '/goodsDetail/:goodsId',
      name: 'goodsDetail',
      component: GoodsDetail,
      meta: {
        keepAliveApp: true,
        keepAlive: true
      }
    },
    // {
    //   path: '/shoppingCart',
    //   name: 'shoppingcart',
    //   component: ShoppingCart,
    //   meta: {
    //     keepAlive: true,
    //     keepAliveApp: true
    //   }
    // },
    {
      path: '/order',
      name: 'order',
      component: Order
    }
  ]
})
