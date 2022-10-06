<script setup>
import ProductView from '../ProductView.vue';
import { Buffer } from 'buffer'
import axios from 'axios'
import { onMounted, ref } from 'vue';
const emit = defineEmits(["exitUser"]);
let props = defineProps(['uid'])
let user = ref({})
let isDone = ref(false)
onMounted(async () => {
    user.value = (await axios.get(`https://ecommerce-r6l7.onrender.com/user/?id=${props.uid}`)).data
    user.value.user.avatar = Buffer.from(user.value.user.avatar).toString("base64");
    user.value.product.forEach((element) => {
        element.image = Buffer.from(element.image).toString("base64");
        element.date_end = element.date_end.split("T")[0];
    });
    isDone.value = true
})

let toggleUserView = () =>{
    emit('exitUser')
}

</script>
<template>


    <div @click="isClicked" v-if="isDone" class="row py-5 px-4">
        <div  class="col-xl-4 col-md-6 col-sm-10 mx-auto">
            <!-- Profile widget -->
            <div style="position:fixed;z-index:999;height: 100%;overflow: scroll;margin-top: 35px;" class="bg-white shadow rounded ">
                <div class="px-4 pt-0 pb-4 bg-dark">
                    <div class="media align-items-end profile-header">
                        <div class="profile mr-3"><img v-bind:src="'data:image/jpeg;base64,' + user.user.avatar"
                            alt="..." width="130" class="rounded mb-2 img-thumbnail"></div>
                            <div class="media-body mb-5 text-white">
                                <i @click="toggleUserView" style="cursor:pointer;color:red" class="fa fa-close"> Close</i>
                                <h4 class="mt-0 mb-0">{{user.user.fullname}}</h4>
                                <p class="small mb-4"> <i class="fa fa-envelope mr-2"></i>{{user.user.email}}</p>
                                <p class="small mb-4"> <i class="fa fa-phone mr-2"></i>{{user.user.phone}}</p>
                            </div>
                    </div>
                </div>


                <div class="py-4 px-4">
                    
                    <div class="row">
                        <ProductView :product="user.product"></ProductView>
                    </div>

                </div>
            </div><!-- End profile widget -->

        </div>
    </div>
</template>
<style scoped>
@import "../../assets/css/bootstrap.min.css";
@import "../../assets/css/font-awesome.min.css";

.profile-header {
    transform: translateY(5rem);
}


/*
*
* ==========================================
* FOR DEMO PURPOSE
* ==========================================
*
*/
body {
    background: -webkit-linear-gradient(to right, #654ea3, #eaafc8);
    background: linear-gradient(to right, #654ea3, #eaafc8);
    min-height: 100vh;
}
</style>