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
          <v-btn variant="elevated" color="blue" type="submit" :disabled="isValidating || isSubmitting">
            Chấp nhận
          </v-btn>
          <v-btn variant="elevated" color="error" @click="onChangePassword">Đổi mật khẩu</v-btn>
        </template>
      </custom-form>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import * as yup from "yup";
import {SubmitEventPromise} from "vuetify";

useHead({
  title: `Hoang Gia Driver - Thông tin cá nhân`,
});

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
});

const pb = usePb();
const isAdmin = computed(() => pb.authStore.isAdmin);


const {handleSubmit, defineComponentBinds, isValidating, isSubmitting} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      fullName: yup.string(),
      user_email: yup.string().email(),
    }),
  ),
  initialValues: {
    fullName: isAdmin.value ? 'Administrator' : pb.authStore.model?.fullName,
    user_email: pb.authStore.model?.user_email,
  }
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const fullName = defineComponentBinds('fullName', validateConfig);
const email = defineComponentBinds('user_email', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    if (pb.authStore.model?.id) {
      if (isAdmin.value) {
        await pb.admins.update(pb.authStore.model?.id, values)
      } else {
        await pb.collection('staff').update(pb.authStore.model?.id, values)
      }
    }
  })();
};

const onChangePassword = async () => {
  //
};

</script>
