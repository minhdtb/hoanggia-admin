<template>
  <v-text-field
    v-model="search"
    hide-details
    placeholder="Tìm kiếm (Họ tên, Số điện thoại) ..."
    class="ma-2"
    density="compact"
  ></v-text-field>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="driverList"
    :loading="loading"
    :items-length="total"
    :search="search"
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
        <v-icon v-else icon="mdi-account-tie-hat"></v-icon>
      </v-avatar>
    </template>
    <template #item.authStatus="{ item }">
      <v-chip :color="authStatusText(item.raw.authStatus)?.color"
        >{{ authStatusText(item.raw.authStatus)?.text }}
      </v-chip>
    </template>
    <template #item.driveStatus="{ item }">
      <v-chip :color="driveStatusText(item.raw.driveStatus)?.color"
        >{{ driveStatusText(item.raw.driveStatus)?.text }}
      </v-chip>
    </template>
    <template #item.activeStatus="{ item }">
      <v-chip :color="activeStatusText(item.raw.activeStatus)?.color"
        >{{ activeStatusText(item.raw.activeStatus)?.text }}
      </v-chip>
    </template>
    <template #item.balance="{ item }">
      {{ new Intl.NumberFormat('vi-VN').format(item.raw.balance ?? 0) }}
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
import { activeStatusText, authStatusText, driveStatusText } from '../../utils/helper';

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
  { title: 'Tài khoản', key: 'balance' },
  { title: 'Trạng thái', key: 'authStatus' },
  { title: 'Sẵn sàng', key: 'driveStatus' },
  { title: 'Hoạt động', key: 'activeStatus' },
  { title: 'Ngày đăng ký', key: 'created' },
];

const itemsPerPage = ref(10);
const search = ref('');

const handleLoadItems = async (options: any) => {
  await driverStore.list(
    {
      limit: options.itemsPerPage,
      page: options.page,
    },
    search.value,
  );
};

const handleClickRow = (_: Event, { item }: any) => {
  navigateTo(`${item.raw.id}`);
};
</script>
