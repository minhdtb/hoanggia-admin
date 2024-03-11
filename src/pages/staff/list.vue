<template>
  <v-container>
    <v-row class="align-center mb-2">
      <v-btn @click="handleShowCreate" color="blue">Thêm nhân viên</v-btn>
    </v-row>
    <v-data-table-server
      v-model:page="pagination.page"
      v-model:items-per-page="pagination.itemsPerPage"
      :headers="headers"
      :items="staffList"
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
      <template #item.created="{ item }">
        {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
      </template>
      <template #item.action="{ item }">
        <v-btn variant="elevated" color="red" @click="handleDelete(item.raw.id)">Xóa</v-btn>
      </template>
      <template #item.role="{ item }">
        <v-chip :color="roleText(item.raw.role)?.color"
        >{{ roleText(item.raw.role)?.text }}
        </v-chip>
      </template>
    </v-data-table-server>
    <v-dialog v-model="showCreate" width="600">
      <staff-new @on-close="handleHideCreate"></staff-new>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import {useStaffStore} from "~/stores/staff";
import {bookingStatusText} from "~/utils/helper";

useHead({
  title: `Hoang Gia Driver - Nhân viên`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const staffStore = useStaffStore();

const {staffList, loading, total} = storeToRefs(staffStore);

const showCreate = ref(false);

const headers = [
  {title: '#', key: 'index'},
  {title: 'Đăng nhập', key: 'username'},
  {title: 'Họ và tên', key: 'fullName'},
  {title: 'Email', key: 'user_email'},
  {title: 'Quyền', key: 'role'},
  {title: 'Ngày tạo', key: 'created'},
  {title: 'Hành động', key: 'action'},
];

const pagination = ref({
  page: 1,
  itemsPerPage: 10,
});

const handleLoadItems = async (options: any) => {
  await staffStore.list({
    limit: options.itemsPerPage,
    page: options.page,
  });
};

const handleShowCreate = async () => {
  showCreate.value = true;
};

const handleHideCreate = async () => {
  await staffStore.list(pagination.value);
  showCreate.value = false;
};

const handleDelete = async (id: string) => {
  if (confirm('Bạn chắc chắn muốn xóa nhân viên này?')) {
    await staffStore.delete(id);
    await staffStore.list(pagination.value);
  }
};

</script>
