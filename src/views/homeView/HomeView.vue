<script setup>
import { ref } from "@vue/reactivity";
import ProductView from "../ProductView.vue";
let section = ref({page:'new'})
</script>

<template>
  <div class="row">
    <div class="col-lg-12">
      <ul class="filter__controls">
          <li :class="{active : section.page == 'new'}" @click="section.page = 'new'" >New Arrivals</li>
        <li  :class="{active : section.page == 'most'}" @click="section.page = 'most'" >Most Watched</li>
      </ul>
    </div>
  </div>
  <ProductView v-bind="section"></ProductView>
</template>
<style scoped>



</style>