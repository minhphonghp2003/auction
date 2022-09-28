
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

</script>

<template>
  <div v-if="loginComp" class="limiter">
    <div
      class="container-login100"
      style="background-image: url('/src/assets/auth/images/bg-01.jpg')"
    >
      <div
        class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54"
        style="margin: 150px"
      >
        <span v-if="comp == login" class="login100-form-title p-b-49">
          Login
        </span>
        <span v-if="comp == register" class="login100-form-title p-b-49">
          Register
        </span>
        <slot></slot>
        
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