
<script setup>
import axios from 'axios';
import { ref } from 'vue';
import RegisterView from './RegisterView.vue'
import { useCookies } from 'vue3-cookies'
import { useRouter } from 'vue-router'

const router = useRouter()
const { cookies } = useCookies()
let loginComp = ref(true)
let emit = defineEmits(['renderLogin'])
let swapComp = () => {
  router.push({ name: 'register' })
}
let username = ref('')
let password = ref('')
let isUsername = ref(true)
let isPassword = ref(true)
let nouser = ref(false)
let submit = ref(true)

let checkNoInput = () => {
  if (!username.value) {
    isUsername.value = false
    return true
  }
  if (!password.value) {
    isPassword.value = false
    return true
  }
}

let login = async () => {
  submit.value = false
  if (checkNoInput()) {

    return
  }
  let credential = { username: username.value, password: password.value }
  try {
    let res = (await axios.post("https://ecommerce-r6l7.onrender.com/user/login", credential)).data
    if (res.error) {
      throw new Error(error)
    }

    cookies.set('token', res.token)
    submit.value = true
    router.push({ name: 'home' })
      .then(() => { router.go() })
  } catch (error) {
    submit.value = true
    nouser.value = true
  }

}

let forgotpasswd = () => {
  router.push({ name: 'forgotpasswd' })
}

let ggLogin = async () => {
  // http://localhost:4000/user/auth/google
  window.location.href = "https://ecommerce-r6l7.onrender.com/user/auth/google"  
}

</script>

<template>
  <div v-if="loginComp" class="limiter">
    <div class="container-login100" style="background-image: url('/src/assets/auth/images/bg-01.jpg')">
      <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54" style="margin:150px">
        <span class="login100-form-title p-b-49"> Login </span>
        <p style="color:red" v-if="nouser">No valid user</p>
        <div class="wrap-input100 validate-input m-b-23">
          <span class="label-input100">Username</span>
          <input class="input100" type="text" name="username" placeholder="Type your username" v-model="username" />
          <span class="focus-input100" data-symbol="&#xf206;"></span>
        </div>
        <p v-if="!isUsername" style="color:red">Username is require</p>
        <div class="wrap-input100 validate-input">
          <span class="label-input100">Password</span>
          <input class="input100" type="password" name="password" placeholder="Type your password" v-model="password" />
          <span class="focus-input100" data-symbol="&#xf190;"></span>
        </div>

        <p v-if="!isPassword" style="color:red">Password is require</p>
        <div class="text-right p-t-8 p-b-31">
          <a href="#" @click="forgotpasswd"> Forgot password? </a>
        </div>

        <div class="container-login100-form-btn">
          <div class="wrap-login100-form-btn">
            <div class="login100-form-bgbtn"></div>
            <button v-if="submit" class="login100-form-btn" @click="login">Login</button>
          </div>
        </div>


        <div class="txt1 text-center p-t-54 p-b-20">
          <span> Or Login Using </span>
        </div>

        <div class="flex-c-m">


          <a @click="ggLogin" href="#" class="login100-social-item bg3">
            <i class="fa fa-google"></i>
          </a>
        </div>

        <div class="flex-col-c p-t-155">

          <a href="#" @click="swapComp" class="txt2"> Sign Up </a>
        </div>
      </div>
    </div>
  </div>

  <div id="dropDownSelect1"></div>
</template>
<style scoped>
@import "../../assets/auth/css/util.css";
@import "../../assets/auth/css/main.css";
@import "../../assets/auth/vendor/bootstrap/css/bootstrap.min.css";
@import "../../assets/auth/fonts/font-awesome-4.7.0/css/font-awesome.min.css";
@import "../../assets/auth/fonts/iconic/css/material-design-iconic-font.min.css";
@import "../../assets/auth/vendor/animate/animate.css";
@import "../../assets/auth/vendor/css-hamburgers/hamburgers.min.css";
@import "../../assets/auth/vendor/animsition/css/animsition.min.css";
@import "../../assets/auth/vendor/select2/select2.min.css";
@import "../../assets/auth/vendor/daterangepicker/daterangepicker.css";
</style>