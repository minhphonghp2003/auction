<script setup>
import { onMounted, ref } from "vue";

import { useRoute, useRouter } from "vue-router";
import { io } from 'socket.io-client'
import { Buffer } from "buffer";
import { useCookies } from "vue3-cookies";
import axios from "axios";
import ChatRoomView from "../components/auctiondetail/ChatRoomView.vue";
import BidderListView from "../components/auctiondetail/BidderListView.vue";
import ProductView from "../components/ProductView.vue";
import UserView from "../components/auctiondetail/UserView.vue";
let route = useRoute();
let router = useRouter();
let id = ref(route.params);
let product = ref({});
let loading = ref(true);
let mainImg = ref("");
let seller_id = ref('')
let user_bid = ref();
let error = ref("");
let section = ref('desc')
let related = ref([])
let pid = route.params.pid;
let sellerView = ref(false)
let deleting = ref(false)
let isBidding = ref(false)
let { cookies } = useCookies();
let token = ref(cookies.get("token"));
const emit = defineEmits(['newcart'])
const socket = io("https://ecommerce-r6l7.onrender.com");

socket.on('setnewprice', (bid) => {
  user_bid.value = bid.user_bid
  product.value.prod.price = bid.price
})

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

let getRelated = async (cate) => {
  let prod = (await axios('https://ecommerce-r6l7.onrender.com/product/all')).data
  for (let ele of prod) {
    if (ele.category == cate) {
      related.value.push(ele)
    }
  }

  related.value = related.value.slice(0, 4)
  for (let i in related.value) {

    related.value[i].image = Buffer.from(related.value[i].image).toString("base64");

    related.value[i].date_end = related.value[i].date_end.split("T")[0]
  }
}

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
    getRelated(product.value.prod.cate)
  } catch (error) { }
});



let bid = async () => {
  if (!token.value) {
    router.push({ name: 'login' })
  }
  isBidding.value = true
  error.value = "";
  let min = product.value.prod.price + product.value.prod.min_increase;
  let max = product.value.prod.price + product.value.prod.max_increase;
  if (user_bid.value < min || user_bid.value > max) {
    error.value = "Please bid in valid range";
    isBidding.value = false
    return;
  }
  try {
    await axios.post("https://ecommerce-r6l7.onrender.com/product/bid", { product_id: product.value.prod.product_id, price: product.value.prod.price + user_bid.value },
      {
        headers: {
          token: token.value
        }
      }
    )
    product.value.prod.price += user_bid.value;
    user_bid.value += min
    socket.emit('newbid', { user_bid: user_bid.value, price: product.value.prod.price })
    emit('newcart')
    isBidding.value = false

  } catch (err) {
    if (err.response.data.includes("duplicate")) {
      try {
        await axios.put("https://ecommerce-r6l7.onrender.com/product/bid", { product_id: product.value.prod.product_id, price: product.value.prod.price + user_bid.value },
          {
            headers: {
              token: token.value
            }
          }
        )
        product.value.prod.price += user_bid.value;
        user_bid.value += min
        socket.emit('newbid', { user_bid: user_bid.value, price: product.value.prod.price })

    emit('newcart')
        isBidding.value = false
      } catch (erro) {
        isBidding.value = false
      }
    }

  }
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


let userView = (s_id) => {
  seller_id.value = s_id
  sellerView.value = true

}

let exitUser = () => {
  sellerView.value = false
}

let deleteProd = async () => {
  try {
    deleting.value = true
    await axios.delete('https://ecommerce-r6l7.onrender.com/product/', {
      data:{
        id:product.value.prod.product_id
      },headers: {
        token: token.value,
      },
      
    })
    router.push({ name: "auction" })
  } catch (err) {
    deleting.value =false 
    error.value = "You can not delete this product."
  }
}


</script>

<template>

  <UserView @exit-user="exitUser" v-if="sellerView" :uid="seller_id"></UserVIew>

  <section @click="sellerViewToggle" v-if="!loading" class="shop-details">
    <div class="product__details__pic">
      <div class="container">
        <div class="row" style="margin-top: 120px">
          <p v-if="!deleting" @click="deleteProd" style="color:red; cursor: pointer;">Delete Product</p>
          <div class="col-lg-3 col-md-3">
            <i v-if="deleting" class="fa fa-spinner fa-spin" ></i>
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
                <a v-if="!isBidding" style="cursor: pointer; color: white" @click="bid" class="primary-btn">Bid</a>
              </div>
              <div class="product__details__btns__option">
                <a href="#"><i class="fa fa-heart"></i> add to wishlist</a>
              </div>
              <div class="product__details__last__option">
                <h5><span>More information</span></h5>
                <ul>
                  <li><span>Seller:</span><a @click="userView(product.prod.seller)"
                      style="cursor: pointer">{{product.seller_name}}</a> </li>
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
                      <ChatRoomView :id="product.prod.product_id"></ChatRoomView>
                    </div>

                  </div>
                </div>
              </div>
              <div v-if="section == 'bidderlist'" class="tab-content">
                <div class="tab-pane active" id="tabs-5" role="tabpanel">
                  <div class="product__details__tab__content">

                    <div class="product__details__tab__content__item">
                      <BidderListView :bidders="product.bidders" :key="product.bidders"></BidderListView>
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

  <content-loader v-if="loading" viewBox="0 0 476 124" :speed="2" primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="28" y="16" rx="0" ry="0" width="96" height="86" />
    <rect x="168" y="15" rx="0" ry="0" width="96" height="86" />
    <rect x="309" y="17" rx="0" ry="0" width="96" height="86" />
    <rect x="26" y="108" rx="0" ry="0" width="387" height="10" />
  </content-loader>
  <!-- Related Section Begin -->
  <section v-if="!loading" class="related spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h3 class="related-title">Related Product</h3>
        </div>
      </div>
      <div class="row">

        <ProductView :product="related"></ProductView>
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