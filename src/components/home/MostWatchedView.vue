
<script setup>
  import {useRouter} from 'vue-router'
import router from '../../router';
let props = defineProps([
  'id',
  "b_count",
  "name",
  "category",
  "image",
  "days",
  "hours",
  "minutes",
  "seconds",
]);
let bidnow = ()=>{
  router.push({name:'auctiondetail',params:{pid:props.id}})
}
</script>

<template>
  <section class="categories spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-3">
          <div class="categories__text">
            <h2>
              Hot <br />
              <span>{{ category }}</span> <br />
            </h2>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="categories__hot__deal">
            <img v-bind:src="'data:image/jpeg;base64,' + image" alt="image" />
            <div class="hot__deal__sticker">
              <span>Hot deal</span>
              <h5>{{ b_count }} bidders</h5>
            </div>
          </div>
        </div>
        <div class="col-lg-4 offset-lg-1">
          <div class="categories__deal__countdown">
            <span>Deal Of The Day</span>
            <h2>
              {{ name }}
              <br />
            </h2>

            <div class="categories__deal__countdown__timer" id="countdown">
              <div class="cd-item">
                <span>{{ days }}</span>
                <h5>Days</h5>
              </div>
              <div class="cd-item">
                <span>{{ hours }}</span>
                <h5>Hours</h5>
              </div>
              <div class="cd-item">
                <span>{{ minutes }}</span>
                <h5>Minutes</h5>
              </div>
              <div class="cd-item">
                <span>{{ seconds }}</span>
                <h5>Seconds</h5>
              </div>
            </div>
            <a href="#" @click="bidnow" class="primary-btn">Bid now</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
</style>