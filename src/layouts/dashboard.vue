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
        <v-divider></v-divider>
        <v-list-item
          prepend-icon="mdi-clock-start"
          title="Cuốc xe"
          to="/booking/list"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-cog" title="Cài đặt" to="/setting"></v-list-item>
        <v-list-item
          prepend-icon="mdi-account"
          title="Khách hàng"
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
        <v-list-subheader class="text-white">Giao dịch</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-cash"
          title="Đang chờ duyệt"
          to="/transaction/waiting"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cash-check"
          title="Danh sách giao dịch"
          to="/transaction/list"
        ></v-list-item>
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
