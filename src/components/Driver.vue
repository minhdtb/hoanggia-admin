<template>
  <custom-form title="Thông tin lái xe" @submit="onSubmit">
    <template #content>
      <v-row>
        <v-col>
          <custom-form-field label="Họ tên">
            <v-text-field v-bind="name" disabled></v-text-field>
          </custom-form-field>
          <custom-form-field label="Số điện thoại">
            <v-text-field v-bind="phone" disabled></v-text-field>
          </custom-form-field>
          <custom-form-field label="Email">
            <v-text-field v-bind="email" disabled></v-text-field>
          </custom-form-field>
          <custom-form-field label="Địa chỉ">
            <v-text-field v-bind="address" disabled></v-text-field>
          </custom-form-field>
          <custom-form-field label="Trạng thái">
            <driver-status-select v-bind="authStatus"></driver-status-select>
          </custom-form-field>
        </v-col>
        <v-col>
          <custom-form-field label="Avatar">
            <div>
              <v-avatar size="x-large">
                <v-img :src="current?.avatar"></v-img>
              </v-avatar>
            </div>
          </custom-form-field>
          <custom-form-field label="Ngày đăng ký">
            <div class="pa-1">{{ $moment(current?.created).format('DD/MM/YYYY HH:mm') }}</div>
          </custom-form-field>
          <custom-form-field label="Tọa độ hiện tại">
            <div>
              <a
                target="_blank"
                :href="`https://www.google.com/search?q=${current?.lat},${current?.lon}`"
                class="pa-1"
                >{{ current?.lat }} , {{ current?.lon }}</a
              >
            </div>
          </custom-form-field>
          <custom-form-field label="Trạng thái phục vụ">
            <div class="pa-1">
              <v-chip :color="driveStatusText(current?.driveStatus ?? '')?.color"
                >{{ driveStatusText(current?.driveStatus ?? '')?.text }}
              </v-chip>
            </div>
          </custom-form-field>
          <custom-form-field label="Trạng thái hoạt động">
            <div>
              <v-chip :color="activeStatusText(current?.activeStatus ?? '')?.color"
                >{{ activeStatusText(current?.activeStatus ?? '')?.text }}
              </v-chip>
            </div>
          </custom-form-field>
          <custom-form-field label="Tài khoản">
            <div>{{ new Intl.NumberFormat('vi-VN').format(current?.balance ?? 0) }} VNĐ</div>
          </custom-form-field>
          <div class="pt-14">
            <v-btn class="mr-2" variant="elevated" color="blue" @click="handleShowImages"
              >Xem hồ sơ
            </v-btn>
            <v-btn class="mr-2" variant="elevated" color="orange" @click="handleShowHistory"
              >Xem lịch sử
            </v-btn>
            <v-btn variant="elevated" color="red">Nạp tiền</v-btn>
          </div>
        </v-col>
      </v-row>
      <v-dialog v-model="showImages">
        <v-carousel cycle color="white" height="700px">
          <v-carousel-item>
            <v-sheet height="100%">
              <v-img :src="current?.nidFront">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </v-sheet>
          </v-carousel-item>
          <v-carousel-item>
            <v-sheet height="100%">
              <v-img :src="current?.nidBack">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </v-sheet>
          </v-carousel-item>
          <v-carousel-item>
            <v-sheet height="100%">
              <v-img :src="current?.driverLicenseFront">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </v-sheet>
          </v-carousel-item>
          <v-carousel-item>
            <v-sheet height="100%">
              <v-img :src="current?.driverLicenseBack">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </v-sheet>
          </v-carousel-item>
          <v-carousel-item>
            <v-sheet height="100%">
              <v-img :src="current?.judicialRecord">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-dialog>
    </template>
    <template #actions>
      <v-btn variant="elevated" @click="emit('onClose')">Quay lại</v-btn>
      <v-btn variant="elevated" color="blue" type="submit" :disabled="isValidating || isSubmitting">
        Lưu
      </v-btn>
    </template>
  </custom-form>
  <v-dialog v-model="showHistory">
    <history :id="props.id" @on-close="showHistory = false"></history>
  </v-dialog>
</template>
<script setup lang="ts">
import * as yup from 'yup';
import { SubmitEventPromise } from 'vuetify';
import { useDriverStore } from '~/stores/driver';
import { activeStatusText, driveStatusText } from '~/utils/helper';

const emit = defineEmits<{
  (eventName: 'onClose'): void;
}>();

const props = defineProps<{
  id: string;
}>();

const driverStore = useDriverStore();
const { current } = storeToRefs(driverStore);

const showImages = ref(false);
const showHistory = ref(false);

const { handleSubmit, defineComponentBinds, isValidating, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    yup.object().shape({
      name: yup.string(),
      phone: yup.string(),
      email: yup.string().email('Sai định dạng email'),
      address: yup.string(),
      authStatus: yup.string(),
    }),
  ),
});

const validateConfig = (state: any) => ({
  props: {
    'error-messages': state.errors,
  },
});

const name = defineComponentBinds('name', validateConfig);
const phone = defineComponentBinds('phone', validateConfig);
const email = defineComponentBinds('email', validateConfig);
const address = defineComponentBinds('address', validateConfig);
const authStatus = defineComponentBinds('authStatus', validateConfig);

onMounted(async () => {
  await driverStore.getDriverById(props.id);
});

watch(
  () => driverStore.current,
  () => {
    setFieldValue('name', current.value?.name);
    setFieldValue('phone', current.value?.phone);
    setFieldValue('email', current.value?.user_email);
    setFieldValue('address', current.value?.address);
    setFieldValue('authStatus', current.value?.authStatus);
  },
);

const onSubmit = (e: SubmitEventPromise) => {
  e.preventDefault();
  handleSubmit(async (values) => {
    await driverStore.updateDriver(props.id, values);
    emit('onClose');
  })();
};

const handleShowImages = async () => {
  showImages.value = true;
};

const handleShowHistory = async () => {
  showHistory.value = true;
};
</script>
