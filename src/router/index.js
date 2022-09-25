import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homeView/HomeView.vue'
import AuctionView from '../views/AuctionView.vue'
import AuctionDetailView from '../views/AuctionDetailView.vue'
import BlogView from '../views/BLogView.vue'
import BlogDetailView from '../views/BlogDetailView.vue'
import ContactView from '../views/ContactView.vue'
import ShoppingCartView from '../views/ShoppingCartView.vue'
import LoginView from '../views/LoginView.vue'
import FaqView from '../views/FaqView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/faq',
      name: 'faq',
      component: FaqView
    },

  ]
})

export default router
