<template>
  <v-select item-title="name" item-value="value" :items="items" v-bind="$attrs"></v-select>
</template>
<script setup lang="ts">
const items = [
  {
    name: 'Đăng ký',
    value: 'Pending',
  },
  {
    name: 'Đang chờ duyệt',
    value: 'WaitingApproval',
  },
  {
    name: 'Đã duyệt',
    value: 'Approved',
  },
  {
    name: 'Từ chối',
    value: 'Rejected',
  },
  {
    name: 'Đã bị khóa',
    value: 'Blocked',
  },
];
</script>
