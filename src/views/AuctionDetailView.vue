<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Buffer } from "buffer";
import axios from "axios";
import ChatRoomView from "../components/auctiondetail/ChatRoomView.vue";
import BidderListView from "../components/auctiondetail/BidderListView.vue";
let route = useRoute();
let id = ref(route.params);
let product = ref({});
let loading = ref(true);
let mainImg = ref("");
let user_bid = ref();
let error = ref("");
let section = ref('desc')

let pid = route.params.pid;

let buffer2b64 = (buffer) => {
  return Buffer.from(buffer).toString("base64");
};

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

onMounted(async () => {
  try {
    product.value = (
      await axios.get(`https://ecommerce-r6l7.onrender.com/product/${pid}`)
    ).data;
    product.value.prod.price = parseInt(product.value.prod.price);
    product.value.prod.min_increase = parseInt(product.value.prod.min_increase);
    product.value.prod.max_increase = parseInt(product.value.prod.max_increase);
    let dateEnd = product.value.prod.date_end.split("T")[0].split("-");
    product.value.prod.date_end = new Date(dateEnd[0], dateEnd[1] - 1, dateEnd[2]);
    countDown(product.value.prod.date_end)

    product.value.prod.date_end = product.value.prod.date_end.toString().slice(0, 16);
    for (let i in product.value.prod.image) {
      product.value.prod.image[i] = URL.createObjectURL(
        b64toBlob(buffer2b64(product.value.prod.image[i]))
      );
    }
    mainImg.value = product.value.prod.image[0];
    user_bid.value = product.value.prod.price + product.value.prod.min_increase;
    loading.value = false;
  } catch (error) { }
});



let bid = () => {
  error.value = "";
  let min = product.value.prod.price + product.value.prod.min_increase;
  let max = product.value.prod.price + product.value.prod.max_increase;
  if (user_bid.value < min || user_bid.value > max) {
    error.value = "Please bid in valid range";
    return;
  }
  product.value.prod.price += user_bid.value;
};

let countDown = (countDownDate) => {

  setInterval(() => {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    product.value.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    product.value.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + 9);
    product.value.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    product.value.seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      clearInterval();
      return
    }

  }, 1000);

};

</script>

<template>
  <section v-if="!loading" class="shop-details">
    <div class="product__details__pic">
      <div class="container">
        <div class="row" style="margin-top: 120px">
          <div class="col-lg-3 col-md-3">
            <ul class="nav nav-tabs" role="tablist">
              <li @click="mainImg = i" v-for="i of product.prod.image" :key="i" class="nav-item">
                <a class="nav-link active" data-toggle="tab" style="cursor: pointer" role="tab">
                  <img class="product__thumb__pic set-bg" :src="i" />
                </a>
              </li>
            </ul>
          </div>
          <div class="col-lg-6 col-md-9">
            <div class="tab-content">
              <div class="tab-pane active" id="tabs-1" role="tabpanel">
                <div class="product__details__pic__item">
                  <img :src="mainImg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="product__details__content">
      <div class="container">
        <div class="row d-flex justify-content-center">
          <div class="col-lg-8">
            <div class="product__details__text">
              <p style="color: red">{{ error }}</p>
              <h4>{{ product.prod.name }}</h4>
              <div class="rating">
                <i class="fa fa-hand-o-up"></i>

                <span> - {{ product.bidder_count }} Bidders</span>
              </div>
              <h3>{{ product.prod.price }}</h3>
              <h4>Date end: </h4>{{product.prod.date_end}}
              <h3>
                {{product.days}} D : {{product.hours}} H : {{product.minutes}} M : {{product.seconds}} S
              </h3>
              <div class="product__details__cart__option">
                <ul style="list-style-type: none;">
                  <li>
                    <span>Min increase:</span> {{ product.prod.min_increase }}
                  </li>
                  <li>
                    <span>Max increase:</span> {{ product.prod.max_increase }}
                  </li>
                </ul>
                <div class="quantity"></div>
                <div class="quantity">
                  <div class="pro-qty">
                    <input type="number" :min="product.prod.min_increase + product.prod.price" v-model="user_bid" />
                  </div>
                </div>
                <a style="cursor: pointer; color: white" @click="bid" class="primary-btn">Bid</a>
              </div>
              <div class="product__details__btns__option">
                <a href="#"><i class="fa fa-heart"></i> add to wishlist</a>
              </div>
              <div class="product__details__last__option">
                <h5><span>More information</span></h5>
                <ul>
                  <li><span>Seller:</span> {{product.seller_name}}</li>
                  <li><span>SKU:</span> {{product.prod.sku}}</li>
                  <li><span>Categories:</span> {{product.prod.cate}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="product__details__tab">
              <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                  <a @click="section = 'desc'" class="nav-link " :class="{active: section == 'desc'}"
                    role="tab">Description</a>
                </li>
                <li class="nav-item">
                  <a @click="section = 'chat'" class="nav-link" :class="{active: section == 'chat'}" role="tab">Chat
                    room</a>
                </li>
                <li class="nav-item">
                  <a @click="section = 'bidderlist'" :class="{active: section == 'bidderlist'}" class="nav-link"
                    role="tab">List of bidders</a>
                </li>
              </ul>
              <div v-if="section == 'desc'" class="tab-content">
                <div class="tab-pane active" id="tabs-5" role="tabpanel">
                  <div class="product__details__tab__content">

                    <div class="product__details__tab__content__item">
                      {{product.prod.description}}
                    </div>

                  </div>
                </div>
              </div>
              <div v-if="section == 'chat'" class="tab-content">
                <div class="tab-pane active" id="tabs-5" role="tabpanel">
                  <div class="product__details__tab__content">

                    <div class="product__details__tab__content__item">
                      <ChatRoomView :id="product.prod.product_id" ></ChatRoomView>
                    </div>

                  </div>
                </div>
              </div>
              <div v-if="section == 'bidderlist'" class="tab-content">
                <div class="tab-pane active" id="tabs-5" role="tabpanel">
                  <div class="product__details__tab__content">

                    <div class="product__details__tab__content__item">
                      <BidderListView :bidders="product.bidders" ></BidderListView>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Related Section Begin -->
  <section class="related spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h3 class="related-title">Related Product</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-6 col-sm-6">
          <div class="product__item">
            <div class="product__item__pic set-bg" data-setbg="/src/assets/img/product/product-1.jpg">
              <span class="label">New</span>
              <ul class="product__hover">
                <li>
                  <a href="#"><img src="/src/assets/img/icon/heart.png" alt="" /></a>
                </li>
                <li>
                  <a href="#"><img src="/src/assets/img/icon/compare.png" alt="" />
                    <span>Compare</span></a>
                </li>
                <li>
                  <a href="#"><img src="/src/assets/img/icon/search.png" alt="" /></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6>Piqué Biker Jacket</h6>
              <a href="#" class="add-cart">+ Add To Cart</a>
              <div class="rating">
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
              </div>
              <h5>$67.24</h5>
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
        <div class="col-lg-3 col-md-6 col-sm-6 col-sm-6">
          <div class="product__item">
            <div class="product__item__pic set-bg" data-setbg="/src/assets/img/product/product-2.jpg">
              <ul class="product__hover">
                <li>
                  <a href="#"><img src="/src/assets/img/icon/heart.png" alt="" /></a>
                </li>
                <li>
                  <a href="#"><img src="/src/assets/img/icon/compare.png" alt="" />
                    <span>Compare</span></a>
                </li>
                <li>
                  <a href="#"><img src="/src/assets/img/icon/search.png" alt="" /></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6>Piqué Biker Jacket</h6>
              <a href="#" class="add-cart">+ Add To Cart</a>
              <div class="rating">
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
              </div>
              <h5>$67.24</h5>
              <div class="product__color__select">
                <label for="pc-4">
                  <input type="radio" id="pc-4" />
                </label>
                <label class="active black" for="pc-5">
                  <input type="radio" id="pc-5" />
                </label>
                <label class="grey" for="pc-6">
                  <input type="radio" id="pc-6" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6 col-sm-6">
          <div class="product__item sale">
            <div class="product__item__pic set-bg" data-setbg="/src/assets/img/product/product-3.jpg">
              <span class="label">Sale</span>
              <ul class="product__hover">
                <li>
                  <a href="#"><img src="/src/assets/img/icon/heart.png" alt="" /></a>
                </li>
                <li>
                  <a href="#"><img src="/src/assets/img/icon/compare.png" alt="" />
                    <span>Compare</span></a>
                </li>
                <li>
                  <a href="#"><img src="/src/assets/img/icon/search.png" alt="" /></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6>Multi-pocket Chest Bag</h6>
              <a href="#" class="add-cart">+ Add To Cart</a>
              <div class="rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star-o"></i>
              </div>
              <h5>$43.48</h5>
              <div class="product__color__select">
                <label for="pc-7">
                  <input type="radio" id="pc-7" />
                </label>
                <label class="active black" for="pc-8">
                  <input type="radio" id="pc-8" />
                </label>
                <label class="grey" for="pc-9">
                  <input type="radio" id="pc-9" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6 col-sm-6">
          <div class="product__item">
            <div class="product__item__pic set-bg" data-setbg="/src/assets/img/product/product-4.jpg">
              <ul class="product__hover">
                <li>
                  <a href="#"><img src="/src/assets/img/icon/heart.png" alt="" /></a>
                </li>
                <li>
                  <a href="#"><img src="/src/assets/img/icon/compare.png" alt="" />
                    <span>Compare</span></a>
                </li>
                <li>
                  <a href="#"><img src="/src/assets/img/icon/search.png" alt="" /></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6>Diagonal Textured Cap</h6>
              <a href="#" class="add-cart">+ Add To Cart</a>
              <div class="rating">
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
              </div>
              <h5>$60.9</h5>
              <div class="product__color__select">
                <label for="pc-10">
                  <input type="radio" id="pc-10" />
                </label>
                <label class="active black" for="pc-11">
                  <input type="radio" id="pc-11" />
                </label>
                <label class="grey" for="pc-12">
                  <input type="radio" id="pc-12" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Related Section End -->
</template>

<style scoped>
a {
  cursor: pointer
}
</style>