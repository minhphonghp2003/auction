<script setup>

import axios from 'axios';
import { Buffer } from "buffer";
import { onMounted, onUpdated, ref } from "vue";
import { ContentLoader } from "vue-content-loader";
import ProductView from '../components/ProductView.vue';

let product = ref([])
let category = ref([])
let filter = ref()
let loading = ref(true)
let choseCate = ref()
let page = ref(1)

onMounted(async () => {
    try {
        loading.value = true
        category.value = (await axios.get('https://ecommerce-r6l7.onrender.com/product/category')).data
        product.value = (await axios.get('https://ecommerce-r6l7.onrender.com/product/all')).data
        product.value.forEach((element) => {
            element.image = Buffer.from(element.image).toString("base64");
            element.date_end = element.date_end.split("T")[0];
        });
        if (category) {
            product.value.filter(ele => ele.cate = category)
        }

        loading.value = false
    } catch (error) {
        console.log(error);
    }
})



</script>

<template>
    <!-- Breadcrumb Section Begin -->
    <section class="breadcrumb-option">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb__text">
                        <h4>Shop</h4>
                        <div class="breadcrumb__links">
                            <a href="./index.html">Home</a>
                            <span>Shop</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Breadcrumb Section End -->

    <!-- Shop Section Begin -->
    <section class="shop spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-3">
                    <div class="shop__sidebar">
                        <div class="shop__sidebar__search">
                            <form action="#">
                                <input type="text" placeholder="Search...">
                                <button type="submit"><span class="icon_search"></span></button>
                            </form>
                        </div>
                        <div class="shop__sidebar__accordion">
                            <div class="accordion" id="accordionExample">
                                <div class="card">
                                    <div class="card-heading">
                                        <a data-toggle="collapse" data-target="#collapseOne">Categories</a>
                                    </div>
                                    <div id="collapseOne" class="collapse show" data-parent="#accordionExample">
                                        <div class="card-body">
                                            <div class="shop__sidebar__categories">
                                                <content-loader v-if="loading" viewBox="0 0 476 124" :speed="2"
                                                    primaryColor="#f3f3f3" secondaryColor="#ecebeb">
                                                    <rect x="28" y="16" rx="0" ry="0" width="96" height="86" />
                                                    <rect x="168" y="15" rx="0" ry="0" width="96" height="86" />
                                                    <rect x="309" y="17" rx="0" ry="0" width="96" height="86" />
                                                    <rect x="26" y="108" rx="0" ry="0" width="387" height="10" />

                                                </content-loader>
                                                <select v-else class="nice-scroll" v-model="choseCate">
                                                    <option v-for="c in category" :key="category">
                                                        {{c.cate}}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-9">
                    <content-loader v-if="loading" viewBox="0 0 476 124" :speed="2" primaryColor="#f3f3f3"
                        secondaryColor="#ecebeb">
                        <rect x="28" y="16" rx="0" ry="0" width="96" height="86" />
                        <rect x="168" y="15" rx="0" ry="0" width="96" height="86" />
                        <rect x="309" y="17" rx="0" ry="0" width="96" height="86" />
                        <rect x="26" y="108" rx="0" ry="0" width="387" height="10" />

                    </content-loader>
                    <div v-else class="shop__product__option">
                        <div class="row">

                            <div class="col-lg-6 col-md-6 col-sm-6">
                                <div class="shop__product__option__right">
                                    <p>Filter: </p>
                                    <select v-model="filter">
                                        <option>DateEnd</option>
                                        <option>Active</option>
                                        <option>Pending</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <ProductView :product="product"></ProductView>

                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="product__pagination">
                                <a class="active" href="#">1</a>
                                <a href="#">2</a>
                                <a href="#">3</a>
                                <span>...</span>
                                <a href="#">21</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Shop Section End -->
</template>
<style scoped>

</style>