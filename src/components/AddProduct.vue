
<script setup>
import axios from "axios";
import { useCookies } from "vue3-cookies";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
let inside = ref(false);
let uploading = ref(false);
const emit = defineEmits(["toggleAddP"]);
let router = useRouter();
let { cookies } = useCookies();
let token = ref(cookies.get("token"));
let images = ref([]);
let error = ref("");
let categories = ref([]);
let product_fields = [
  "sku",
  "name",
  "price",
  "category",
  "description",
  "date_end",
  "condition",
  "min_increase",
  "max_increase",
];
let product = ref({});

product_fields.forEach((f) => {
  product.value[f] = "";
});

let toggleView = () => {
  if (!inside.value) {
    emit("toggleAddP");
  }
  inside.value = false;
};

onMounted(async () => {
  categories.value = (
    await axios.get("https://ecommerce-r6l7.onrender.com/product/category")
  ).data;
});

let checkInput = () => {
  if (
    Object.values(product.value).includes("") ||
    images.value.files.length == 0
  ) {
    error.value = "Please fill in all sections and at least 1 product image";
    return true;
  }
  error.value = "";
  return false;
};

let add = async () => {
  if (checkInput()) {
    return;
  }
  let formData = new FormData();

  for (let key in product.value) {
    formData.append(key, product.value[key]);
  }

  for (let i = 0; i < images.value.files.length; i++) {
    formData.append("product_images", images.value.files[i]);
  }

  try {
    uploading.value = true;
    let p_id = (
      await axios.post(
        "https://ecommerce-r6l7.onrender.com/product/", 
        formData,
        {
          headers: {
            token: token.value,
          },
        }
      )
    ).data.pid;
    router.push({ name: "auctiondetail", params: { pid: p_id } });
  } catch (err) {
    uploading.value = false;
    error.value = "Sorry! Something went wrong";
  }
};
</script>
<template>
  <div
    style="margin-top: 160px; max-width: 100%"
    @click="toggleView"
    class="container tm-mt-big tm-mb-big "
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
              <p v-if="error" style="color: yellow">{{ error }}</p>
              <div class="form-group mb-3">
                <label for="name">SKU </label>
                <input
                  type="text"
                  v-model="product.sku"
                  class="form-control validate"
                  required
                />
                <label for="name">Product Name </label>
                <input
                  type="text"
                  v-model="product.name"
                  class="form-control validate"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="description"
                  >Description
                  <span style="color: yellow"
                    >(Be careful, you will not be able to update your product
                    when submitted)</span
                  ></label
                >
                <textarea
                  v-model="product.description"
                  class="form-control validate"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div class="form-group mb-3">
                <label for="category">Category</label>
                <select
                  v-model="product.category"
                  class="custom-select tm-select-accounts"
                  id="category"
                >
                  <option v-for="c of categories" :key="c" :value="c.id">
                    {{ c.cate }}
                  </option>
                </select>
              </div>
              <div class="row">
                <div class="form-group mb-3 col-xs-12 col-sm-6">
                  <label for="expire_date">End date </label>
                  <input
                    v-model="product.date_end"
                    type="date"
                    class="form-control validate"
                    data-large-mode="true"
                  />
                </div>
                <div class="form-group mb-3 col-xs-12 col-sm-6">
                  <label for="stock">Price </label>
                  <input
                    v-model="product.price"
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
              <div
                style="cursor: pointer"
                onclick="document.getElementById('fileInput').click();"
                class="tm-product-img-dummy mx-auto"
              >
                <i class="fas fa-cloud-upload-alt tm-upload-icon"></i>
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
                    v-model="product.condition"
                    type="text"
                    class="form-control validate"
                    required
                  />
                  <label for="stock">Min increase </label>
                  <input
                    v-model="product.min_increase"
                    type="number"
                    min="0"
                    step="any"
                    class="form-control validate"
                    required
                  />
                  <label for="stock">Max increase </label>
                  <input
                    v-model="product.max_increase"
                    type="number"
                    min="0"
                    step="any"
                    class="form-control validate"
                    required
                  />
                </div>
              </div>
            </div>

            <div v-if="!uploading" class="col-12">
              <button
                @click="add"
                type="submit"
                class="btn btn-primary btn-block text-uppercase"
              >
                Add Product Now
              </button>
            </div>
            <div v-if="uploading" class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
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