<template>
  <v-container>
    <v-row class="align-center">
      <v-btn variant="elevated" color="blue" @click="handleShowCreate">Thêm khuyến mại</v-btn>
    </v-row>
  </v-container>
  <v-data-table-server
    v-model:page="pagination.page"
    v-model:items-per-page="pagination.itemsPerPage"
    :headers="headers"
    :items="discountList"
    :loading="loading"
    :items-length="total"
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
    <template #item.validStart="{ item }">
      {{ $moment(item.raw.validStart).format('DD/MM/YYYY HH:mm') }}
    </template>
    <template #item.validEnd="{ item }">
      {{ $moment(item.raw.validEnd).format('DD/MM/YYYY HH:mm') }}
    </template>
    <template #item.created="{ item }">
      {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
    </template>
    <template #item.discount="{ item }">
      <span class="text-green">
        {{
          item.raw.discountType === 'Percent'
            ? `- ${item.raw.discount} %`
            : `- ${new Intl.NumberFormat('vi-VN').format(item.raw.discount ?? 0)} VNĐ`
        }}
      </span>
    </template>
    <template #item.type="{ item }">
      <span v-if="item.raw.type === 'All'">Tất cả</span>
      <a :href="`/customer/${item.raw.expand.user.id}`" v-else>{{ item.raw.expand.user.name }}</a>
    </template>
    <template #item.status="{ item }">
      <v-chip :color="discountStatusText(item.raw.status)?.color"
        >{{ discountStatusText(item.raw.status)?.text }}
      </v-chip>
    </template>
  </v-data-table-server>
  <v-dialog v-model="showCreate" width="800">
    <discount-new @on-close="handleHideCreate"></discount-new>
  </v-dialog>
</template>
<script setup lang="ts">
import { useDiscountStore } from '~/stores/discount';
import { discountStatusText } from '~/utils/helper';
import DiscountNew from '~/components/DiscountNew.vue';

useHead({
  title: `Hoang Gia Driver - Khuyến mại`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const discountStore = useDiscountStore();
const { discountList, loading, total } = storeToRefs(discountStore);

const showCreate = ref(false);

const headers = [
  { title: '#', key: 'index' },
  { title: 'Khuyến mại', key: 'title' },
  { title: 'Số lượng', key: 'count' },
  { title: 'Ưu đãi', key: 'discount' },
  { title: 'Từ ngày', key: 'validStart' },
  { title: 'Đến ngày', key: 'validEnd' },
  { title: 'Người dùng', key: 'type' },
  { title: 'Trạng thái', key: 'status' },
  { title: 'Ngày tạo', key: 'created' },
];

const pagination = ref({
  page: 1,
  itemsPerPage: 10,
});

const handleLoadItems = async (options: any) => {
  await discountStore.list({
    limit: options.itemsPerPage,
    page: options.page,
  });
};

const handleClickRow = (_: Event, { item }: any) => {
  navigateTo(`${item.raw.id}`);
};

const handleShowCreate = async () => {
  showCreate.value = true;
};

const handleHideCreate = async () => {
  await discountStore.list(pagination.value);
  showCreate.value = false;
};
</script>
<style scoped>
.v-data-table {
  overflow-x: auto !important;
}
</style>
