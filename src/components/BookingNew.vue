<template>
  <custom-form title="Tạo cuốc xe" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Điểm đón">
            <search-place-input :session-token="uuidv4()" v-model="test"></search-place-input>
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
<script setup lang="ts">
import * as yup from 'yup';
import {SubmitEventPromise} from 'vuetify';
import {Report, useReportStore} from '~/stores/report';
import moment from 'moment';
import SearchPlaceInput from "~/components/SearchPlaceInput.vue";
import {v4 as uuidv4} from 'uuid';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const reportStore = useReportStore();

const test = ref(null)

watch(test, (value) => {
  console.log(value)

});

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting, values} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      type: yup.number().required('Hãy chọn loại báo cáo'),
      from: yup.date().when('type', ([type], sch: any) => {
        return type === 0 ? sch.required('Hãy nhập ngày bắt đầu') : undefined;
      }),
      to: yup.date().when('type', ([type], sch: any) => {
        return type === 0 ? sch.required('Hãy nhập ngày kết thúc').min(
          yup.ref('from'),
          "Ngày kết thúc phải lớn hơn ngày bắt đầu"
        ) : undefined;
      }),
    }),
  )
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const from = defineComponentBinds('from', validateConfig);
const to = defineComponentBinds('to', validateConfig);
const type = defineComponentBinds('type', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    const report: Report = {
      ...values,
      from: moment(values.from, 'YYYY-MM-DD').toDate(),
      to: moment(values.to, 'YYYY-MM-DD').toDate(),
      status: 'Waiting',
    };

    await reportStore.create(report);
    emit('onClose');
  })();
};
</script>
