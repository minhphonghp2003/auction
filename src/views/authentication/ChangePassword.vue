
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import emailjs from "emailjs-com";
import axios from "axios";

const router = useRouter();
let email = ref("");
let submit = ref(true);
let isEmail = ref(true);
let swapComp = () => {
  router.push({ name: "login" });
};

let checkNoInput = () => {
  if (!email.value) {
    isEmail.value = false;
    return true;
  }
};

let send = async () => {
  if (checkNoInput()) {
    return;
  }
  let e_id = (await axios.post(
    "https://ecommerce-r6l7.onrender.com/user/email",
    { email: email.value }
  )).data;
  let message =
    `We are from Bidthu? and we received a password-reset request from your email. Please follow this link to reset your password\nhttps://bidthuu.firebaseapp.com/resetpassword/${e_id}`;
  let emailTemplate = {
    from_name: "Minh",
    to_name: "User",
    message: message,
    to_email: email.value,
    reply_to: "minhphonghp2003@gmail.com",
  };
  emailjs.send(
    "service_ftiggz8",
    "template_f0g3465",
    emailTemplate,
    "uFlpriBhFEE_5Ct8N"
  );
  submit.value = false;
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
        <span class="login100-form-title p-b-49">
          Send password reset to my email
        </span>
        <div class="wrap-input100 validate-input m-b-23">
          <span class="label-input100">Email</span>
          <input
            class="input100"
            type="email"
            name="email"
            placeholder="Type your email"
            v-model="email"
          />
          <span class="focus-input100" data-symbol="&#x2709;"></span>
        </div>

        <p v-if="!isEmail" style="color: red">Email is require</p>

        <div class="container-login100-form-btn">
          <div class="wrap-login100-form-btn">
            <div class="login100-form-bgbtn"></div>
            <button v-if="submit" class="login100-form-btn" @click="send">
              Send
            </button>
          </div>
          <h2 v-if="!submit">Email sent </h2>
        </div>

        <div class="flex-col-c p-t-155">
          <a href="#" @click="swapComp" class="txt2"> Sign in </a>
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