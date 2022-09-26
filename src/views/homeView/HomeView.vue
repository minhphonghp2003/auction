<script setup>
import { ref } from "@vue/reactivity";
import axios from "axios";
import ProductView from "../ProductView.vue";
import HeroView from "./HeroView.vue";
import { Buffer } from "buffer";


let product = ref([]);
let subproduct = ref([]);
let section = ref("new");
axios
  .get("https://ecommerce-r6l7.onrender.com/product/all?page=1")
  .then((data) => (product.value = data.data))
  .then(data =>{
    product.value.forEach(element => {
    element.image = Buffer.from(element.image).toString('base64');
    });
  })
  .then((data) => (subproduct.value = product.value));


let renderMost = () => {
  product.value = product.value.filter((ele) => ele.status == 'active');
  section.value = "most";
};
let renderNew = () => {
  product.value = subproduct.value;
  section.value = "new";
};
let done = () => {
  return product.value.length;
};
</script>

<template>
  <div v-if="!done()" id="preloder">
    <div class="loader"></div>
  </div>
  <!-- <HeroView ></HeroView> -->

  <div class="row">
    <div class="col-lg-12">
      <ul class="filter__controls">
        <li :class="{ active: section == 'new' }" @click="renderNew">
          New Arrivals
        </li>
        <li :class="{ active: section == 'most' }" @click="renderMost">
          Most Watched
        </li>
      </ul>
    </div>
  </div>
  <ProductView :product="product"></ProductView>
</template>
<style scoped>
</style>