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

const itemsPerPage = ref(10);

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
