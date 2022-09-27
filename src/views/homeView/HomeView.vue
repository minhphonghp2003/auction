<script setup>
import { ref } from "@vue/reactivity";
import axios from "axios";
import ProductView from "../ProductView.vue";
import HeroView from "./HeroView.vue";
import { ContentLoader } from "vue-content-loader";
import MostWatchedView from "./MostWatchedView.vue";

import { Buffer } from "buffer";

let product = ref([]);
let subproduct = ref([]);
let section = ref("new");
let mostWatched = ref({})

function compareNumbers(a, b) {
  return a.b_count - b.b_count;
}

axios
  .get("https://ecommerce-r6l7.onrender.com/product/all")
  .then((data) => (product.value = data.data))
  .then((data) => {
    product.value.forEach((element) => {
      element.image = Buffer.from(element.image).toString("base64");
    });
  })
  .then(
    (data) => (subproduct.value = JSON.parse(JSON.stringify(product.value)))
  );

let renderMost = () => {
  product.value.sort(compareNumbers).reverse();
  product.value = product.value.splice(0, product.value.length / 2);

  section.value = "most";
  mostWatched.value = product.value[0]
};
let renderNew = () => {
  product.value = JSON.parse(JSON.stringify(subproduct.value));
  section.value = "new";
};
let done = () => {
  return product.value.length;
};

</script>

<template>
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
        viewBox="0 0 400 150"
        :speed="2"
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
      >
        <circle cx="10" cy="20" r="8" />
        <circle cx="10" cy="50" r="8" />
        <circle cx="10" cy="80" r="8" />
        <circle cx="10" cy="110" r="8" />
        <rect x="34" y="13" rx="0" ry="0" width="504" height="103" />
      </content-loader>
    </div>
  </div>

  <ProductView :key="product" :product="product"></ProductView>
  <MostWatchedView v-if="done()" v-bind="mostWatched"  ></MostWatchedView>
</template>
<style scoped>
</style>