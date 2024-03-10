<template>
  <v-text-field v-model="model"></v-text-field>
</template>
<script lang="ts" setup>
const model = defineModel()

const props = defineProps<{
  from: object;
  to: object;
}>();

watch(() => [props.from, props.to], (values) => {
  if (values[0] && values[1]) {
    const cFrom = values[0]
    const cTo = values[1]
  }
})

</script>
