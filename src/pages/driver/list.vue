<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          v-model="search"
          hide-details
          placeholder="Tìm kiếm (Họ tên, Số điện thoại) ..."
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col>
        <driver-status-select placeHolder="Trạng thái hồ sơ" v-model="status"></driver-status-select>
      </v-col>
      <v-col>
        <driver-app-status-select placeHolder="Trạng thái ứng dụng" v-model="driveStatus"></driver-app-status-select>
      </v-col>
      <v-col>
        <driver-active-status-select placeHolder="Trạng thái hoạt động"
                                     v-model="activeStatus"></driver-active-status-select>
      </v-col>
    </v-row>
  </v-container>
  <v-data-table-server
    v-model:page="pagination.page"
    v-model:itemsPerPage.sync="pagination.itemsPerPage"
    :headers="headers"
    :items="driverList"
    :loading="loading"
    :items-length="total"
    :search="filter"
    hover
    :items-per-page-options="[
      { value: 10, title: '10' },
      { value: 20, title: '20' },
      { value: 30, title: '30' },
    ]"
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
import {useDriverStore} from '~/stores/driver';
import {activeStatusText, authStatusText, driveStatusText} from '~/utils/helper';

useHead({
  title: `Hoang Gia Driver - Lái xe`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const status = ref(undefined)
const driveStatus = ref(undefined)
const activeStatus = ref(undefined)
const search = ref('');

const filter = computed(() => {
  let myFilter = `(name ~ "${search.value ?? ''}" || phone ~ "${search.value ?? ''}")`
  if (status.value) {
    myFilter = myFilter + ` && authStatus = "${status.value}"`
  }
  if (driveStatus.value) {
    myFilter = myFilter + ` && driveStatus = "${driveStatus.value}"`
  }
  if (activeStatus.value) {
    myFilter = myFilter + ` && activeStatus = "${activeStatus.value}"`
  }

  return myFilter
})

const driverStore = useDriverStore();
const {driverList, loading, total, success} = storeToRefs(driverStore);
const pagination = ref({
  page: 1,
  itemsPerPage: 10,
});

const headers = [
  {title: '#', key: 'index'},
  {title: 'Ảnh', key: 'avatar'},
  {title: 'Họ tên', key: 'name'},
  {title: 'Số điện thoại', key: 'phone'},
  {title: 'Tài khoản', key: 'balance'},
  {title: 'Hồ sơ', key: 'authStatus'},
  {title: 'Trạng thái ứng dụng', key: 'driveStatus'},
  {title: 'Hoạt động', key: 'activeStatus'},
  {title: 'Ngày đăng ký', key: 'created'},
];


const handleLoadItems = async (options: any) => {
  await driverStore.list(
    {
      limit: options.itemsPerPage,
      page: options.page,
    },
    filter.value,
  );
};

const handleClickRow = (_: Event, {item}: any) => {
  navigateTo(`${item.raw.id}`);
};
</script>
