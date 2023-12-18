<template>
  <v-select item-title="name" item-value="value" :items="items" v-bind="$attrs"></v-select>
</template>
<script setup lang="ts">
const items = [
  {
    name: 'Hoạt động',
    value: 'Active',
  },
  {
    name: 'Tạm ngừng',
    value: 'Inactive',
  },
];
</script>
