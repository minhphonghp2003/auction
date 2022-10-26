
<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute()
let error = ref("");
let submit = ref(true);
let password = ref("");
let confirmpassword = ref("");

let checkNoInput = () => {
  if (
    password.value < 8 ||
    confirmpassword.value < 8 ||
    password.value !== confirmpassword.value
  ) {
    error.value = "Please check your password and confirm your password again";
    return true;
  }
  return false;
};

let reset = async () => {
  if (checkNoInput()) {
    return;
  }
  try {
    submit.value = false
    let email =(await axios.get("https://ecommerce-r6l7.onrender.com/user/email",{ params: { id:route.params.e_id } })).data.email
    await axios.put("https://ecommerce-r6l7.onrender.com/user/newpassword",{
      email:email,
      password:password.value
    })
    await axios.delete("https://ecommerce-r6l7.onrender.com/user/email",{ params: { id:route.params.e_id } })
    router.push({name:'login'})
  } catch (err) {
    submit.value = true
   error.value = "Sorry, we can't handle this right now! Please try another time"
  }
};
</script>

<template>
  <div class="limiter">
    <div
      class="container-login100"
      style="background-image: url('/src/assets/auth/images/bg-01.jpg')"
    >
      <div
        class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54"
        style="margin: 150px"
      >
        <span class="login100-form-title p-b-49"> Reset password </span>
        <div class="wrap-input100 validate-input m-b-23">
          <span class="label-input100">New password</span>
          <input
            class="input100"
            type="password"
            name="password"
            placeholder="Type your new password"
            v-model="password"
          />
          <span class="focus-input100" data-symbol="&#xf190;"></span>
        </div>
        <div class="wrap-input100 validate-input m-b-23">
          <span class="label-input100">Confirm new password</span>
          <input
            class="input100"
            type="password"
            name="password"
            placeholder="Confirm your password"
            v-model="confirmpassword"
          />
          <span class="focus-input100" data-symbol="&#xf190;"></span>
        </div>

        <p v-if="error" style="color: red">{{ error }}</p>

        <div class="container-login100-form-btn">
          <div class="wrap-login100-form-btn">
            <div class="login100-form-bgbtn"></div>
            <button v-if="submit" class="login100-form-btn" @click="reset">
              Reset
            </button>
          </div>
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