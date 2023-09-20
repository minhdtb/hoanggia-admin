<template>
  <v-form v-bind="$attrs">
    <v-card>
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
      <v-overlay v-model="showLoading" contained class="align-center justify-center" persistent>
        <v-progress-circular color="blue" indeterminate size="32"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-form>
</template>
<script setup lang="ts">
const showLoading = ref(false);

const props = defineProps<{
  title?: string;
  loading?: boolean;
}>();

watch(
  () => props.loading,
  () => {
    showLoading.value = props.loading;
  },
);
</script>
