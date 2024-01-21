<template>
  <v-select item-title="name" item-value="value" :items="items" v-bind="$attrs"></v-select>
</template>
<script setup lang="ts">
const items = [
  {
    name: 'Đang hoạt động',
    value: 'Active',
  },
  {
    name: 'Không hoạt động',
    value: 'Inactive',
  }
];
</script>
