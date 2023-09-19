<template>
  <booking :id="route.params.id as string" @on-close="$router.go(-1)"></booking>
</template>
<script setup lang="ts">
useHead({
  title: `Hoang Gia Driver - Cuốc xe`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const route = useRoute();
</script>
