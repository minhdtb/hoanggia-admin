<template>
  <v-data-table-server
    v-model:page="pagination.page"
    v-model:items-per-page="pagination.itemsPerPage"
    :headers="headers"
    :items="bookingList"
    :loading="loading"
    :items-length="total"
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
      {{ item.raw.distance.text }}
    </template>
    <template #item.fee="{ item }">
      {{ new Intl.NumberFormat('vi-VN').format(item.raw.fee ?? 0) }}
    </template>
    <template #item.created="{ item }">
      {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
    </template>
    <template #item.action="{ item }">
      <v-row>
        <v-btn
          class="mr-2"
          v-if="item.raw.status === 'Manual'"
          variant="elevated"
          icon="mdi-eye"
          size="small"
          color="blue"
          @click="handleClickRow(item.raw)"
        ></v-btn>
        <v-btn
          variant="elevated"
          icon="mdi-close"
          size="small"
          color="red"
          @click="handleCancel(item.raw)"
        ></v-btn>
      </v-row>
    </template>
  </v-data-table-server>
  <v-overlay persistent v-model="canceling" class="align-center justify-center">
    <v-progress-circular color="blue" indeterminate size="32"></v-progress-circular>
  </v-overlay>
</template>
<script setup lang="ts">
import { Booking } from '~/stores/booking';

useHead({
  title: `Hoang Gia Driver - Cuốc xe`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const bookingStore = useBookingStore();
const { bookingList, loading, canceling, total } = storeToRefs(bookingStore);

const headers = [
  { title: '#', key: 'index' },
  { title: 'Khách hàng', key: 'user' },
  { title: 'Lái xe', key: 'driver' },
  { title: 'Điểm đón', key: 'from' },
  { title: 'Điểm đến', key: 'to' },
  { title: 'Thời gian đón', key: 'pickupDate' },
  { title: 'Quãng đường', key: 'distance' },
  { title: 'Cước phí', key: 'fee' },
  { title: 'Khuyến mại', key: 'discount' },
  { title: 'Trạng thái', key: 'status' },
  { title: 'Ngày tạo', key: 'created' },
  { title: 'Hành động', key: 'action' },
];

const pagination = ref({
  page: 1,
  itemsPerPage: 10,
});

const handleLoadItems = async (options: any) => {
  await bookingStore.list({
    limit: options.itemsPerPage,
    page: options.page,
  });
};

const handleClickRow = (item: any) => {
  navigateTo(`${item.id}`);
};

const handleCancel = async (item: Booking) => {
  if (confirm('Bạn chắc chắn muốn hủy cuốc xe này?')) {
    await bookingStore.cancel(item.id ?? '');
  }
};
</script>
