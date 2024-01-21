<template></template>
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const authStore = useAuthStore();

const {authUser} = storeToRefs(authStore);

if (authUser.value?.role === 'Accountant') {
  navigateTo('/discount/list');
} else {
  navigateTo('/booking/list');
}

</script>
