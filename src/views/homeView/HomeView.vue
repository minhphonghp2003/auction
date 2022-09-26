<script setup>
import { ref } from "@vue/reactivity";
import axios from "axios";
import ProductView from "../ProductView.vue";
import { onMounted } from "@vue/runtime-core";
let product = ref([]);
let subproduct = ref([]);
let section = ref("new");
axios
  .get("https://ecommerce-r6l7.onrender.com/product/all?page=1")
  .then((data) => (product.value = data.data
  ))
  .then(data => subproduct.value = product.value)
while(true){
  console.log("not rendered");
  if(product.value.length ==1){
    console.log("rendered");
    break
  }
}
let renderMost = () => {
  product.value = product.value.filter((ele) => ele.image != null);
  section.value = "most";
};
let renderNew = () => {
  product.value = subproduct.value
  section.value = 'new'
};
</script>

<template>
  <div v-if="!product.legnth" id="preloder">
        <div class="loader"></div>
    </div>
  <div class="row">
    <div class="col-lg-12">
      <ul class="filter__controls">
        <li
          :class="{ active: section == 'new' }"
          @click="renderNew"
          
        >
          New Arrivals
        </li>
        <li
          :class="{ active: section == 'most' }"
          @click="renderMost"
         
        >
          Most Watched
        </li>
      </ul>
    </div>
  </div>
  <ProductView :product="product" ></ProductView>
</template>
<style scoped>
</style>