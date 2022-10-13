<script setup>

import axios from 'axios';
import { Buffer } from "buffer";
import { onMounted, onUpdated, ref } from "vue";
import { ContentLoader } from "vue-content-loader";
import ProductView from '../components/ProductView.vue';

let product = ref([])
let filteredProd = ref([])
let category = ref([])
let filter = ref('None')
let loading = ref(true)
let choseCate = ref('None')
let page = ref(1)
let list_page = ref()

onMounted(async () => {
    try {
        loading.value = true

        list_page.value = (await axios.get("https://ecommerce-r6l7.onrender.com/product/pagecount")).data
        list_page.value = Math.ceil(list_page.value-1)


        
        category.value = (await axios.get('https://ecommerce-r6l7.onrender.com/product/category')).data
        product.value = (await axios.get(`https://ecommerce-r6l7.onrender.com/product/all?page=${page.value}`)).data
        product.value.forEach((element) => {
            element.image = Buffer.from(element.image).toString("base64");
            element.date_end = element.date_end.split("T")[0];
        });

        filteredProd.value = JSON.parse(JSON.stringify(product.value));

        loading.value = false
    } catch (error) {
        console.log(error);
    }
})


let newPage =async (p)=>{
     try {
        page.value = p
        loading.value = true

        product.value = (await axios.get(`https://ecommerce-r6l7.onrender.com/product/all?page=${page.value}`)).data
        product.value.forEach((element) => {
            element.image = Buffer.from(element.image).toString("base64");
            element.date_end = element.date_end.split("T")[0];
        });
        filteredProd.value = JSON.parse(JSON.stringify(product.value));
        
        loading.value = false
    } catch (error) {
        console.log(error);
    }
}


let filtering = () => {
    let choiceProd = []
    if (choseCate.value !== "None") {
        for (const ele of product.value) {
            if (ele.category == choseCate.value) {
                choiceProd.push(ele)
            }
        }
    } else {
        choiceProd = JSON.parse(JSON.stringify(product.value));
    }
    if (filter.value !== 'None') {
        for (let ind=0; ind<choiceProd.length; ind++  ) {
            if (filter.value !== "DateEnd" && choiceProd[ind].status !== filter.value) {
                choiceProd.splice(ind, 1)
                ind--
            }
            if (filter.value === "DateEnd") {
                choiceProd.sort((a, b) => b.date_end.split('-').join('') - a.date_end.split('-').join(''))
            }
        }
    } 
    filteredProd.value = choiceProd
}

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
                                                    <option> None</option>
                                                    <option v-for="c in category" :key="category">
                                                        {{c.cate}}</option>
                                                </select>

                                                <i @click="filtering" style="margin-left: 10px;cursor: pointer;"
                                                    class="fa fa-filter" aria-hidden="true"></i>


                                            </div>
                                        </div>
                                    </div>
                                    <br>
                                    <div class="card-heading">
                                        <a data-toggle="collapse" data-target="#collapseOne">Filter</a>
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
                                                <select v-else v-model="filter">
                                                    <option>None</option>
                                                    <option>DateEnd</option>
                                                    <option>active</option>
                                                    <option>pending</option>
                                                </select>

                                                <i @click="filtering" style="margin-left: 10px;cursor: pointer;"
                                                    class="fa fa-filter" aria-hidden="true"></i>


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

                    <div v-if="!loading" class="row">
                        <ProductView  :product="filteredProd"></ProductView>

                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="product__pagination">
                                <a @click="newPage(p)" :class="{active:p==page}" v-for="p in list_page" :key="p" href="#">{{p}}</a>
                                
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