<template>
  <v-select item-title="name" item-value="value" :items="items" v-bind="$attrs"></v-select>
</template>
<script setup lang="ts">
const items = [
  {
    name: '%',
    value: 'Percent',
  },
  {
    name: 'VNĐ',
    value: 'Amount',
  },
];
</script>
