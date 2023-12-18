<template>
  <v-select item-title="name" item-value="value" :items="items" v-bind="$attrs"></v-select>
</template>
<script setup lang="ts">
const items = [
  {
    name: 'Tất cả',
    value: 'All',
  },
  {
    name: 'Người dùng',
    value: 'User',
  },
];
</script>
