<template></template>
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

navigateTo('/booking/list');
</script>
