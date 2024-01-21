<template>
  <v-container>
    <v-row class="align-center mb-2">
      <v-btn @click="handleShowCreate" color="blue">Thêm báo cáo</v-btn>
    </v-row>
    <v-data-table-server
      v-model:page="pagination.page"
      v-model:items-per-page="pagination.itemsPerPage"
      :headers="headers"
      :items="reportList"
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
      <template #item.from="{ item }">
        <span v-if="item.raw.from">{{ $moment(item.raw.from).format('DD/MM/YYYY') }}</span>
        <span v-else>N/A</span>
      </template>
      <template #item.to="{ item }">
        <span v-if="item.raw.to">{{ $moment(item.raw.to).format('DD/MM/YYYY') }}</span>
        <span v-else>N/A</span>
      </template>
      <template #item.created="{ item }">
        {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
      </template>
      <template #item.type="{ item }">
        <v-chip :color="reportTypeText(item.raw.type)?.color"
        >{{ reportTypeText(item.raw.type)?.text }}
        </v-chip>
      </template>
      <template #item.status="{ item }">
        <v-chip :color="reportStatusText(item.raw.status)?.color"
        >{{ reportStatusText(item.raw.status)?.text }}
        </v-chip>
      </template>
      <template #item.link="{ item }">
        <a v-if="item.raw.link" href="#" @click.prevent="downloadFile(item.raw)">
          Link
        </a>
      </template>
      <template #item.action="{ item }">
        <v-btn variant="elevated" color="red" @click="handleDelete(item.raw.id)">Xóa</v-btn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="showCreate" width="600">
      <report-new @on-close="handleHideCreate"></report-new>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import {reportStatusText, reportTypeText} from "~/utils/helper";
import {useReportStore} from "~/stores/report";

useHead({
  title: `Hoang Gia Driver - Báo cáo`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const reportStore = useReportStore();
const appConfig = useAppConfig();

const {reportList, loading, total} = storeToRefs(reportStore);

const showCreate = ref(false);

const headers = [
  {title: '#', key: 'index'},
  {title: 'Từ ngày', key: 'from'},
  {title: 'Đến ngày', key: 'to'},
  {title: 'Loại báo cáo', key: 'type'},
  {title: 'Trạng thái', key: 'status'},
  {title: 'Tải về', key: 'link'},
  {title: 'Ngày tạo', key: 'created'},
  {title: 'Hành động', key: 'action'},
];

const pagination = ref({
  page: 1,
  itemsPerPage: 10,
});

const handleLoadItems = async (options: any) => {
  await reportStore.list({
    limit: options.itemsPerPage,
    page: options.page,
  });
};

const handleShowCreate = async () => {
  showCreate.value = true;
};

const handleHideCreate = async () => {
  await reportStore.list(pagination.value);
  showCreate.value = false;
};

const handleDelete = async (id: string) => {
  if (confirm('Bạn chắc chắn muốn xóa báo cáo này?')) {
    await reportStore.delete(id);
    await reportStore.list(pagination.value);
  }
};

const downloadFile = async (item: any) => {
  const url = `${appConfig.backend.url}/api/files/report/${item.id}/${item.link}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = item.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

</script>
