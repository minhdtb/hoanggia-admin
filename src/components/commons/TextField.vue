<template>
  <div class="flex flex-col text-base gap-1">
    <label class="text-sm">{{ title }}</label>
    <input
      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      v-bind="$attrs"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span class="text-red-400 text-sm p-1" v-for="error in errors">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
defineEmits(['update:modelValue']);
defineProps<{
  title?: string;
  errors?: string[];
}>();
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
