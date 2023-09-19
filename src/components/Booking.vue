<template>
  <custom-form title="Xử lý cuốc xe bằng tay" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Lái xe">
            <v-text-field
              v-bind="name"
              readonly
              append-icon="mdi-plus"
              @click:append="onAdd"
            ></v-text-field>
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
  <v-dialog v-model="showAvailable" width="700">
    <driver-available-list @onAccept="handleAccept"></driver-available-list>
  </v-dialog>
</template>
<script setup lang="ts">
import * as yup from 'yup';
import { SubmitEventPromise } from 'vuetify';
import DriverAvailableList from '~/components/DriverAvailableList.vue';
import { Driver } from '~/stores/driver';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const props = defineProps<{
  id: string;
}>();

const bookingStore = useBookingStore();

const showAvailable = ref(false);

const { handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      name: yup.string().required('Hãy chọn lái xe'),
      fee: yup.number().required('Hãy nhập số tiền'),
    }),
  ),
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const name = defineComponentBinds('name', validateConfig);
const fee = defineComponentBinds('fee', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    emit('onClose');
  })();
};

const onAdd = () => {
  showAvailable.value = true;
};

const handleAccept = (item: Driver) => {
  setFieldValue('name', `${item.name} (${item.id})`);
  showAvailable.value = false;
};
</script>
