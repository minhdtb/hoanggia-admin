<template>
  <v-form v-bind="$attrs">
    <v-card :loading="loading">
      <v-card-title primary-title>{{ props.title }}</v-card-title>
      <v-divider />
      <div class="pa-2">
        <slot name="content"></slot>
      </div>
      <v-divider />
      <v-card-actions>
        <div class="pa-2">
          <slot name="actions"></slot>
        </div>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script setup lang="ts">
const props = defineProps<{
  title?: string;
  loading?: boolean;
}>();
</script>
