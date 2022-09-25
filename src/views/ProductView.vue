
<script setup>
import { ref } from "@vue/reactivity";
import buffer, { Buffer } from "buffer";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";
let props = defineProps(["page"]);
let product = ref([]);
onMounted(async () => {
  if (props.page == "new") {
    product.value = (
      await axios.get("https://ecommerce-r6l7.onrender.com/product/all?page=1")
    ).data;
  }
});
product.value.forEach((p) => {
  let base64String = Buffer.from(p.image).toString("base64") 
  p.image = "data:image/jpg;base64," + base64String
});
</script>

<template>
  {{ page }}
  <section class="product spad">
    <div class="container">
      <div class="row product__filter">
        <div
          class="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals"
          v-for="p of product"
          :key="p.id"
        >
          <div class="product__item">
            <div class="product__item__pic">
              <img :src="p.image" alt="image" />
              <span class="label" :class="{ pending: p.status == 'pending' }">
                {{ p.status }}
              </span>
              <ul class="product__hover">
                <li>
                  <a href="#"
                    ><img src="/src/assets/img/icon/heart.png" alt=""
                  /></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6>{{ p.name }}</h6>
              <a href="#" class="add-cart"> Start Bidding</a>
              <div class="rating">Sku: {{ p.sku }}</div>
              <h5>{{ p.date_end }}</h5>
              <div class="product__color__select">
                <label for="pc-1">
                  <input type="radio" id="pc-1" />
                </label>
                <label class="active black" for="pc-2">
                  <input type="radio" id="pc-2" />
                </label>
                <label class="grey" for="pc-3">
                  <input type="radio" id="pc-3" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pending {
  color: red;
}
</style>