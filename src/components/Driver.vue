<template>
  <custom-form title="Chi tiết lái xe" @submit="onSubmit">
    <template #content></template>
    <template #actions>
      <v-btn variant="outlined" @click="emit('onClose')"> Bỏ qua</v-btn>
      <v-btn variant="outlined" color="blue" type="submit" :disabled="isValidating || isSubmitting">
        Chấp nhận
      </v-btn>
    </template>
  </custom-form>
</template>
<script setup lang="ts">
import * as yup from 'yup';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const props = defineProps<{
  id: string;
}>();

const { handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      code: yup.string().required(t('components.trUser.TrDepartmentUpdateForm.codeRequired')),
      name: yup.string().required(t('components.trUser.TrDepartmentUpdateForm.nameRequired')),
      memo: yup.string(),
    }),
  ),
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const code = defineComponentBinds('code', validateConfig);
const name = defineComponentBinds('name', validateConfig);
const memo = defineComponentBinds('memo', validateConfig);

watch(
  () => trDepartmentStore.current,
  () => {
    setFieldValue('code', current.value?.code);
    setFieldValue('name', current.value?.name);
    setFieldValue('memo', current.value?.memo ?? undefined);
  },
);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    await trDepartmentStore.updateTrDepartment(props.id, values);
    emit('onClose');
  })();
};
</script>
