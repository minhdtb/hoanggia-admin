<template>
  <v-row class="align-center">
    <v-col cols="2">
      <v-text-field type="date" v-model="from" clearable></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field type="date" v-model="to" clearable></v-text-field>
    </v-col>
    <v-btn @click="handleExport">Xuất Exel</v-btn>
  </v-row>
  <v-data-table-server
    v-model:page="pagination.page"
    v-model:items-per-page="pagination.itemsPerPage"
    :headers="headers"
    :items="transactionList"
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
    <template #item.created="{ item }">
      {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
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
      <v-btn variant="elevated" color="red" @click="handleDelete(item.raw.id)">Xóa</v-btn>
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

const from = ref();
const to = ref();

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

watch(from, () => {
  transactionStore.list(undefined, from.value, to.value);
});

watch(to, () => {
  transactionStore.list(undefined, from.value, to.value);
});

const handleLoadItems = async (options: any) => {
  await transactionStore.list(
    {
      limit: options.itemsPerPage,
      page: options.page,
    },
    from.value,
    to.value,
  );
};

const handleDelete = async (id: string) => {
  if (confirm('Bạn chắc chắn muốn xóa giao dịch này?')) {
    await transactionStore.delete(id);
    await transactionStore.list();
  }
};

const handleExport = async () => {
  await transactionStore.exportExcel(from.value, to.value);
};
</script>
