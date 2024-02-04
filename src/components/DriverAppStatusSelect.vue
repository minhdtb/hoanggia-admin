<template>
  <v-select item-title="name" item-value="value" :items="items" v-bind="$attrs" clearable></v-select>
</template>
<script setup lang="ts">
const items = [
  {
    name: 'Sẵn sàng',
    value: 'Available',
  },
  {
    name: 'Tạm ngừng',
    value: 'Unavailable',
  }
];
</script>
