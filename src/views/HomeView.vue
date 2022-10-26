<script setup>
import { ref } from "@vue/reactivity";
import axios from "axios";
import ProductView from "../components/ProductView.vue";
import HeroView from "../components/home/HeroView.vue";
import { ContentLoader } from "vue-content-loader";
import MostWatchedView from "../components/home/MostWatchedView.vue";

import { Buffer } from "buffer";
import { onMounted } from "@vue/runtime-core";

let product = ref([]);
let subproduct = ref([]);
let section = ref("new");
let mostWatched = ref({});

function compareNumbers(a, b) {
  return b.b_count - a.b_count;
}

onMounted(async () => {

  product.value = (
    await axios.get("https://ecommerce-r6l7.onrender.com/product/all")
  ).data;
  product.value.forEach((element, ind, arr) => {
  
    if (!element.b_count) {
      element.b_count = 0
    }

    element.image = Buffer.from(element.image).toString("base64");
    element.date_end = element.date_end.split("T")[0]

  });
  subproduct.value = JSON.parse(JSON.stringify(product.value.reverse()));
  renderMost();
  renderNew();
  if (mostWatched.value) {
    countDown(mostWatched.value.date_end)

  }
  product.value = product.value.slice(0, 9)
});

let renderMost = () => {
  let sortedProduct = JSON.parse(JSON.stringify(subproduct.value));
  sortedProduct.sort(compareNumbers);
  for (let key =0; key<sortedProduct.length;key++ ) {
    if(sortedProduct[key].status=='sold'){
      sortedProduct.splice(key,1)
      key--
    }
  } 
  section.value = "most";
  mostWatched.value = sortedProduct[0];
  product.value = sortedProduct.slice(0, 6)
  if (mostWatched.value) {

    let dateEnd = mostWatched.value.date_end.split("-");
    mostWatched.value.date_end = new Date(dateEnd[0], dateEnd[1] - 1, dateEnd[2]);
    product.value.shift()
  }
};

let renderNew = () => {
  product.value = JSON.parse(JSON.stringify(subproduct.value));
  product.value = product.value.slice(0, 8)
  section.value = "new";
};
let done = () => {
  return product.value.length;
};

let countDown = (countDownDate) => {

  setInterval(() => {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    mostWatched.value.days = Math.floor(distance / (1000 * 60 * 60 * 24)) +1
    mostWatched.value.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) )+9
    mostWatched.value.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    mostWatched.value.seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      clearInterval();
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
      <content-loader v-if="!done()" viewBox="0 0 476 124" :speed="2" primaryColor="#f3f3f3" secondaryColor="#ecebeb">
        <rect x="28" y="16" rx="0" ry="0" width="96" height="86" />
        <rect x="168" y="15" rx="0" ry="0" width="96" height="86" />
        <rect x="309" y="17" rx="0" ry="0" width="96" height="86" />
        <rect x="26" y="108" rx="0" ry="0" width="387" height="10" />
      </content-loader>
    </div>
  </div>
  <ProductView :product="product"></ProductView>
  <MostWatchedView v-if="done() && mostWatched" v-bind="mostWatched"></MostWatchedView>
</template>
<style scoped>

</style>