<script setup>

import { ref } from "vue";
import { useRoute} from "vue-router";
let route = useRoute()
let id = ref(route.params)
</script>

<template>
{{id}}

</template>

<style scoped>

</style>