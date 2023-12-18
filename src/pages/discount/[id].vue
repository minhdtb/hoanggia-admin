<template>
  <discount :id="route.params.id as string" @on-close="$router.go(-1)" />
</template>
<script setup lang="ts">
useHead({
  title: `Hoang Gia Driver - Khuyến mại`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const route = useRoute();
</script>
