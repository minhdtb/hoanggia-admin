<template>
  <v-select item-title="name" item-value="value" :items="items.filter(it => {
    return isAdmin || (isOperator && it.value === 1) || (isAccountant && it.value === 0)
  })" v-bind="$attrs"></v-select>
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

const authStore = useAuthStore();

const {isAdmin, isOperator, isAccountant} = storeToRefs(authStore);
</script>
