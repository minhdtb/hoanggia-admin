<template>
  <custom-form title="Thông tin khuyến mại" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Tiêu đề khuyến mại">
            <v-text-field v-bind="title"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Số lượng">
            <v-text-field type="number" v-bind="count"></v-text-field>
          </custom-form-field>
          <custom-form-field label="Giảm giá">
            <div class="d-flex">
              <v-text-field type="number" v-bind="discount"></v-text-field>
              <discount-discount-type-select v-bind="discountType"></discount-discount-type-select>
            </div>
          </custom-form-field>
          <custom-form-field label="Trạng thái">
            <discount-status-select v-bind="status"></discount-status-select>
          </custom-form-field>
        </v-col>
        <v-col>
          <div class="d-flex flex-row" style="width: 100%">
            <custom-form-field label="Ngày bắt đầu">
              <v-text-field v-bind="dateStart" type="date"></v-text-field>
            </custom-form-field>
            <custom-form-field label="Thời gian bắt đầu">
              <v-text-field v-bind="timeStart"></v-text-field>
            </custom-form-field>
          </div>
          <div class="d-flex flex-row" style="width: 100%">
            <custom-form-field label="Ngày kết thúc">
              <v-text-field v-bind="dateEnd" type="date"></v-text-field>
            </custom-form-field>
            <custom-form-field label="Thời gian kết thúc">
              <v-text-field v-bind="timeEnd"></v-text-field>
            </custom-form-field>
          </div>
          <custom-form-field label="Loại người dùng">
            <discount-user-type-select v-bind="userType"></discount-user-type-select>
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
import { SubmitEventPromise } from 'vuetify';
import { useDiscountStore } from '~/stores/discount';
import moment from 'moment';
import DiscountUserTypeSelect from '~/components/DiscountUserTypeSelect.vue';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const discountStore = useDiscountStore();

const { handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      title: yup.string().required('Hãy nhập tiêu đề khuyến mại'),
      content: yup.string(),
      count: yup.number().typeError('Hãy nhập số lượng').required('Hãy nhâp số lượng'),
      discount: yup.number().typeError('Hãy nhập giảm giá').required('Hãy nhập giảm giá'),
      discountType: yup.string().required('Hãy chọn loại giảm giá'),
      userType: yup.string().required('Hãy chọn loại người dùng'),
      dateStart: yup.string().required('Hãy nhập ngày bắt đầu'),
      timeStart: yup.string().required('Hãy nhập thời gian bắt đầu'),
      dateEnd: yup.string().required('Hãy nhập ngày kết thúc'),
      timeEnd: yup.string().required('Hãy nhập thời gian kết thúc'),
      userId: yup.string(),
      status: yup.string().required('Hãy chọn trạng thái'),
    }),
  ),
  initialValues: {
    timeStart: '00:00',
    timeEnd: '23:59',
  },
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const title = defineComponentBinds('title', validateConfig);
const count = defineComponentBinds('count', validateConfig);
const discount = defineComponentBinds('discount', validateConfig);
const discountType = defineComponentBinds('discountType', validateConfig);
const userType = defineComponentBinds('userType', validateConfig);
const dateStart = defineComponentBinds('dateStart', validateConfig);
const timeStart = defineComponentBinds('timeStart', validateConfig);
const dateEnd = defineComponentBinds('dateEnd', validateConfig);
const timeEnd = defineComponentBinds('timeEnd', validateConfig);
const status = defineComponentBinds('status', validateConfig);
const userId = defineComponentBinds('userId', validateConfig);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    const discount: Discount = {
      ...values,
      validStart: moment(`${values.dateStart} ${values.timeStart}`, 'YYYY-MM-DD HH:mm')
        .set('seconds', 0)
        .toDate(),
      validEnd: moment(`${values.dateEnd} ${values.timeEnd}`, 'YYYY-MM-DD HH:mm')
        .set('seconds', 0)
        .toDate(),
      type: 'Fixed',
    };
    await discountStore.create(discount);
    emit('onClose');
  })();
};
</script>
