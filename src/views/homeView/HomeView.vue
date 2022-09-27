<script setup>
import { ref } from "@vue/reactivity";
import axios from "axios";
import ProductView from "../ProductView.vue";
import HeroView from "./HeroView.vue";
import { ContentLoader } from "vue-content-loader";
import MostWatchedView from "./MostWatchedView.vue";

import { Buffer } from "buffer";
import { onMounted } from "@vue/runtime-core";

let product = ref([]);
let subproduct = ref([]);
let section = ref("new");
let mostWatched = ref({});

function compareNumbers(a, b) {
  return a.b_count - b.b_count;
}

onMounted(async () => {
  product.value = (
    await axios.get("https://ecommerce-r6l7.onrender.com/product/all")
  ).data;
  product.value.forEach((element) => {
    element.image = Buffer.from(element.image).toString("base64");
    element.date_end = element.date_end.split("T")[0]
  });
  subproduct.value = JSON.parse(JSON.stringify(product.value));
  renderMost();
  renderNew();
  countDown(mostWatched.value.date_end)
  product.value = product.value.splice(0,9)
});

let renderMost = () => {
  product.value = JSON.parse(JSON.stringify(subproduct.value));
  product.value.sort(compareNumbers).reverse();
  product.value = product.value.splice(0, product.value.length / 2);
  section.value = "most";
  mostWatched.value = product.value[0];
  let dateEnd = mostWatched.value.date_end.split("-");
  mostWatched.value.date_end = new Date(dateEnd[0], dateEnd[1] - 1, dateEnd[2]);
  product.value.shift()
};

let renderNew = () => {
  product.value = JSON.parse(JSON.stringify(subproduct.value));
  product.value = product.value.splice(0,9)
  section.value = "new";
};
let done = () => {
  return product.value.length;
};

let countDown = (countDownDate) => {

setInterval(()=>{
  var now = new Date().getTime();
  var distance = countDownDate - now;
  
  mostWatched.value.days = Math.floor(distance / (1000 * 60 * 60 * 24));
  mostWatched.value.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + 9);
  mostWatched.value.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  mostWatched.value.seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (distance < 0) {
    clearInterval(x);
  return
  }

}, 1000);
  
};
</script>

<template>

<HeroView></HeroView>

  <div class="row">
    <div class="col-lg-12">
      <ul v-if="done()" class="filter__controls">
        <li :class="{ active: section == 'new' }" @click="renderNew">
          New Arrivals
        </li>
        <li :class="{ active: section == 'most' }" @click="renderMost">
          Most Watched
        </li>
      </ul>
      <content-loader
        v-if="!done()"
        viewBox="0 0 476 124"
    :speed="2"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="28" y="16" rx="0" ry="0" width="96" height="86" /> 
    <rect x="168" y="15" rx="0" ry="0" width="96" height="86" /> 
    <rect x="309" y="17" rx="0" ry="0" width="96" height="86" /> 
    <!-- <rect x="27" y="107" rx="0" ry="0" width="376" height="17" />  -->
    <rect x="26" y="108" rx="0" ry="0" width="387" height="10" /> 
    <!-- <rect x="28" y="119" rx="0" ry="0" width="384" height="8" /> -->
      </content-loader>
    </div>
  </div>
  <!-- <HeroView></HeroView> -->
  <ProductView :key="product" :product="product"></ProductView>
  <MostWatchedView  v-if="done()" v-bind="mostWatched"></MostWatchedView>
</template>
<style scoped>
</style>