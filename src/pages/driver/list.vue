<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="driverList"
    :loading="loading"
    :items-length="total"
    hover
    @update:options="handleLoadItems"
    @click:row="handleClickRow"
  >
    <template #item.index="{ index }">
      {{ index + 1 }}
    </template>
    <template #item.avatar="{ item }">
      <v-avatar>
        <v-img :src="item.raw.avatar"></v-img>
      </v-avatar>
    </template>
  </v-data-table-server>
</template>
<script setup lang="ts">
import { useDriverStore } from '~/stores/driver';

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const driverStore = useDriverStore();
const { driverList, loading, total } = storeToRefs(driverStore);

const headers = [
  { title: '#', key: 'index' },
  { title: 'Ảnh', key: 'avatar' },
  { title: 'Họ tên', key: 'name' },
  { title: 'Số điện thoại', key: 'phone' },
  { title: 'Email', key: 'driver_email' },
  { title: 'Trạng thái', key: 'authStatus' },
  { title: 'Sẵn sàng', key: 'driveStatus' },
  { title: 'Hoạt động', key: 'activeStatus' },
];

const itemsPerPage = ref(10);

const handleLoadItems = async (options: any) => {
  await driverStore.list({
    limit: options.itemsPerPage,
    page: options.page,
  });
};

const handleClickRow = (_: Event, { item }: any) => {
  navigateTo(`customer/${item.raw.id}`);
};
</script>
