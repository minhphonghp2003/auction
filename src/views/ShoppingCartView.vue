<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useCookies } from "vue3-cookies";
import { ContentLoader } from "vue-content-loader";
import { useRouter } from "vue-router";
import { Buffer } from "buffer";

let router = useRouter()
let order = ref([])
let cart = ref([])
let { cookies } = useCookies();
let token = ref(cookies.get("token"));


onMounted(async()=>{

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
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="product__cart__item">
                                        <div class="product__cart__item__pic">
                                            <img src="/src/assets/img/shopping-cart/cart-1.jpg" alt="">
                                        </div>
                                        <div class="product__cart__item__text">
                                            <h6>T-shirt Contrast Pocket</h6>
                                            <h5>$98.49</h5>
                                        </div>
                                    </td>
                                   
                                    <td class="cart__price">In process</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <div class="continue__btn">
                                <a href="#">Continue Bidding</a>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <div class="continue__btn update__btn">
                                <a href="#"><i class="fa fa-spinner"></i> Update cart</a>
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    </section>
</template>

<style></style>
