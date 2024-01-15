<template>
  <custom-form title="Thêm báo cáo" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Loại báo cáo">
            <report-type-select v-bind="type"></report-type-select>
          </custom-form-field>
          <div v-if="values.type === 0" class="d-flex flex-row" style="width: 100%">
            <custom-form-field label="Ngày bắt đầu">
              <v-text-field v-bind="from" type="date"></v-text-field>
            </custom-form-field>
          </div>
          <div v-if="values.type === 0" class="d-flex flex-row" style="width: 100%">
            <custom-form-field label="Ngày kết thúc">
              <v-text-field v-bind="to" type="date"></v-text-field>
            </custom-form-field>
          </div>
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
import {DateSchema} from "yup";

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const reportStore = useReportStore();

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
