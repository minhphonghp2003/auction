
<script setup>
import { ref } from "@vue/reactivity";
  let username = ref('')
  let password = ref('')
</script>

<template>
  <div class="limiter">
    <div
      class="container-login100"
      style="background-image: url('/src/assets/auth/images/bg-01.jpg')"
    >
      <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54" style="margin:150px">
        <form class="login100-form validate-form">
          <span class="login100-form-title p-b-49"> Login </span>

          <div
            class="wrap-input100 validate-input m-b-23"
            data-validate="Username is reauired"
          >
            <span class="label-input100">Username</span>
            <input
              class="input100"
              type="text"
              name="username"
              placeholder="Type your username"
              v-model="username"
            />
            <span class="focus-input100" data-symbol="&#xf206;"></span>
          </div>

          <div
            class="wrap-input100 validate-input"
            data-validate="Password is required"
          >
            <span class="label-input100">Password</span>
            <input
              class="input100"
              type="password"
              name="pass"
              placeholder="Type your password"
            />
            <span class="focus-input100" data-symbol="&#xf190;"></span>
          </div>

          <div class="text-right p-t-8 p-b-31">
            <a href="#"> Forgot password? </a>
          </div>

          <div class="container-login100-form-btn">
            <div class="wrap-login100-form-btn">
              <div class="login100-form-bgbtn"></div>
              <button class="login100-form-btn">Login</button>
            </div>
          </div>

          <div class="txt1 text-center p-t-54 p-b-20">
            <span> Or Sign Up Using </span>
          </div>

          <div class="flex-c-m">
            <a href="#" class="login100-social-item bg1">
              <i class="fa fa-facebook"></i>
            </a>

            <a href="#" class="login100-social-item bg2">
              <i class="fa fa-twitter"></i>
            </a>

            <a href="#" class="login100-social-item bg3">
              <i class="fa fa-google"></i>
            </a>
          </div>

          <div class="flex-col-c p-t-155">
            <span class="txt1 p-b-17"> Or Sign Up Using </span>

            <a href="#" class="txt2"> Sign Up </a>
          </div>
        </form>
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