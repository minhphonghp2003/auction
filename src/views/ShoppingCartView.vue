<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useCookies } from "vue3-cookies";
import { ContentLoader } from "vue-content-loader";
import { useRouter } from "vue-router";
import { Buffer } from "buffer";

let router = useRouter()
let loading = ref(true)
let order = ref([])
let bid = ref([])
let { cookies } = useCookies();
let token = ref(cookies.get("token"));


onMounted(async () => {
    order.value = (await axios.get('https://ecommerce-r6l7.onrender.com/order/myorder', {
        headers: {
            token: token.value
        }
    })).data
    bid.value = (await axios.get('https://ecommerce-r6l7.onrender.com/product/mybid', {
        headers: {
            token: token.value
        }
    })).data
    bid.value.forEach(element => {
        element.p_image = Buffer.from(element.p_image).toString("base64");
        element.status = 'bidding'
    });
    order.value.forEach(element => {
        element.p_image = Buffer.from(element.p_image).toString("base64");
    });
    loading.value = false
})

</script>

<template>
    <section class="shopping-cart spad">

        <div style="margin-top:150px" class="container">
            <div class="row">
                <div class="col-lg-8">
                    <div class="shopping__cart__table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th style="text-align: right">Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <content-loader v-if="loading" viewBox="0 0 476 124" :speed="2" primaryColor="#f3f3f3"
                                secondaryColor="#ecebeb">
                                <rect x="28" y="16" rx="0" ry="0" width="96" height="86" />
                                <rect x="168" y="15" rx="0" ry="0" width="96" height="86" />
                                <rect x="309" y="17" rx="0" ry="0" width="96" height="86" />
                                <rect x="26" y="108" rx="0" ry="0" width="387" height="10" />
                            </content-loader>
                            <tbody v-if="!loading">
                                <tr v-for="b in bid" :key="bid">
                                    <div class="product__cart__item__pic">
                                        <img v-bind:src="'data:image/jpeg;base64,' + b.p_image" />
                                    </div>
                                    <td class="product__cart__item">
                                        <div class="product__cart__item__text">
                                            <h6 style="cursor: pointer"
                                                @click="$router.push({name:'auctiondetail',params:{pid:b.product_id}})">
                                                {{b.product_name}}</h6>
                                            <h5>{{b.price}}</h5>
                                        </div>
                                    </td>

                                    <td class="cart__price">{{b.status}}</td>
                                </tr>
                                <tr v-for="o in order" :key="order">
                                    <div class="product__cart__item__pic">
                                        <img v-bind:src="'data:image/jpeg;base64,' + o.p_image" />
                                    </div>
                                    <td class="product__cart__item">
                                        <div class="product__cart__item__text">
                                            <h6 style="cursor: pointer">
                                                {{o.product_name}}</h6>
                                            <h5>{{o.price}}</h5>
                                        </div>
                                    </td>

                                    <td class="cart__price">{{o.status}}</td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <div class="continue__btn">
                                <a @click="$router.push({name:'auction'})" href="#">Continue Bidding</a>
                            </div>
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<style>

</style>
