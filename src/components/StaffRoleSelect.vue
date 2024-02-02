<template>
  <v-select item-title="name" item-value="value" :items="items" v-bind="$attrs"></v-select>
</template>
<script setup lang="ts">
const items = [
  {
    name: 'Vận hành',
    value: 'Operator',
  },
  {
    name: 'Tài chính',
    value: 'Accountant',
  }
];
</script>
