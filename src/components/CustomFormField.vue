<template>
  <v-label>
    {{ props.label }}
  </v-label>
  <slot></slot>
</template>
<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();
</script>
