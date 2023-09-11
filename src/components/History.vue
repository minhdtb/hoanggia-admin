<template>
  <custom-form title="Lịch sử chuyến đi">
    <template #content>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="historyList"
        :loading="loading"
        :items-length="total"
        hover
        @update:options="handleLoadItems"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.user="{ item }">
          <a :href="`/customer/${item.raw.expand?.user?.id}`">{{ item.raw.expand?.user?.name }}</a>
        </template>
        <template #item.driver="{ item }">
          <a :href="`/driver/${item.raw.expand?.driver?.id}`">{{
            item.raw.expand?.driver?.name
          }}</a>
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
        <template #item.bookingDate="{ item }">
          {{ $moment(item.raw.bookingDate).format('DD/MM/YYYY HH:mm') }}
        </template>
        <template #item.created="{ item }">
          {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
        </template>
        <template #item.distance="{ item }">
          {{ item.raw.distance.text }}
        </template>
        <template #item.fee="{ item }">
          {{ new Intl.NumberFormat('vi-VN').format(item.raw.fee ?? 0) }}
        </template>
        <template #item.status="{ item }">
          <v-chip :color="item.raw.status == 'Finished' ? 'green' : 'red'">
            {{ item.raw.status == 'Finished' ? 'Hoàn thành' : 'Đã hủy' }}
          </v-chip>
        </template>
      </v-data-table-server>
    </template>
    <template #actions>
      <v-btn variant="elevated" @click="emit('onClose')">Đóng</v-btn>
    </template>
  </custom-form>
</template>
<script setup lang="ts">
const historyStore = useHistoryStore();
const { historyList, loading, total } = storeToRefs(historyStore);

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const props = defineProps<{
  id: string;
}>();

const headers = [
  { title: '#', key: 'index' },
  { title: 'Khách hàng', key: 'user' },
  { title: 'Tài xế', key: 'driver' },
  { title: 'Điểm đón', key: 'from' },
  { title: 'Điểm đến', key: 'to' },
  { title: 'Thời gian đón', key: 'pickupDate' },
  { title: 'Thời gian đặt', key: 'bookingDate' },
  { title: 'Cước phí', key: 'fee' },
  { title: 'Quãng đường', key: 'distance' },
  { title: 'Trạng thái', key: 'status' },
  { title: 'Ngày tạo', key: 'created' },
];

const itemsPerPage = ref(10);

const handleLoadItems = async (options: any) => {
  await historyStore.list(props.id, {
    limit: options.itemsPerPage,
    page: options.page,
  });
};
</script>
