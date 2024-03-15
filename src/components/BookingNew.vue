<template>
  <custom-form title="Tạo cuốc xe" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Khách hàng">
            <customer-select v-bind="user"></customer-select>
          </custom-form-field>
          <custom-form-field label="Xe">
            <vehicle-select :user-id="selectedUserId" v-bind="vehicle"></vehicle-select>
          </custom-form-field>
          <custom-form-field label="Lái xe">
            <driver-available v-bind="driverIds"></driver-available>
          </custom-form-field>
        </v-col>
        <v-col>
          <custom-form-field label="Điểm đón">
            <search-place-input :session-token="sessionToken" v-bind="from"></search-place-input>
          </custom-form-field>
          <custom-form-field label="Điểm đến">
            <search-place-input :session-token="sessionToken" v-bind="to"></search-place-input>
          </custom-form-field>
          <custom-form-field label="Thời gian đón">
            <v-text-field v-maska:[options] placeholder="HH:MM" v-bind="pickupDate"></v-text-field>
          </custom-form-field>
          <v-row>
            <v-col>
              <custom-form-field label="Cước phí">
                <v-text-field type="number" v-bind="fee" suffix="VND"></v-text-field>
              </custom-form-field>
            </v-col>
            <v-col>
              <custom-form-field label="Quãng đường">
                <v-text-field v-bind="distance" readonly suffix="KM"></v-text-field>
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
import {vMaska} from "maska"
import _ from 'lodash';
import moment from "moment";
//@ts-ignore
import * as polyline from '@mapbox/polyline';

const sessionToken = ref(uuidv4())

const goong = useGoong()
const appConfig = useAppConfig()
const bookingStore = useBookingStore();

const emit = defineEmits<{
  (eventName: "onClose"): void;
}>();

const options = {mask: '##:##'};

const {handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue} = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      user: yup.object().required('Hãy chọn khách hàng'),
      vehicle: yup.object().required('Hãy chọn xe'),
      from: yup.object().required('Hãy nhập điểm đón'),
      to: yup.object().required('Hãy nhập điểm đến'),
      pickupDate: yup.string().required('Hãy nhập thời gian đón')
        .matches(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/g, 'Sai định dạng thời gian'),
      fee: yup.number().typeError('Hãy nhập đinh dạng số').required('Hãy nhập cước phí'),
      distance: yup.number(),
      driverIds: yup.array().of(yup.string()),
      driverName: yup.string(),
    }),
  )
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const timer1Id = ref<any>(undefined)
const timer2Id = ref<any>(undefined)

const user = defineComponentBinds('user', validateConfig);
const vehicle = defineComponentBinds('vehicle', validateConfig);
const from = defineComponentBinds('from', validateConfig);
const to = defineComponentBinds('to', validateConfig);
const pickupDate = defineComponentBinds('pickupDate', validateConfig);
const fee = defineComponentBinds('fee', validateConfig);
const distance = defineComponentBinds('distance', validateConfig);
const driverIds = defineComponentBinds('driverIds', validateConfig);

const {value: cFrom} = useField<any>('from');
const {value: cTo} = useField<any>('to');
const {value: cPickupDate} = useField<any>('pickupDate');
const {value: cDistance} = useField<any>('distance');

const selectedUserId = ref<string>('')

const directions = ref([])

const calculateDistance = (from: any, to: any) => {
  if (from && to) {
    clearTimeout(timer1Id.value)
    timer1Id.value = setTimeout(() => {
      goong.get('/Direction', {
        params: {
          api_key: appConfig.backend.goongAPIKey,
          origin: from.geometry.location.lat + ',' + from.geometry.location.lng,
          destination: to.geometry.location.lat + ',' + to.geometry.location.lng,
          vehicle: 'car',
        }
      }).then(res => {
        const distance = _.sumBy(res.data.routes[0].legs, (it: any) => it.distance.value)
        const points = polyline.decode(res.data.routes[0].overview_polyline?.points)
        directions.value = points.map((arr: number[]) => ({
          lat: arr[0],
          lng: arr[1]
        }))
        setFieldValue('distance', distance / 1000)
      })
    }, 200)
  }
}

const calculateFee = (distance?: number, pickupDate?: string) => {
  if (distance && pickupDate) {
    clearTimeout(timer2Id.value)
    timer2Id.value = setTimeout(async () => {
      const regex = new RegExp(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/g)
      if (regex.test(pickupDate)) {
        const values = pickupDate.split(':')
        const hour = parseInt(values[0])
        const minute = parseInt(values[1])
        const now = moment(new Date())
        let pickup = now.set('hour', hour).set('minute', minute)
        if (pickup.isBefore(now)) {
          pickup = pickup.add(1, 'days')
        }
        const date = pickup.format("YYYY-MM-DDTHH:mm:ss.SSS")
        const price = await bookingStore.getBookingFee(date, distance * 1000)
        setFieldValue('fee', price)
      }
    }, 200)
  }
}

watch([cFrom, cTo], (values) => {
  calculateDistance(values[0], values[1])
})

watch([cDistance, cPickupDate], (values) => {
  calculateFee(values[0], values[1])
})

watch(user, (value: any) => {
  if (value?.modelValue) {
    selectedUserId.value = value?.modelValue?.id
  }
})

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    await bookingStore.create(values, directions.value)
    emit('onClose');
  })();
};
</script>
