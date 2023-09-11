<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="transactionList"
    :loading="loading"
    :items-length="total"
    hover
    @update:options="handleLoadItems"
  >
    <template #item.index="{ index }">
      {{ index + 1 }}
    </template>
    <template #item.created="{ item }">
      {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
    </template>
  </v-data-table-server>
</template>
<script setup lang="ts">
import { useTransactionStore } from '~/stores/transaction';

useHead({
  title: `Hoang Gia Driver - Giao dịch`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const transactionStore = useTransactionStore();
const { transactionList, loading, total } = storeToRefs(transactionStore);

const headers = [
  { title: '#', key: 'index' },
  { title: 'Người tạo lệnh', key: 'creator' },
  { title: 'Người thụ hưởng', key: 'driver' },
  { title: 'Mã chuyển khoản', key: 'code' },
  { title: 'Số tiền', key: 'amount' },
  { title: 'Trạng thái', key: 'status' },
  { title: 'Ngày tạo', key: 'created' },
  { title: 'Hành động', key: 'action' },
];

const itemsPerPage = ref(10);

const handleLoadItems = async (options: any) => {
  await transactionStore.listWaiting({
    limit: options.itemsPerPage,
    page: options.page,
  });
};
</script>
