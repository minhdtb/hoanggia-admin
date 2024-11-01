<template>
  <v-row>
    <v-col cols="6">
      <custom-form title="Gửi thông báo" @submit="onSubmit">
        <template #content>
          <custom-form-field label="Gửi đến">
            <v-select v-bind="type" :items="typeList" item-title="text" item-value="value"></v-select>
          </custom-form-field>
          <custom-form-field label="Tiêu đề">
            <v-text-field v-bind="title"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Nội dung">
            <v-textarea v-bind="message"></v-textarea>
          </custom-form-field>
        </template>
        <template #actions>
          <v-btn variant="elevated" @click="$router.go(-1)">Quay lại</v-btn>
          <v-btn variant="elevated" color="blue" type="submit" :disabled="isValidating || isSubmitting">
            Lưu
          </v-btn>
        </template>
      </custom-form>
    </v-col>
  </v-row>
  <v-snackbar v-model="success" color="green" multi-line>
    <v-icon icon="mdi-check-circle-outline"></v-icon>
    Gửi thông báo thành công
  </v-snackbar>
  <v-snackbar v-model="error">
    {{ errorMessage }}
    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="error = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>
<script setup lang="ts">
import * as yup from "yup";
import {SubmitEventPromise} from "vuetify";


useHead({
  title: `Hoang Gia Driver - Gửi thông báo`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const router = useRouter()

const pb = usePb();

const typeList = [
  {
    text: 'Khách hàng',
    value: 'Booking',
  },
  {
    text: 'Tài xế',
    value: 'Driver',
  },
  {
    text: 'Tất cả',
    value: 'All',
  },
]

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      title: yup.string().required('Vui lòng nhập tiêu đề thông báo'),
      message: yup.string().required('Vui lòng nhập nội dung thông báo'),
      type: yup.string().required('Vui lòng chọn đối tượng nhận thông báo'),
    }),
  )
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const title = defineComponentBinds('title', validateConfig);
const message = defineComponentBinds('message', validateConfig);
const type = defineComponentBinds('type', validateConfig);

const success = ref(false);
const error = ref(false);
const errorMessage = ref('');

watch(success, (value) => {
  if (value) {
    setTimeout(() => {
      success.value = false;
    }, 2000);
  }
});

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    try {
      await pb.collection('message').create(values)
      success.value = true;
      router.go(-1);
    } catch (e: any) {
      error.value = true;
      errorMessage.value = e.toString();
    } finally {
    }

  })();
};

</script>
