<template>
  <v-data-table class="border rounded mb-2" :headers="headers" :items="model">
    <template #bottom></template>
    <template #item.action="{ item }">
      <v-btn variant="elevated" color="red" rounded @click="handleDelete(item.index)">X</v-btn>
    </template>
  </v-data-table>
  <div class="d-flex flex-row">
    <span class="text-error" style="font-size: 12px" v-for="error in errorMessages">
    {{ error }}
  </span>
  </div>
  <v-btn color="orange" v-on:click="onAddVehicle">Thêm xe</v-btn>
  <v-dialog v-model="showCreateVehicle" width="400">
    <vehicle-new @on-submit="handleCreateVehicle"></vehicle-new>
  </v-dialog>
</template>
<script lang="ts" setup>
const headers = [
  {
    title: 'Hãng xe',
    key: 'brand',
    sortable: false,
  },
  {
    title: 'Loại xe',
    key: 'type',
    sortable: false,
  },
  {
    title: '',
    key: 'action',
    width: 30,
    sortable: false,
  },
]

defineProps<{
  errorMessages?: string[];
  onBlur?: () => void;
}>();

const model = defineModel<[{
  brand: string;
  type: string;
}]>()

const onAddVehicle = () => {
  showCreateVehicle.value = true
}

const showCreateVehicle = ref(false)

const handleCreateVehicle = (values: any) => {
  const temp = [...(model.value ?? [])]
  temp.push(values)
  model.value = temp as any
  showCreateVehicle.value = false
}

const handleDelete = (index: number) => {
  model.value?.splice(index, 1)
}
</script>
