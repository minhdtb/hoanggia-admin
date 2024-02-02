<template>
  <v-row>
    <v-col cols="6">
      <custom-form title="Thông tin cá nhân" @submit="onSubmit">
        <template #content>
          <custom-form-field label="Họ và tên">
            <v-text-field v-bind="fullName" :readonly="isAdmin"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Email">
            <v-text-field v-bind="email" :readonly="isAdmin"></v-text-field>
          </custom-form-field>
        </template>
        <template #actions>
          <v-btn variant="elevated" @click="$router.go(-1)">Quay lại</v-btn>
          <v-btn variant="elevated" color="blue" type="submit" :disabled="isValidating || isSubmitting || isAdmin">
            Lưu
          </v-btn>
          <v-btn variant="elevated" color="error" @click="onChangePassword">Đổi mật khẩu</v-btn>
        </template>
      </custom-form>
    </v-col>
  </v-row>
  <v-snackbar v-model="success" color="green" multi-line>
    <v-icon icon="mdi-check-circle-outline"></v-icon>
    Cập nhật thành công
  </v-snackbar>
  <v-dialog v-model="showChangePassword" width="600">
    <change-password @on-close="showChangePassword = false"></change-password>
  </v-dialog>
</template>
<script setup lang="ts">
import * as yup from "yup";
import {SubmitEventPromise} from "vuetify";
import DriverAvailableList from "~/components/DriverAvailableList.vue";

useHead({
  title: `Hoang Gia Driver - Thông tin cá nhân`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const pb = usePb();
const isAdmin = computed(() => pb.authStore.isAdmin);
const showChangePassword = ref(false);

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      fullName: yup.string(),
      user_email: yup.string().email(),
    }),
  ),
  initialValues: {
    fullName: isAdmin.value ? 'Administrator' : pb.authStore.model?.fullName,
    user_email: pb.authStore.model?.email ?? pb.authStore.model?.user_email,
  }
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const fullName = defineComponentBinds('fullName', validateConfig);
const email = defineComponentBinds('user_email', validateConfig);

const success = ref(false);

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
    if (pb.authStore.model?.id) {
      if (isAdmin.value) {
        await pb.admins.update(pb.authStore.model?.id, values)
      } else {
        await pb.collection('staff').update(pb.authStore.model?.id, values)
      }
      success.value = true;
    }
  })();
};

const onChangePassword = async () => {
  showChangePassword.value = true;
};

</script>
