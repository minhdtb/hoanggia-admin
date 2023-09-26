<template>
  <v-data-table-server
    v-model:page="pagination.page"
    v-model:items-per-page="pagination.itemsPerPage"
    :headers="headers"
    :items="driverList"
    :loading="loading"
    :items-length="total"
    hover
    @update:options="handleLoadItems"
    @click:row="handleClickRow"
  >
    <template #item.index="{ index }">
      {{ index + (pagination.page - 1) * pagination.itemsPerPage + 1 }}
    </template>
    <template #item.avatar="{ item }">
      <v-avatar color="blue">
        <v-img v-if="item.raw.avatar" :src="item.raw.avatar" cover></v-img>
        <v-icon v-else icon="mdi-account-tie-hat"></v-icon>
      </v-avatar>
    </template>
    <template #item.authStatus="{ item }">
      <v-chip :color="authStatusText(item.raw.authStatus)?.color"
        >{{ authStatusText(item.raw.authStatus)?.text }}
      </v-chip>
    </template>
    <template #item.created="{ item }">
      {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
    </template>
  </v-data-table-server>
  <v-snackbar v-model="success" color="green" multi-line>
    <v-icon icon="mdi-check-circle-outline"></v-icon>
    Cập nhật thành công
  </v-snackbar>
</template>
<script setup lang="ts">
import { useDriverStore } from '~/stores/driver';
import { authStatusText } from '~/utils/helper';

useHead({
  title: `Hoang Gia Driver - Lái xe`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const driverStore = useDriverStore();
const { driverList, loading, total, success } = storeToRefs(driverStore);

const headers = [
  { title: '#', key: 'index' },
  { title: 'Ảnh', key: 'avatar' },
  { title: 'Họ tên', key: 'name' },
  { title: 'Số điện thoại', key: 'phone' },
  { title: 'Email', key: 'driver_email' },
  { title: 'Trạng thái', key: 'authStatus' },
  { title: 'Ngày tạo', key: 'created' },
];

const pagination = ref({
  page: 1,
  itemsPerPage: 10,
});

const handleLoadItems = async (options: any) => {
  await driverStore.listWaiting({
    limit: options.itemsPerPage,
    page: options.page,
  });
};

const handleClickRow = (_: Event, { item }: any) => {
  navigateTo(`${item.raw.id}`);
};
</script>
