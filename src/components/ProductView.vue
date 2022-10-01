
<script setup>
import { useRouter } from "vue-router";
let props = defineProps(["product"]);

let router = useRouter();
let goToProduct = (pid) => {
  router.push({ name: "auctiondetail", params: { pid: pid } });
};
</script>

<template>
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
              <img v-bind:src="'data:image/jpeg;base64,' + p.image" />
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
              <a
                v-if="p.status == 'active'"
                href="#"
                @click="goToProduct(p.id)"
                class="add-cart"
              >
                Start Bidding</a
              >
              <a v-else class="add-cart">Session not started yet</a>
              <div class="rating">Sku: {{ p.sku }}</div>
              <h5>{{ p.date_end }}</h5>
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