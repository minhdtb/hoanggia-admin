<template>
  <custom-form title="Nạp tiền vào tài khoản" @submit="onSubmit">
    <template #content>
      <custom-form-field label="Số tiền (VNĐ)">
        <v-text-field v-bind="amount" type="number" />
      </custom-form-field>
    </template>
    <template #actions>
      <v-btn variant="elevated" color="blue" type="submit" :disabled="isValidating || isSubmitting">
        Chấp nhận
      </v-btn>
      <v-btn variant="elevated" @click="emit('onClose')">Bỏ qua</v-btn>
    </template>
  </custom-form>
</template>
<script setup lang="ts">
import { SubmitEventPromise } from 'vuetify';
import * as yup from 'yup';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const props = defineProps<{
  driverId: string;
}>();

const { handleSubmit, defineComponentBinds, isValidating, isSubmitting } = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      amount: yup.number().required('Hãy nhập số tiền'),
    }),
  ),
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const amount = defineComponentBinds('amount', validateConfig);

const transactionStore = useTransactionStore();

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    await transactionStore.createTransaction({
      driverId: props.driverId,
      amount: values.amount,
    });
    emit('onClose');
  })();
};
</script>
