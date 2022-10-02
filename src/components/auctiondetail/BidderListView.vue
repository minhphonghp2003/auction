<script setup>
defineProps(['bidders'])
</script>
<template>
<p v-for="b of bidders" :key="b">
{{b.fullname}} : {{b.price}}
</p>
</template>
<style scoped></style>