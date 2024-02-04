<template>
  <v-data-table-server
    v-model:page="pagination.page"
    v-model:items-per-page="pagination.itemsPerPage"
    :headers="headers"
    :items="discountUsedList"
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
    <template #item.useDate="{ item }">
      {{ $moment(item.raw.useDate).format('DD/MM/YYYY HH:mm') }}
    </template>
    <template #item.user="{ item }">
      <a :href="`/customer/${item.raw.expand.user.id}`">{{ item.raw.expand.user.name }}</a>
    </template>
    <template #item.discount="{ item }">
      <a :href="`/discount/${item.raw.expand.discount.id}`">{{ item.raw.expand.discount.title }}</a>
    </template>
    <template #item.discountValue="{ item }">
      <span class="text-green">
        {{
          item.raw.expand.discount.discountType === 'Percent'
            ? `- ${item.raw.expand.discount.discount} %`
            : `- ${new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(
                item.raw.expand.discount.discount ?? 0,
              )} VNĐ`
        }}
      </span>
    </template>
  </v-data-table-server>
</template>
<script setup lang="ts">
import { useDiscountStore } from '~/stores/discount';
import { discountStatusText } from '~/utils/helper';

useHead({
  title: `Hoang Gia Driver - Khuyến mại`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const discountStore = useDiscountStore();
const { discountUsedList, loading, total } = storeToRefs(discountStore);

const headers = [
  { title: '#', key: 'index' },
  { title: 'Người sử dụng', key: 'user' },
  { title: 'Khuyến mại', key: 'discount' },
  { title: 'Giảm giá', key: 'discountValue' },
  { title: 'Cuốc xe', key: 'booking' },
  { title: 'Ngày sử dụng', key: 'useDate' },
];

const pagination = ref({
  page: 1,
  itemsPerPage: 10,
});

const handleLoadItems = async (options: any) => {
  await discountStore.listUsed({
    limit: options.itemsPerPage,
    page: options.page,
  });
};
</script>
<style scoped>
.v-data-table {
  overflow-x: auto !important;
}
</style>
