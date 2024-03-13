<template>
  <v-select v-bind="$attrs" v-model="selected" :items="items" item-value="id" item-title="brand" return-object>
    <template v-slot:no-data>
      <v-list-item v-if="userId" title="Tạo xe" @click="newVehicle">
      </v-list-item>
    </template>
  </v-select>
  <v-dialog v-model="showCreateVehicle" width="400">
    <vehicle-new @on-submit="handleCreateVehicle"></vehicle-new>
  </v-dialog>
</template>
<script lang="ts" setup>
const props = defineProps<{
  userId: string,
}>()

const model = defineModel()

const pb = usePb()
const items = ref<any[]>([])
const selected = ref<any>(undefined)
const showCreateVehicle = ref(false)

watch(() => props.userId, async (value) => {
  selected.value = undefined
  items.value = await pb.collection('vehicle').getFullList({
    filter: `user = "${value}"`
  })
  if (items.value.length > 0) {
    selected.value = items.value[0]
  }
})

watch(selected, (value) => {
  model.value = value
})

const newVehicle = async () => {
  showCreateVehicle.value = true
}

const handleCreateVehicle = async (vehicle: any) => {
  selected.value = await pb.collection('vehicle').create({
    user: props.userId,
    brand: vehicle.brand,
    name: vehicle.name,
    type: vehicle.type,
  })
  items.value.push(selected.value)
  showCreateVehicle.value = false
}
</script>
