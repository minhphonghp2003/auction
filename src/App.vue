<script setup>
import axios from "axios";
import { onBeforeMount, onMounted, onUpdated, ref } from "vue";
import { io } from 'socket.io-client'
import { getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";
import("../js/main.js");

const socket = io("https://ecommerce-r6l7.onrender.com");
let year = new Date().getFullYear();
let route = useRoute()
const router = useRouter();
const { cookies } = useCookies();
let token = ref(cookies.get("token"));
let fullname = ref("");
let userFetching = ref(false)
let cart = ref(0)
let redtext = ref('')



let login = async () => {
  if (token.value) {
    userFetching.value = true
    try {
      fullname.value = (
        await axios.get("https://ecommerce-r6l7.onrender.com/user/mydata", {
          headers: {
            token: token.value,
          },
        })
      ).data.user.fullname;
      userFetching.value = false

    } catch (error) {
      userFetching.value = false
    }
  }
  else {
    router.push({ name: 'login' })
  }
};

onMounted(async () => {
  
  if (token.value) {
    userFetching.value = true
    try {
      fullname.value = (
        await axios.get("https://ecommerce-r6l7.onrender.com/user/mydata", {
          headers: {
            token: token.value,
          },
        })
      ).data.user.fullname;
      let order = (await axios.get('https://ecommerce-r6l7.onrender.com/order/myorder', {
        headers: {
          token: token.value,
        },
      })).data
      let myBid = (await axios.get('https://ecommerce-r6l7.onrender.com/product/mybid', {
        headers: {
          token: token.value,
        },
      })).data

      cart.value = order.length + myBid.length
      userFetching.value = false


    } catch (error) {
      userFetching.value = false
    }
  }
})

let newcart = () => {
  cart.value++
  redtext.value = 'redtext'
}

</script>

<template>
  <!-- Offcanvas Menu Begin -->
  <div class="offcanvas-menu-overlay"></div>
  <div class="offcanvas-menu-wrapper">
    <div class="offcanvas__option">
      <div class="offcanvas__links">
        <a href="#">Sign in</a>
      </div>
      
    </div>
    <div class="offcanvas__nav__option">
      <a href="#" class="search-switch"><img src="/src/assets/img/icon/search.png" alt="" /></a>
      <a href="#"><img src="/src/assets/img/icon/heart.png" alt="" /></a>
      <a href="#"><img src="/src/assets/img/icon/cart.png" alt="" /> <span>0</span></a>
      <div class="price">$0.00</div>
    </div>
    <div id="mobile-menu-wrap"></div>
    <div class="offcanvas__text">
      <p>Free shipping, 30-day return or refund guarantee.</p>
    </div>
  </div>
  <!-- Offcanvas Menu End -->

  <!-- Header Section Begin -->
  <header class="header">
    <div class="header__top">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 col-md-7">
            <div class="header__top__left">
              <p>Welcome to bidthu, an online auction website.</p>
            </div>
          </div>
          <div class="col-lg-6 col-md-5">
            <div class="header__top__right">
              <div :key="route.fullPath" class="header__top__links">
                <a style="cursor:pointer; color:cyan" :key="route.fullPath" v-if="!fullname && !userFetching"
                  @click="login">Sign in</a>
                <router-link style="color:cyan" :key="fullname" v-if="fullname && !userFetching"
                  :to="{ name: 'profile' }">{{ fullname }}</router-link>
              </div>
              <!-- <div class="header__top__hover">
                <span>Usd </span>
                <ul>
                  <li>USD</li>
                  <li>VND</li>
                </ul>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-3">
          <div class="header__logo">
            <router-link :to="{ name: 'home' }"><img src="/src/assets/img/icon/Bidthu.png" alt="" /></router-link>
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <nav class="header__menu mobile-menu">
            <ul>
              <li>
                <router-link :to="{ name: 'home' }">Home</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'auction' }">Auction</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'contact' }">Contacts</router-link>
              </li>
            </ul>
          </nav>
        </div>
        <div class="col-lg-3 col-md-3">
          <div class="header__nav__option">
           
            <a v-if="token" href="#"><img src="/src/assets/img/icon/heart.png" alt="" /></a>

            <router-link v-if="token"  :to="{ name: 'cart' }"><img src="/src/assets/img/icon/cart.png" alt="" />
              <span @click="redtext = ''" :class="[redtext]">{{cart}}</span>
            </router-link>
          </div>
        </div>
      </div>
      <div class="canvas__open"><i class="fa fa-bars"></i></div>
    </div>
  </header>
  <!-- Header Section End -->
  <router-view @newcart="newcart" :key="$route.fullPath"></router-view>
  <!-- Search Begin -->
  <div ref="searchbox" class="search-model">
    <div class="h-100 d-flex align-items-center justify-content-center">
      <div @click="closesearch" class="search-close-switch">+</div>
      <form class="search-model-form">
        <input type="text" id="search-input" placeholder="Search here....." />
      </form>
    </div>
  </div>
  <!-- Search End -->
  <!-- Footer Section Begin -->
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-6">
          <div class="footer__about">
            <div class="footer__logo">
              <a href="#"><img src="/src/assets/img/icon/Bidthu.png" alt="" /></a>
            </div>
            <p>
            Enjoy selling and bidding
            </p>

          </div>
        </div>
        <div class="col-lg-2 offset-lg-1 col-md-3 col-sm-6">
          <div class="footer__widget">
            <h6>Selling</h6>
            <ul>
              <li><a href="#">placeholder</a></li>
              <li><a href="#">placeholder</a></li>
              <li><a href="#">placeholder</a></li>
              <li><a href="#">placeholder</a></li>
            </ul>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6">
          <div class="footer__widget">
            <h6>Buying</h6>
            <ul>
              <li><a href="#">placeholder</a></li>
              <li><a href="#">placeholder</a></li>
              <li><a href="#">placeholder</a></li>
              <li><a href="#">placeholder</a></li>
            </ul>
          </div>
        </div>
        <div class="col-lg-3 offset-lg-1 col-md-6 col-sm-6">
          <div class="footer__widget">
            <h6>NewLetter</h6>
            <div class="footer__newslatter">
              <p>
                Be the first to know about new arrivals, look books, sales &
                promos!
              </p>
              <form action="#">
                <input type="text" placeholder="Your email" />
                <button type="submit">
                  <span class="icon_mail_alt"></span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 text-center">
          <div class="footer__copyright__text">
            <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
            <p>
              Copyright ??
              {{ year }}
              All rights reserved | This template is made with
              <i class="fa fa-heart-o" aria-hidden="true"></i> by
              <a href="https://www.facebook.com/profile.php?id=100068404994823" target="_blank">Nguyen Minh</a>
            </p>
            <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
          </div>
        </div>
      </div>
    </div>
  </footer>
  <!-- Footer Section End -->
</template>

<style scoped>
.redtext {
  color:red
}
</style>
