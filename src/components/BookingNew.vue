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
          <custom-form-field label="Lái xe">
            <v-text-field v-bind="driverId" readonly class="d-none"></v-text-field>
            <v-text-field
              v-bind="driverName"
              readonly
              append-icon="mdi-plus"
              @click="onAdd"
              @click:append="onAdd"
            ></v-text-field>
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
  <v-dialog v-model="showAvailable" width="900">
    <driver-available-list @onAccept="handleAccept"></driver-available-list>
  </v-dialog>
</template>
<script setup lang="ts">
import * as yup from 'yup';
import {SubmitEventPromise} from 'vuetify';
import {v4 as uuidv4} from 'uuid';
import {vMaska} from "maska"
import _ from 'lodash';
import moment from "moment";
import DriverAvailableList from "~/components/DriverAvailableList.vue";
import {Driver} from "~/stores/driver";

const sessionToken = ref(uuidv4())
const showAvailable = ref(false);

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
      distance: yup.number().required('Hãy nhập quãng đường'),
      driverId: yup.string(),
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
const driverId = defineComponentBinds('driverId', validateConfig);
const driverName = defineComponentBinds('driverName', validateConfig);

const cFrom = ref<string | undefined>(undefined)
const cTo = ref<string | undefined>(undefined)
const selectedUserId = ref<string>('')

watch([from, to], (newValues: Array<any>): void => {
  if (newValues[0]?.modelValue?.place_id && newValues[1]?.modelValue?.place_id) {
    cFrom.value = newValues[0].modelValue.place_id as string
    cTo.value = newValues[1].modelValue.place_id as string
  }
})

watch([cFrom, cTo], (): void => {
  clearTimeout(timer1Id.value)
  timer1Id.value = setTimeout(() => {
    goong.get('/Direction', {
      params: {
        api_key: appConfig.backend.goongAPIKey,
        origin: (from.value as any).modelValue.geometry.location.lat + ',' + (from.value as any).modelValue.geometry.location.lng,
        destination: (to.value as any).modelValue.geometry.location.lat + ',' + (to.value as any).modelValue.geometry.location.lng,
        vehicle: 'car',
      }
    }).then(res => {
      const distance = _.sumBy(res.data.routes[0].legs, (it: any) => it.distance.value)
      setFieldValue('distance', distance / 1000)
    })
  }, 200)
})

watch(pickupDate, (newValue: any, oldValue: any): void => {
  if (newValue?.modelValue && newValue?.modelValue !== oldValue?.modelValue
    && newValue?.modelValue.length === 5 && (distance.value as any).modelValue) {
    clearTimeout(timer2Id.value)
    timer2Id.value = setTimeout(async () => {
      const timeString = newValue?.modelValue
      const regex = new RegExp(/^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/g)
      if (regex.test(timeString)) {
        const values = newValue?.modelValue.split(':')
        const hour = parseInt(values[0])
        const minute = parseInt(values[1])
        const date = moment(new Date()).set('hour', hour).set('minute', minute)
          .format("YYYY-MM-DDTHH:mm:ss.SSS")
        const price = await bookingStore.getBookingFee(date, (distance.value as any).modelValue * 1000)
        setFieldValue('fee', price)
      }
    }, 200)
  }
})

watch(user, (value: any) => {
  if (value?.modelValue) {
    selectedUserId.value = value?.modelValue?.id
  }
})

const handleAccept = (item: Driver) => {
  setFieldValue('driverName', `${item.name} (${item.id})`);
  setFieldValue('driverId', item.id);
  showAvailable.value = false;
};

const onAdd = () => {
  showAvailable.value = true;
};

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    emit('onClose');
  })();
};
</script>
