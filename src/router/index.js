import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/welcome/Welcome')
const Users = () => import('views/home/user/Users')
const Rights = () => import('views/home/power/rights/Rights')
const Roles = () => import('views/home/power/role/Roles')
const Categories = () => import('views/home/goods/category/Categories')
const Params = () => import('views/home/goods/cateParams/Params')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航守卫
// to 表示将要访问的路径
// from 表示从哪个路径跳转而来
// next 是一个函数，表示放行
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从sessionStorage中获取保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token没有值, 强制跳转到登录页
  if (tokenStr) {
    // 用户通过地址栏访问时，也要添加activePath，否则首页的左侧菜单栏不会下拉等
    window.sessionStorage.setItem('activePath', to.path)
    next()
  } else {
    next('/login')
  }
})

export default router