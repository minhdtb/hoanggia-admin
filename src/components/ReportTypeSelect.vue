<template>
  <v-select item-title="name" item-value="value" :items="items" v-bind="$attrs"></v-select>
</template>
<script setup lang="ts">
const items = [
  {
    name: 'Báo cáo tài chính',
    value: 0,
  },
  {
    name: 'Báo cáo lái xe',
    value: 1,
  },
  {
    name: 'Báo cáo khách hàng',
    value: 2,
  },
];
</script>
