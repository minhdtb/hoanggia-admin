<template>
  <v-layout>
    <v-navigation-drawer permanent :rail="toggleNav" @click="toggleNav = false" color="blue">
      <v-list nav>
        <v-list-item
          prepend-avatar="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=admin"
          :title="(authUser as any)?.email"
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
      <v-list>
        <v-list-subheader class="text-white">Cuốc xe</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-ray-start-arrow"
          title="Đang hoạt động"
          to="/booking/list"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-clock-start"
          title="Lịch sử"
          to="/booking/history"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-subheader class="text-white">Khách hàng</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-account"
          title="Danh sách KH"
          to="/customer/list"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-subheader class="text-white">Lái xe</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-account-tie-hat"
          title="Đang chờ duyệt"
          to="/driver/waiting"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-tie-hat"
          title="Danh sách lái xe"
          to="/driver/list"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-subheader class="text-white">Khuyến mại</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-ticket"
          title="Danh sách KM"
          to="/discount/list"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-ticket" title="Đã sử dụng" to="/discount/use"></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-subheader class="text-white">Giao dịch</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-cash"
          title="Đang chờ duyệt"
          to="/transaction/waiting"
        ></v-list-item>
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
      <v-divider></v-divider>
      <v-list>
        <v-list-subheader class="text-white">Báo cáo</v-list-subheader>
        <v-list-item
            prepend-icon="mdi-table"
            title="Danh sách"
            to="/report/list"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
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
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const { authUser } = storeToRefs(authStore);

const toggleNav = ref(false);

const onLogout = () => {
  authStore.logout();
};
</script>
