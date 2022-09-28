import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homeView/HomeView.vue'
import AuctionView from '../views/AuctionView.vue'
import AuctionDetailView from '../views/AuctionDetailView.vue'
import BlogView from '../views/BLogView.vue'
import BlogDetailView from '../views/BlogDetailView.vue'
import ContactView from '../views/ContactView.vue'
import ShoppingCartView from '../views/ShoppingCartView.vue'
import FaqView from '../views/FaqView.vue'
import LoginView from '../views/authentication/LoginView.vue'
import RegisterView from '../views/authentication/RegisterView.vue'
import ChangePassword from '../views/authentication/ChangePassword.vue'
import ResetPasswordView from '../views/authentication/ResetPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
     
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
     
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
     
    },
    {
      path: '/forgotpassword',
      name: 'forgotpasswd',
      component: ChangePassword,
     
    },
    {
      path: '/resetpassword',
      name: 'resetpasswd',
      component: ResetPasswordView,
     
    },
    {
      path: '/auction',
      name: 'auction',
      component: AuctionView
    },
    {
      path: '/auctionDetail',
      name: 'auctiondetail',
      component: AuctionDetailView
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView
    },
    {
      path: '/blogdetail',
      name: 'blogdetail',
      component: BlogDetailView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/cart',
      name: 'cart',
      component: ShoppingCartView
    },
    
    {
      path: '/faq',
      name: 'faq',
      component: FaqView
    },

  ]
})


router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
