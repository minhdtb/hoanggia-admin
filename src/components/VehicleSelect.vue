<template>
  <v-select v-model="selected" :items="items" item-value="id" item-title="brand" return-object></v-select>
</template>
<script lang="ts" setup>
const props = defineProps<{
  userId: string,
}>()

const model = defineModel()

const pb = usePb()
const items = ref<any[]>([])
const selected = ref(undefined)

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
</script>
