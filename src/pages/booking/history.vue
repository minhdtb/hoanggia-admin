<template>
  <v-text-field
    v-model="search"
    hide-details
    placeholder="Tìm kiếm (Mã, Khách hàng) ..."
    class="ma-2"
    density="compact"
  ></v-text-field>
  <v-data-table-server
    v-model:page="pagination.page"
    v-model:items-per-page="pagination.itemsPerPage"
    :headers="headers"
    :items="bookingHistoryList"
    :loading="loading"
    :items-length="historyTotal"
    :search="search"
    hover
    :items-per-page-options="[
      { value: 10, title: '10' },
      { value: 20, title: '20' },
      { value: 30, title: '30' },
    ]"
    @update:options="handleLoadItems"
  >
    <template #item.index="{ index }">
      {{ index + (pagination.page - 1) * pagination.itemsPerPage + 1 }}
    </template>
    <template #item.user="{ item }">
      <a :href="`/customer/${item.raw.expand?.user?.id}`">{{ item.raw.expand?.user?.name }}</a>
    </template>
    <template #item.driver="{ item }">
      <a :href="`/driver/${item.raw.expand?.driver?.id}`">{{ item.raw.expand?.driver?.name }}</a>
    </template>
    <template #item.from="{ item }">
      {{ item.raw.from.formatted_address }}
    </template>
    <template #item.to="{ item }">
      {{ item.raw.to.formatted_address }}
    </template>
    <template #item.pickupDate="{ item }">
      {{ $moment(item.raw.pickupDate).subtract(7, 'hour').format('DD/MM/YYYY HH:mm') }}
    </template>
    <template #item.distance="{ item }">
      {{ `${(item.raw.distance.value / 1000).toFixed(2)} km` }}
    </template>
    <template #item.fee="{ item }">
      {{ new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(item.raw.fee ?? 0) }}
    </template>
    <template #item.created="{ item }">
      {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
    </template>
    <template #item.status="{ item }">
      <v-chip :color="bookingStatusText(item.raw.status)?.color"
      >{{ bookingStatusText(item.raw.status)?.text }}
      </v-chip>
    </template>
    <template #item.type="{ item }">
      <v-chip :color="bookingTypeText(item.raw.type)?.color"
      >{{ bookingTypeText(item.raw.type)?.text }}
      </v-chip>
    </template>
  </v-data-table-server>
  <v-overlay persistent v-model="canceling" class="align-center justify-center">
    <v-progress-circular color="blue" indeterminate size="32"></v-progress-circular>
  </v-overlay>
</template>
<script setup lang="ts">
import {bookingStatusText, bookingTypeText} from "~/utils/helper";

useHead({
  title: `Hoang Gia Driver - Cuốc xe`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const bookingStore = useBookingStore();
const {bookingHistoryList, loading, canceling, historyTotal} = storeToRefs(bookingStore);

const headers = [
  {title: '#', key: 'index'},
  {title: 'Mã cuốc xe', key: 'id'},
  {title: 'Khách hàng', key: 'user'},
  {title: 'Lái xe', key: 'driver'},
  {title: 'Điểm đón', key: 'from'},
  {title: 'Điểm đến', key: 'to'},
  {title: 'Thời gian đón', key: 'pickupDate'},
  {title: 'Quãng đường', key: 'distance'},
  {title: 'Cước phí', key: 'fee'},
  {title: 'Khuyến mại', key: 'discount'},
  {title: 'Loại', key: 'type'},
  {title: 'Trạng thái', key: 'status'},
  {title: 'Ngày tạo', key: 'created'},
];

const pagination = ref({
  page: 1,
  itemsPerPage: 10,
});
const search = ref('');

const handleLoadItems = async (options: any) => {
  await bookingStore.listHistory(
    {
      limit: options.itemsPerPage,
      page: options.page,
    },
    search.value,
  );
};
</script>
