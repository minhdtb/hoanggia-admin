<template>
  <custom-form title="Xử lý cuốc xe bằng tay" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Lái xe">
            <driver-available v-bind="driverIds"></driver-available>
          </custom-form-field>
          <custom-form-field label="Phí dịch vụ">
            <v-text-field v-bind="fee" type="number" suffix=" VNĐ"></v-text-field>
          </custom-form-field>
        </v-col>
        <v-col></v-col>
      </v-row>
    </template>
    <template #actions>
      <v-btn variant="elevated" @click="emit('onClose')">Quay lại</v-btn>
      <v-btn variant="elevated" color="blue" type="submit" :disabled="isValidating || isSubmitting">
        Chấp nhận
      </v-btn>
    </template>
  </custom-form>
</template>
<script setup lang="ts">
import * as yup from 'yup';
import {SubmitEventPromise} from 'vuetify';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const props = defineProps<{
  id: string;
}>();

const bookingStore = useBookingStore();

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      driverIds: yup.array().of(yup.string()).required('Hãy chọn lái xe'),
      fee: yup.number().required('Hãy nhập số tiền'),
    }),
  ),
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const driverIds = defineComponentBinds('driverIds', validateConfig);
const fee = defineComponentBinds('fee', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    await bookingStore.manualAssignDriver(props.id, values.driverIds, values.fee);
    emit('onClose');
  })();
};
</script>
