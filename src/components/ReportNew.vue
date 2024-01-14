<template>
  <custom-form title="Thêm báo cáo" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <div class="d-flex flex-row" style="width: 100%">
            <custom-form-field label="Ngày bắt đầu">
              <v-text-field v-bind="from" type="date"></v-text-field>
            </custom-form-field>
          </div>
          <div class="d-flex flex-row" style="width: 100%">
            <custom-form-field label="Ngày kết thúc">
              <v-text-field v-bind="to" type="date"></v-text-field>
            </custom-form-field>
          </div>
          <custom-form-field label="Loại báo cáo">
            <report-type-select v-bind="type"></report-type-select>
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
import {useReportStore, Report} from '~/stores/report';
import moment from 'moment';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const reportStore = useReportStore();

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      from: yup.date().required('Hãy nhập ngày bắt đầu'),
      to: yup.date().required('Hãy nhập ngày kết thúc').min(
        yup.ref('from'),
        "Ngày kết thúc phải lớn hơn ngày bắt đầu"
      ),
      type: yup.string().required('Hãy chọn loại báo cáo'),
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
