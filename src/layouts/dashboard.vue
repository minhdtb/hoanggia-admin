<template>
  <v-layout>
    <v-navigation-drawer permanent :rail="toggleNav" @click="toggleNav = false" color="blue">
      <template v-slot:prepend>
        <v-list nav>
          <v-list-item
            :prepend-avatar="`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${name}`"
            :title="name"
            nav
          >
            <template v-slot:append>
              <v-btn
                variant="text"
                icon="mdi-chevron-left"
                @click.stop="toggleNav = !toggleNav"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </template>
      <v-list v-if="isAdmin || isOperator">
        <v-list-subheader class="text-white">Cuốc xe</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-ray-start-arrow"
          to="/booking/list"
        >
          <v-badge v-if="bookingCount > 0" :content="bookingCount" color="red">
            Đang hoạt động
          </v-badge>
          <span v-else>Đang hoạt động</span>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-clock-start"
          title="Lịch sử"
          to="/booking/history"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="isAdmin">
        <v-list-subheader class="text-white">Khách hàng</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-account"
          title="Danh sách KH"
          to="/customer/list"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="isAdmin || isOperator">
        <v-list-subheader class="text-white">Lái xe</v-list-subheader>

        <v-list-item
          prepend-icon="mdi-account-tie-hat"
          to="/driver/waiting"
        >
          <v-badge v-if="driverCount > 0" :content="driverCount" color="red">
            Đang chờ duyệt
          </v-badge>
          <span v-else>Đang chờ duyệt</span>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-account-tie-hat"
          title="Danh sách lái xe"
          to="/driver/list"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="isAdmin || isAccountant">
        <v-list-subheader class="text-white">Khuyến mại</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-ticket"
          title="Danh sách KM"
          to="/discount/list"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-ticket" title="Đã sử dụng" to="/discount/use"></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="isAdmin || isAccountant">
        <v-list-subheader class="text-white">Giao dịch</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-cash"
          to="/transaction/waiting"
        >
          <v-badge v-if="transactionCount > 0" :content="transactionCount" color="red">
            Đang chờ duyệt
          </v-badge>
          <span v-else>Đang chờ duyệt</span>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-cash-check"
          title="Nạp tiền"
          to="/transaction/deposit"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cash-check"
          title="Khấu trừ"
          to="/transaction/withdrawal"
        ></v-list-item>
      </v-list>
      <v-divider v-if="isAdmin || isAccountant"></v-divider>
      <v-list v-if="isAdmin || isAccountant">
        <v-list-subheader class="text-white">Báo cáo</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-table"
          title="Danh sách"
          to="/report/list"
        ></v-list-item>
      </v-list>
      <v-divider v-if="isAdmin || isAccountant"></v-divider>
      <v-list v-if="isAdmin || isAccountant">
        <v-list-item v-if="isAdmin" prepend-icon="mdi-account-multiple" title="Nhân viên"
                     to="/staff/list"></v-list-item>
        <v-list-item prepend-icon="mdi-cog" title="Cài đặt" to="/setting"></v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="onLogout" color="red">Đăng xuất</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <v-container class="pa-0" fluid>
        <slot/>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const pb = usePb();

const bookingCount = ref(0);
const driverCount = ref(0);
const transactionCount = ref(0);

(async () => {
  const res = await pb.collection('statistics').getOne('1');
  bookingCount.value = res.bookingCount;
  driverCount.value = res.driverCount;
  transactionCount.value = res.transactionCount;
})();

const {authUser, isAdmin, isOperator, isAccountant} = storeToRefs(authStore);

const name = computed(() => authUser.value?.email ? authUser.value?.email : authUser.value?.username);

const toggleNav = ref(false);

const onLogout = () => {
  authStore.logout();
};
</script>
