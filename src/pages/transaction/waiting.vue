<template>
  <v-data-table-server
    v-model:page="pagination.page"
    v-model:items-per-page="pagination.itemsPerPage"
    :headers="headers"
    :items="transactionList"
    :loading="loading"
    :items-length="total"
    hover
    @update:options="handleLoadItems"
  >
    <template #item.index="{ index }">
      {{ index + (pagination.page - 1) * pagination.itemsPerPage + 1 }}
    </template>
    <template #item.created="{ item }">
      {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
    </template>
    <template #item.creator="{ item }">
      <a
        v-if="item.raw.expand && item.raw.expand?.creator"
        :href="`/driver/${item.raw.expand?.creator?.id}`"
        >{{ item.raw.expand?.creator ? item.raw.expand.creator.name : '' }}</a
      >
      <span v-else>Admin</span>
    </template>
    <template #item.driver="{ item }">
      <a v-if="item.raw.expand" :href="`/driver/${item.raw.expand?.driver?.id}`">{{
        item.raw.expand?.driver ? item.raw.expand.driver.name : ''
      }}</a>
    </template>
    <template #item.amount="{ item }">
      {{ new Intl.NumberFormat('vi-VN').format(item.raw.amount ?? 0) }}
    </template>
    <template #item.status="{ item }">
      <v-chip :color="transStatusText(item.raw.status)?.color"
        >{{ transStatusText(item.raw.status)?.text }}
      </v-chip>
    </template>
    <template #item.action="{ item }">
      <v-btn variant="elevated" color="blue" class="mr-2" @click="handleAccept(item.raw.id)"
        >Duyệt
      </v-btn>
      <v-btn variant="elevated" color="red" @click="handleReject(item.raw.id)">Từ chối</v-btn>
    </template>
  </v-data-table-server>
</template>
<script setup lang="ts">
import { useTransactionStore } from '~/stores/transaction';
import { transStatusText } from '~/utils/helper';

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

const pagination = ref({
  page: 1,
  itemsPerPage: 10,
});

const handleLoadItems = async (options: any) => {
  await transactionStore.listWaiting({
    limit: options.itemsPerPage,
    page: options.page,
  });
};

const handleAccept = async (id: string) => {
  if (confirm('Bạn chắc chắn muốn duyệt giao dịch này?')) {
    await transactionStore.approve(id);
    await transactionStore.listWaiting();
  }
};

const handleReject = async (id: string) => {
  if (confirm('Bạn chắc chắn muốn từ chối giao dịch này?')) {
    await transactionStore.reject(id);
    await transactionStore.listWaiting();
  }
};
</script>
