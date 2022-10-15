
<script setup>
import { ref } from "@vue/reactivity";
import { onUpdated } from "@vue/runtime-core";
import axios from "axios";
import { useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const router = useRouter();
let submit = ref(true);
let username = ref("");
let fullname = ref("");
let phone = ref("");
let email = ref("");
let password = ref("");
let usernameinp = ref(null);
let fullnameinp = ref(null);
let phoneinp = ref(null);
let emailinp = ref(null);
let passwordinp = ref(null);
let errorWarn = ref("");

let checkNoInput = () => {
  usernameinp.value.style["border-bottom"] = "2px solid #d9d9d9";
  fullnameinp.value.style["border-bottom"] = "2px solid #d9d9d9";
  phoneinp.value.style["border-bottom"] = "2px solid #d9d9d9";
  emailinp.value.style["border-bottom"] = "2px solid #d9d9d9";
  passwordinp.value.style["border-bottom"] = "2px solid #d9d9d9";
  if (!username.value) {
    usernameinp.value.style["border-bottom"] = "2px solid red";
    submit.value = true;
    return true;
  }
  if (!fullname.value) {
    fullnameinp.value.style["border-bottom"] = "2px solid red";
    submit.value = true;
    return true;
  }
  if (!phone.value) {
    phoneinp.value.style["border-bottom"] = "2px solid red";
    submit.value = true;
    return true;
  }
  if (!email.value) {
    emailinp.value.style["border-bottom"] = "2px solid red";
    submit.value = true;
    return true;
  }
  if (password.value.length <= 8) {
    passwordinp.value.style["border-bottom"] = "2px solid red";
    errorWarn.value = "Password's length must be more than 8";
    submit.value = true;
    return true;
  }

  return false;
};

let register = async () => {
  if (checkNoInput()) {
    return;
  }
  submit.value = false;
  let address = {
    city: "null",
    district: "null",
    commune_ward: "null",
    street: "null",
  };
  let shipping_address = (
    await axios.post("https://ecommerce-r6l7.onrender.com/address", address)
  ).data;
  let credential = {
    username: username.value,
    password: password.value,
    fullname: fullname.value,
    phone: phone.value,
    email: email.value,
    shipping_address:shipping_address.addr_id
  };
  try {
    let res = (
      await axios.post(
        "https://ecommerce-r6l7.onrender.com/user/register",
        credential
      )
    ).data;
    cookies.set("token", res.token);
    submit.value = true;
    router.push({ name: "home" }).then(() => router.go());
  } catch (error) {
    if (error.response.data.includes("user_un1")) {
      errorWarn.value = "Email already inused";
      submit.value = true;
      return;
    }
    errorWarn.value = "Username already exists";
    submit.value = true;
  }
};

let swapComp = () => {
  router.push({ name: "login" });
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
        <span class="login100-form-title p-b-49"> Register </span>
        <p style="color: red" v-if="errorWarn">{{ errorWarn }}</p>
        <div
          class="wrap-input100 validate-input m-b-23"
          ref="usernameinp"
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
          ref="fullnameinp"
          class="wrap-input100 validate-input m-b-23"
          data-validate="Username is reauired"
        >
          <span class="label-input100">Fullname</span>
          <input
            class="input100"
            type="text"
            name="fullname"
            placeholder="Type your fullname"
            v-model="fullname"
          />
          <span class="focus-input100" data-symbol="&#xf206;"></span>
        </div>
        <div
          ref="phoneinp"
          class="wrap-input100 validate-input m-b-23"
          data-validate="Username is reauired"
        >
          <span id="phone" class="label-input100">Phone</span>
          <input
            style="-moz-appearance: textfield"
            class="input100"
            type="number"
            name="phone"
            placeholder="Type your phone"
            v-model="phone"
          />
          <span class="focus-input100" data-symbol="&#x260F;"></span>
        </div>
        <div
          ref="emailinp"
          class="wrap-input100 validate-input m-b-23"
          data-validate="Username is reauired"
        >
          <span  class="label-input100">Email</span>
          <input
            class="input100"
            type="email"
            name="email"
            placeholder="Type your email"
            v-model="email"
          />
          <span class="focus-input100" data-symbol="&#x2709;"></span>
        </div>
        <div
          ref="passwordinp"
          class="wrap-input100 validate-input"
          data-validate="Password is required"
        >
          <span class="label-input100">Password</span>
          <input
            class="input100"
            type="password"
            name="pass"
            placeholder="Type your password"
            v-model="password"
          />
          <span class="focus-input100" data-symbol="&#xf190;"></span>
        </div>

        <div class="text-right p-t-8 p-b-31"></div>

        <div class="container-login100-form-btn">
          <div class="wrap-login100-form-btn">
            <div class="login100-form-bgbtn"></div>
            <button v-if="submit" @click="register" class="login100-form-btn">
              Sign up
            </button>
          </div>
        </div>

        <div class="flex-col-c p-t-155">
          <span class="txt1 p-b-17"> Already have an account? </span>

          <a href="#" @click="swapComp" class="txt2"> Sign In </a>
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>