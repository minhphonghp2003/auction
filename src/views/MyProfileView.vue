
<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useCookies } from "vue3-cookies";
import { ContentLoader } from "vue-content-loader";
import { useRouter } from "vue-router";
import ProductView from "../components/ProductView.vue";
import { Buffer } from "buffer";

let router = useRouter();
let onUpdateAvatar = ref({});
let updateData = ref({});
let editMode = ref(false);
let originAvatar;
let active = ref("profile");
let { cookies } = useCookies();
let userData = ref({});
let done = ref(false);
let token = ref(cookies.get("token"));
let error = ref(false)

onMounted(async () => {
  userData.value = (
    await axios.get("https://ecommerce-r6l7.onrender.com/user/mydata", {
      headers: {
        token: token.value,
      },
    })
  ).data;

  updateData.value.user = JSON.parse(JSON.stringify(userData.value.user));
  originAvatar = userData.value.user.avatar;
  console.log(originAvatar);
  userData.value.user.avatar = Buffer.from(userData.value.user.avatar).toString(
    "base64"
  );
  updateData.value.user.avatar = Buffer.from(
    userData.value.user.avatar
  ).toString("base64");
  userData.value.product.forEach((element) => {
    element.image = Buffer.from(element.image).toString("base64");
    element.date_end = element.date_end.split("T")[0];
  });
  userData.value.shipping = (
    await axios.get("https://ecommerce-r6l7.onrender.com/address", {
      params: {
        id: userData.value.user.default_shipping_address,
      },
      headers: {
        token: cookies.get("token"),
      },
    })
  ).data;

  updateData.value.shipping = JSON.parse(
    JSON.stringify(userData.value.shipping)
  );
  done.value = true;
});

let logout = () => {
  cookies.remove("token");
  router.push({ name: "home" }).then(() => {
    router.go();
  });
};

let toggleActive = (element) => {
  active.value = element;
  editMode.value = false;
  if (element == "edit") {
    updateData.value.user.avatar = originAvatar
    editMode.value = true;
  }
};

// password
let update = async () => {
  try {
    done.value = false;
    let form_data = new FormData();
    let data = {
      fullname: updateData.value.user.fullname,
      phone: updateData.value.user.phone,
      email: updateData.value.user.email,
      country: updateData.value.user.country,
      default_shipping_address: updateData.value.user.default_shipping_address,
      role: updateData.value.user.role,
      user_images: updateData.value.user.avatar,
    };
    for (var key in data) {
      form_data.append(key, data[key]);
    }
    await axios.put(
      "https://ecommerce-r6l7.onrender.com/user/update",
      form_data,
      {
        headers: {
          token: cookies.get("token"),
        },
      }
    );

    await axios.put(
      "https://ecommerce-r6l7.onrender.com/address",
      {
        city: updateData.value.shipping.city,
        district: updateData.value.shipping.district,
        commune_ward: updateData.value.shipping.commune_ward,
        street: updateData.value.shipping.street,
        id: userData.value.user.default_shipping_address,
      },
      {
        headers: {
          token: cookies.get("token"),
        },
      }
    );

    router.push({ name: "profile" }).then(() => {
      router.go();
    });
  } catch (error) {
    done.value = true;
    console.log(error);
  error.value = true
  }
};
//
let uploadImage = (event) => {
  updateData.value.user.avatar = event.target.files[0];
  onUpdateAvatar.value = URL.createObjectURL(event.target.files[0]); 
};
</script>

<template>
  <link
    href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
    rel="stylesheet"
  />
  <content-loader
    style="margin-top: 180px"
    v-if="!done"
    viewBox="0 0 476 124"
    :speed="2"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
    <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
    <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
    <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
    <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
    <circle cx="20" cy="20" r="20" />
  </content-loader>
  <div v-if="done" class="container bootstrap snippets bootdey">
    <div class="row">
      <div class="profile-nav col-md-3">
        <div class="panel">
          <div class="user-heading round">
            <a href="#">
              <img
                v-if="!editMode"
                v-bind:src="'data:image/jpeg;base64,' + userData.user.avatar"
              />
              <img
                v-if="editMode"
                :src=" onUpdateAvatar"
              />
            </a>
            <input
              v-if="editMode"
              type="file"
              accept="image/*"
              @change="uploadImage($event)"
            />
            <h1>{{ userData.user.fullname }}</h1>
            <p>{{ userData.user.email }}</p>
          </div>

          <ul class="nav nav-pills nav-stacked">
            <li :class="{ active: active == 'profile' }">
              <a @click="toggleActive('profile')" href="#">
                <i class="fa fa-user"></i> <span>Profile</span>
              </a>
            </li>
            <li :class="{ active: active == 'edit' }">
              <a @click="toggleActive('edit')" href="#">
                <i class="fa fa-edit"></i> <span>Edit profile</span>
              </a>
            </li>
            <li>
              <a href="#" @click="logout">
                <i class="fa fa-user"></i> <span>Log out</span>
              </a>
            </li>
            <li
              :class="{ active: active == 'addproduct' }"
              v-if="userData.user.role == 'seller'"
            >
              <a @click="toggleActive('addproduct')" href="#">
                <i class="fa fa-edit"></i> <span>Add product</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="profile-info col-md-9">
        <div class="panel"></div>
        <div class="panel">
          <div class="panel-body bio-graph-info">
            <h1 v-if="!editMode">Bio Graph</h1>
            <h1 v-if="editMode">
              <p v-if="error" style="color : red">Something went wrong</p>
              <a @click="update" href="#">
                <i class="fa fa-edit"></i> <span>Update</span>
              </a>
            </h1>

            <div class="row">
              <div class="bio-row">
                <p>
                  <span>Full Name </span>:
                  <span v-if="!editMode"> {{ userData.user.fullname }}</span>
                  <span v-if="editMode">
                    <input v-model="updateData.user.fullname" type="text" />
                  </span>
                </p>
              </div>

              <div class="bio-row">
                <p>
                  <span>Country </span>:
                  <span v-if="!editMode"> {{ userData.user.country }}</span>
                  <span v-if="editMode">
                    <input v-model="updateData.user.country" type="text" />
                  </span>
                </p>
              </div>
              <div class="bio-row">
                <p>
                  <span>Username</span>:
                  <span> {{ userData.user.username }}</span>
                </p>
              </div>
              <div class="bio-row">
                <p>
                  <span>Role </span>: <span> {{ userData.user.role }}</span>
                </p>
              </div>
              <div class="bio-row">
                <p>
                  <span>Email </span>:
                  <span v-if="!editMode"> {{ userData.user.email }}</span>
                  <span v-if="editMode">
                    <input v-model="updateData.user.email" type="text" />
                  </span>
                </p>
              </div>

              <div class="bio-row">
                <p>
                  <span>Phone </span>:
                  <span v-if="!editMode"> {{ userData.user.phone }}</span>
                  <span v-if="editMode">
                    <input v-model="updateData.user.email" type="text" />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="row">
            <div class="col-md-6">
              <div class="panel">
                <div class="panel-body">
                  <div class="bio-chart">
                    <div style="display: inline; width: 100px; height: 100px">
                      <canvas width="100" height="100px"></canvas>
                    </div>
                  </div>
                  <div class="bio-desk">
                    <h4 class="red">Shipping address</h4>
                    <p>
                      City :
                      <span v-if="!editMode">
                        {{ userData.shipping.city }}</span
                      >
                      <span v-if="editMode">
                        <input type="text" v-model="updateData.shipping.city" />
                      </span>
                    </p>

                    <p>
                      District :
                      <span v-if="!editMode">
                        {{ userData.shipping.district }}</span
                      >
                      <span v-if="editMode">
                        <input
                          type="text"
                          v-model="updateData.shipping.district"
                        />
                      </span>
                    </p>
                    <p>
                      Commune/Ward :
                      <span v-if="!editMode">
                        {{ userData.shipping.commune_ward }}</span
                      >
                      <span v-if="editMode">
                        <input
                          type="text"
                          v-model="updateData.shipping.commune_ward"
                        />
                      </span>
                    </p>
                    <p>
                      Street :
                      <span v-if="!editMode">
                        {{ userData.shipping.street }}</span
                      >
                      <span v-if="editMode">
                        <input
                          type="text"
                          v-model="updateData.shipping.street"
                        />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ProductView :product="userData.product"></ProductView>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import "../assets/css/bootstrap.min.css";
body {
  color: #797979;
  background: #f1f2f7;
  font-family: "Open Sans", sans-serif;
  padding: 0px !important;
  margin: 0px !important;
  font-size: 13px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
}

.profile-nav,
.profile-info {
  margin-top: 180px;
}

.profile-nav .user-heading {
  background: #fbc02d;
  color: #fff;
  border-radius: 4px 4px 0 0;
  -webkit-border-radius: 4px 4px 0 0;
  padding: 30px;
  text-align: center;
}

.profile-nav .user-heading.round a {
  border-radius: 50%;
  -webkit-border-radius: 50%;
  border: 10px solid rgba(255, 255, 255, 0.3);
  display: inline-block;
}

.profile-nav .user-heading a img {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  -webkit-border-radius: 50%;
}

.profile-nav .user-heading h1 {
  font-size: 22px;
  font-weight: 300;
  margin-bottom: 5px;
}

.profile-nav .user-heading p {
  font-size: 12px;
}

.profile-nav ul {
  margin-top: 1px;
}

.profile-nav ul > li {
  border-bottom: 1px solid #ebeae6;
  margin-top: 0;
  line-height: 30px;
}

.profile-nav ul > li:last-child {
  border-bottom: none;
}

.profile-nav ul > li > a {
  border-radius: 0;
  -webkit-border-radius: 0;
  color: #89817f;
  border-left: 5px solid #fff;
}

.profile-nav ul > li > a:hover,
.profile-nav ul > li > a:focus,
.profile-nav ul li.active a {
  background: #f8f7f5 !important;
  border-left: 5px solid #fbc02d;
  color: #89817f !important;
}

.profile-nav ul > li:last-child > a:last-child {
  border-radius: 0 0 4px 4px;
  -webkit-border-radius: 0 0 4px 4px;
}

.profile-nav ul > li > a > i {
  font-size: 16px;
  padding-right: 10px;
  color: #bcb3aa;
}

.r-activity {
  margin: 6px 0 0;
  font-size: 12px;
}

.p-text-area,
.p-text-area:focus {
  border: none;
  font-weight: 300;
  box-shadow: none;
  color: #c3c3c3;
  font-size: 16px;
}

.profile-info .panel-footer {
  background-color: #f8f7f5;
  border-top: 1px solid #e7ebee;
}

.profile-info .panel-footer ul li a {
  color: #7a7a7a;
}

.bio-graph-heading {
  background: #fbc02d;
  color: #fff;
  text-align: center;
  font-style: italic;
  padding: 40px 110px;
  border-radius: 4px 4px 0 0;
  -webkit-border-radius: 4px 4px 0 0;
  font-size: 16px;
  font-weight: 300;
}

.bio-graph-info {
  color: #89817e;
}

.bio-graph-info h1 {
  font-size: 22px;
  font-weight: 300;
  margin: 0 0 20px;
}

.bio-row {
  width: 50%;
  float: left;
  margin-bottom: 10px;
  padding: 0 15px;
}

.bio-row p span {
  width: 100px;
  display: inline-block;
}

.bio-chart,
.bio-desk {
  float: left;
}

.bio-chart {
  width: 40%;
}

.bio-desk {
  width: 60%;
}

.bio-desk h4 {
  font-size: 15px;
  font-weight: 400;
}

.bio-desk h4.terques {
  color: #4cc5cd;
}

.bio-desk h4.red {
  color: #e26b7f;
}

.bio-desk h4.green {
  color: #97be4b;
}

.bio-desk h4.purple {
  color: #caa3da;
}

.file-pos {
  margin: 6px 0 10px 0;
}

.profile-activity h5 {
  font-weight: 300;
  margin-top: 0;
  color: #c3c3c3;
}

.summary-head {
  background: #ee7272;
  color: #fff;
  text-align: center;
  border-bottom: 1px solid #ee7272;
}

.summary-head h4 {
  font-weight: 300;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.summary-head p {
  color: rgba(255, 255, 255, 0.6);
}

ul.summary-list {
  display: inline-block;
  padding-left: 0;
  width: 100%;
  margin-bottom: 0;
}

ul.summary-list > li {
  display: inline-block;
  width: 19.5%;
  text-align: center;
}

ul.summary-list > li > a > i {
  display: block;
  font-size: 18px;
  padding-bottom: 5px;
}

ul.summary-list > li > a {
  padding: 10px 0;
  display: inline-block;
  color: #818181;
}

ul.summary-list > li {
  border-right: 1px solid #eaeaea;
}

ul.summary-list > li:last-child {
  border-right: none;
}

.activity {
  width: 100%;
  float: left;
  margin-bottom: 10px;
}

.activity.alt {
  width: 100%;
  float: right;
  margin-bottom: 10px;
}

.activity span {
  float: left;
}

.activity.alt span {
  float: right;
}
.activity span,
.activity.alt span {
  width: 45px;
  height: 45px;
  line-height: 45px;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  background: #eee;
  text-align: center;
  color: #fff;
  font-size: 16px;
}

.activity.terques span {
  background: #8dd7d6;
}

.activity.terques h4 {
  color: #8dd7d6;
}
.activity.purple span {
  background: #b984dc;
}

.activity.purple h4 {
  color: #b984dc;
}
.activity.blue span {
  background: #90b4e6;
}

.activity.blue h4 {
  color: #90b4e6;
}
.activity.green span {
  background: #aec785;
}

.activity.green h4 {
  color: #aec785;
}

.activity h4 {
  margin-top: 0;
  font-size: 16px;
}

.activity p {
  margin-bottom: 0;
  font-size: 13px;
}

.activity .activity-desk i,
.activity.alt .activity-desk i {
  float: left;
  font-size: 18px;
  margin-right: 10px;
  color: #bebebe;
}

.activity .activity-desk {
  margin-left: 70px;
  position: relative;
}

.activity.alt .activity-desk {
  margin-right: 70px;
  position: relative;
}

.activity.alt .activity-desk .panel {
  float: right;
  position: relative;
}

.activity-desk .panel {
  background: #f4f4f4;
  display: inline-block;
}

.activity .activity-desk .arrow {
  border-right: 8px solid #f4f4f4 !important;
}
.activity .activity-desk .arrow {
  border-bottom: 8px solid transparent;
  border-top: 8px solid transparent;
  display: block;
  height: 0;
  left: -7px;
  position: absolute;
  top: 13px;
  width: 0;
}

.activity-desk .arrow-alt {
  border-left: 8px solid #f4f4f4 !important;
}

.activity-desk .arrow-alt {
  border-bottom: 8px solid transparent;
  border-top: 8px solid transparent;
  display: block;
  height: 0;
  right: -7px;
  position: absolute;
  top: 13px;
  width: 0;
}

.activity-desk .album {
  display: inline-block;
  margin-top: 10px;
}

.activity-desk .album a {
  margin-right: 10px;
}

.activity-desk .album a:last-child {
  margin-right: 0px;
}
</style>