
<script setup>
import axios from "axios";
import { useCookies } from "vue3-cookies";
import { onMounted, ref } from "vue";
let inside = ref(false);
const emit = defineEmits(["toggleAddP"]);
let { cookies } = useCookies();
let token = ref(cookies.get("token"));
let sku = ref("");
let name = ref("");
let price = ref("");
let category = ref("");
let description = ref("");
let date_end = ref("");
let condition = ref("");
let min_increase = ref("");
let max_increase = ref("");
let images = ref([]);

let toggleView = () => {
  if (!inside.value) {
    emit("toggleAddP");
  }
  inside.value = false;
};

let add = () => {
  let imgs = images.value.files
  for (let index in imgs) {
    images.value[index]= URL.createObjectURL(imgs[index])
  }
  console.log(images.value);
};
</script>
<template>
  <div
    style="margin-top: 160px; max-width: 100%"
    @click="toggleView"
    class="container tm-mt-big tm-mb-big backdrop"
  >
    <div class="row">
      <div class="col-xl-9 col-lg-10 col-md-12 col-sm-12 mx-auto">
        <div
          @click="inside = true"
          class="tm-bg-primary-dark tm-block tm-block-h-auto"
          id="inside"
        >
          <div class="row tm-edit-product-row">
            <div class="col-xl-6 col-lg-6 col-md-12">
              <div class="form-group mb-3">
                <label for="name">Sku </label>
                <input
                  type="text"
                  v-model="sku"
                  class="form-control validate"
                  required
                />
                <label for="name">Product Name </label>
                <input
                  type="text"
                  v-model="name"
                  class="form-control validate"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="description"
                  >Description
                  <span style="color: red"
                    >(Be careful, you will not be able to update your product
                    when submitted)</span
                  ></label
                >
                <textarea
                  v-model="description"
                  class="form-control validate"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div class="form-group mb-3">
                <label for="category">Category</label>
                <select
                  v-model="category"
                  class="custom-select tm-select-accounts"
                  id="category"
                >
                  <option selected>Select category</option>
                  <option value="1">New Arrival</option>
                  <option value="2">Most Popular</option>
                  <option value="3">Trending</option>
                </select>
              </div>
              <div class="row">
                <div class="form-group mb-3 col-xs-12 col-sm-6">
                  <label for="expire_date">End date </label>
                  <input
                    v-model="date_end"
                    type="date"
                    class="form-control validate"
                    data-large-mode="true"
                  />
                </div>
                <div class="form-group mb-3 col-xs-12 col-sm-6">
                  <label for="stock">Price </label>
                  <input
                    v-model="price"
                    type="number"
                    min="0"
                    step="any"
                    class="form-control validate"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 col-md-12 mx-auto mb-4">
              <div class="tm-product-img-dummy mx-auto">
                <i
                  class="fas fa-cloud-upload-alt tm-upload-icon"
                  onclick="document.getElementById('fileInput').click();"
                ></i>
              </div>
              <div class="custom-file mt-3 mb-3">
                <input
                  ref="images"
                  id="fileInput"
                  type="file"
                  style="display: none"
                  multiple
                />

                <div class="form-group mb-3 col-xs-12 col-sm-6">
                  <label for="stock">Condition </label>
                  <input
                    v-model="condition"
                    type="text"
                    class="form-control validate"
                    required
                  />
                  <label for="stock">Min increase </label>
                  <input
                    v-model="min_increase"
                    type="number"
                    min="0"
                    step="any"
                    class="form-control validate"
                    required
                  />
                  <label for="stock">Max increase </label>
                  <input
                    v-model="max_increase"
                    type="number"
                    min="0"
                    step="any"
                    class="form-control validate"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="col-12">
              <button
                @click="add"
                type="submit"
                class="btn btn-primary btn-block text-uppercase"
              >
                Add Product Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/css/bootstrap.min.css";
@import "../assets/css/fontawesome.min.css";
@import "../assets/css/addproduct.css";
.backdrop {
  top: 0;
  position: fixed;
  /* background: rgba(0, 0, 0, 0.5); */
  width: 100%;
  height: 100%;
}
</style>>