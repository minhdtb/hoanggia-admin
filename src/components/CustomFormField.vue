<template>
  <div class="flex-grow-1">
    <v-label>
      {{ props.label }}
    </v-label>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();
</script>
