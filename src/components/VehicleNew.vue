<template>
  <custom-form title="Thêm xe" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Biển số xe">
            <v-text-field v-bind="name"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Hãng xe">
            <v-text-field v-bind="brand"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Loại xe">
            <v-select v-bind="type" :items="vehicleTypes"></v-select>
          </custom-form-field>
        </v-col>
      </v-row>
    </template>
    <template #actions>
      <v-btn variant="elevated" color="blue" type="submit" :disabled="isValidating || isSubmitting"
      >Lưu
      </v-btn>
    </template>
  </custom-form>
</template>
<script lang="ts" setup>
import * as yup from "yup";
import {SubmitEventPromise} from "vuetify";

const emit = defineEmits<{
  (eventName: 'onSubmit', values: any): void;
}>();

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting, values} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      name: yup.string().required('Hãy nhập biển số xe'),
      brand: yup.string().required('Hãy nhập hãng xe'),
      type: yup.string().required('Hãy nhập loại xe'),
    }),
  ),
  initialValues: {
    type: 'AT'
  }
});

const vehicleTypes = ['AT', 'MT']

const validateConfig = (state: any) => {
  return {
    props: {
      'error-messages': state.errors,
    },
  }
};

const name = defineComponentBinds('name', validateConfig);
const brand = defineComponentBinds('brand', validateConfig);
const type = defineComponentBinds('type', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    emit('onSubmit', values);
  })();
};
</script>
