<template>
  <custom-form title="Tạo cuốc xe" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Điểm đón">
            <search-place-input :session-token="sessionToken" v-bind="from"></search-place-input>
          </custom-form-field>
          <custom-form-field label="Điểm đến">
            <search-place-input :session-token="sessionToken" v-bind="to"></search-place-input>
          </custom-form-field>
          <custom-form-field label="Thời gian đón">
            <v-text-field placeholder="HH:MM" v-bind="pickupDate"></v-text-field>
          </custom-form-field>
          <v-row>
            <v-col>
              <custom-form-field label="Quãng đường">
                <v-text-field v-bind="distance" readonly suffix="KM"></v-text-field>
              </custom-form-field>
            </v-col>
            <v-col>
              <custom-form-field label="Cước phí">
                <v-text-field type="number" v-bind="fee" suffix="VND"></v-text-field>
              </custom-form-field>
            </v-col>
          </v-row>
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
import {v4 as uuidv4} from 'uuid';
import {HANOI_LOCATION} from "~/utils/types";

import * as _ from 'lodash';

const sessionToken = ref(uuidv4())

const goong = useGoong()
const appConfig = useAppConfig()

const emit = defineEmits<{
  (eventName: "onClose"): void;
}>();

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting, setValues} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      from: yup.object().required('Hãy nhập điểm đón'),
      to: yup.object().required('Hãy nhập điểm đến'),
      pickupDate: yup.string().required('Hãy nhập thời gian đón'),
      fee: yup.number().typeError('Hãy nhập đinh dạng số').required('Hãy nhập cước phí'),
      distance: yup.number().required('Hãy nhập quãng đường')
    }),
  )
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const timerId = ref<any>(undefined)

const from = defineComponentBinds('from', validateConfig);
const to = defineComponentBinds('to', validateConfig);
const pickupDate = defineComponentBinds('pickupDate', validateConfig);
const fee = defineComponentBinds('fee', validateConfig);
const distance = defineComponentBinds('distance', validateConfig);

const cFrom = ref<string | undefined>(undefined)
const cTo = ref<string | undefined>(undefined)

watch([from, to], (newValues: Array<any>, oldValues: Array<any>): void => {
  if (newValues[0]?.modelValue?.place_id && newValues[1]?.modelValue?.place_id) {
    cFrom.value = newValues[0].modelValue.place_id as string
    cTo.value = newValues[1].modelValue.place_id as string
  }
})

watch([cFrom, cTo], (newValues, oldValues): void => {
  clearTimeout(timerId.value)
  timerId.value = setTimeout(() => {
    goong.get('/Direction', {
      params: {
        api_key: appConfig.backend.goongAPIKey,
        origin: (from.value as any).modelValue.geometry.location.lat + ',' + (from.value as any).modelValue.geometry.location.lng,
        destination: (to.value as any).modelValue.geometry.location.lat + ',' + (to.value as any).modelValue.geometry.location.lng,
        vehicle: 'car',
      }
    }).then(res => {
      const distance = _.sumBy(res.data.routes[0].legs, (it: any) => it.distance.value)
      setValues({
        distance: distance / 1000
      })
    })
  }, 100)
})

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {

    emit('onClose');
  })();
};
</script>
