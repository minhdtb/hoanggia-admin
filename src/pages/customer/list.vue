<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="userList"
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
      <v-avatar color="blue">
        <v-img v-if="item.raw.avatar" :src="item.raw.avatar" cover></v-img>
        <v-icon v-else icon="mdi-account"></v-icon>
      </v-avatar>
    </template>
    <template #item.created="{ item }">
      {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
    </template>
  </v-data-table-server>
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/user';

useHead({
  title: `Hoang Gia Driver - Khách hàng`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const userStore = useUserStore();
const { userList, loading, total } = storeToRefs(userStore);

const headers = [
  { title: '#', key: 'index' },
  { title: 'Ảnh', key: 'avatar' },
  { title: 'Họ tên', key: 'name' },
  { title: 'Số điện thoại', key: 'phone' },
  { title: 'Email', key: 'user_email' },
  { title: 'Địa chỉ', key: 'address' },
  { title: 'Ngày tạo', key: 'created' },
];

const itemsPerPage = ref(10);

const handleLoadItems = async (options: any) => {
  await userStore.list({
    limit: options.itemsPerPage,
    page: options.page,
  });
};

const handleClickRow = (_: Event, { item }: any) => {
  navigateTo(`${item.raw.id}`);
};
</script>
