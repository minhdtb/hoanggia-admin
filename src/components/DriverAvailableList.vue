<template>
  <custom-form title="Chọn lái xe">
    <template #content>
      <v-text-field
        v-model="search"
        hide-details
        placeholder="Tìm kiếm (Họ tên)"
        class="ma-2"
        density="compact"
      ></v-text-field>
      <div class="d-flex overflow-auto" style="height: 300px">
        <v-data-table-server
          :headers="headers"
          :items="driverAvailableList"
          :loading="loading"
          :search="search"
          :items-length="0"
          select-strategy="single"
          return-object
          show-select
          hover
          @update:options="handleLoadItems"
          v-model="selected"
        >
          <template #item.index="{ index }">
            {{ index + 1 }}
          </template>
          <template #item.avatar="{ item }">
            <v-avatar color="blue">
              <v-img v-if="item.raw.avatar" :src="item.raw.avatar" cover></v-img>
              <v-icon v-else icon="mdi-account-tie-hat"></v-icon>
            </v-avatar>
          </template>
          <template #item.authStatus="{ item }">
            <v-chip :color="authStatusText(item.raw.authStatus)?.color"
              >{{ authStatusText(item.raw.authStatus)?.text }}
            </v-chip>
          </template>
          <template #item.driveStatus="{ item }">
            <v-chip :color="driveStatusText(item.raw.driveStatus)?.color"
              >{{ driveStatusText(item.raw.driveStatus)?.text }}
            </v-chip>
          </template>
          <template #item.activeStatus="{ item }">
            <v-chip :color="activeStatusText(item.raw.activeStatus)?.color"
              >{{ activeStatusText(item.raw.activeStatus)?.text }}
            </v-chip>
          </template>
          <template #item.balance="{ item }">
            {{ new Intl.NumberFormat('vi-VN').format(item.raw.balance ?? 0) }}
          </template>
          <template #item.created="{ item }">
            {{ $moment(item.raw.created).format('DD/MM/YYYY HH:mm') }}
          </template>
          <template #bottom></template>
        </v-data-table-server>
      </div>
    </template>
    <template #actions>
      <v-btn variant="elevated" color="blue" @click="handleSubmit">Chấp nhận</v-btn>
    </template>
  </custom-form>
  <v-overlay contained v-model="loading" class="align-center justify-center">
    <v-progress-circular color="blue" indeterminate size="32"></v-progress-circular>
  </v-overlay>
</template>
<script setup lang="ts">
import { activeStatusText, authStatusText, driveStatusText } from '~/utils/helper';
import { Driver } from '~/stores/driver';

useHead({
  title: `Hoang Gia Driver - Lái xe`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const emit = defineEmits<{
  (eventName: 'onAccept', item: Driver): void;
}>();

const driverStore = useDriverStore();
const { driverAvailableList, loading } = storeToRefs(driverStore);

const selected = ref([]);

const headers = [
  { title: '#', key: 'index' },
  { title: 'Ảnh', key: 'avatar' },
  { title: 'Họ tên', key: 'name' },
  { title: 'Số điện thoại', key: 'phone' },
  { title: 'Tài khoản', key: 'balance' },
];

const search = ref('');

const handleLoadItems = async () => {
  await driverStore.listAvailable(search.value);
};

const handleSubmit = () => {
  if (selected.value.length > 0) {
    emit('onAccept', selected.value[0]);
  }
};
</script>
