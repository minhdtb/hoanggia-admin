<template>
  <custom-form title="Thông tin khách hàng" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Họ tên">
            <v-text-field v-bind="name" disabled></v-text-field>
          </custom-form-field>
          <custom-form-field label="Số điện thoại">
            <v-text-field v-bind="phone" disabled></v-text-field>
          </custom-form-field>
          <custom-form-field label="Email">
            <v-text-field v-bind="email" disabled></v-text-field>
          </custom-form-field>
          <custom-form-field label="Địa chỉ">
            <v-text-field v-bind="address" disabled></v-text-field>
          </custom-form-field>
        </v-col>
        <v-col>
          <custom-form-field label="Avatar">
            <div>
              <v-avatar size="x-large">
                <v-img :src="current?.avatar"></v-img>
              </v-avatar>
            </div>
          </custom-form-field>
          <custom-form-field label="Ngày đăng ký">
            <div class="pa-1">{{ $moment(current?.created).format('DD/MM/YYYY HH:mm') }}</div>
          </custom-form-field>
          <div class="pt-14">
            <v-btn class="mr-2" variant="elevated" color="orange">Xem lịch sử</v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
    <template #actions>
      <v-btn variant="elevated" @click="emit('onClose')">Quay lại</v-btn>
    </template>
  </custom-form>
  <v-dialog v-model="showHistory">
    <history :id="props.id" @on-close="showHistory = false"></history>
  </v-dialog>
</template>
<script setup lang="ts">
import * as yup from 'yup';
import { SubmitEventPromise } from 'vuetify';
import { useUserStore } from '~/stores/user';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const props = defineProps<{
  id: string;
}>();

const userStore = useUserStore();
const { current } = storeToRefs(userStore);

const showImages = ref(false);
const showHistory = ref(false);

const { handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      name: yup.string(),
      phone: yup.string(),
      email: yup.string().email('Sai định dạng email'),
      address: yup.string(),
      authStatus: yup.string(),
    }),
  ),
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const name = defineComponentBinds('name', validateConfig);
const phone = defineComponentBinds('phone', validateConfig);
const email = defineComponentBinds('email', validateConfig);
const address = defineComponentBinds('address', validateConfig);
const authStatus = defineComponentBinds('authStatus', validateConfig);

onMounted(async () => {
  await userStore.getUserById(props.id);
});

watch(
  () => userStore.current,
  () => {
    setFieldValue('name', current.value?.name);
    setFieldValue('phone', current.value?.phone);
    setFieldValue('email', current.value?.user_email);
    setFieldValue('address', current.value?.address);
  },
);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    emit('onClose');
  })();
};

const handleShowImages = async () => {
  showImages.value = true;
};
</script>
