<template>
  <v-layout>
    <v-navigation-drawer permanent :rail="toggleNav" @click="toggleNav = false">
      <v-list nav>
        <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
            title="John Leider"
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
        <v-list-item prepend-icon="mdi-account" title="Khách hàng" value="inbox" :active="true"></v-list-item>
        <v-list-item prepend-icon="mdi-account-hard-hat-outline" title="Tài xế" value="supervisors"></v-list-item>
        <v-list-item prepend-icon="mdi-clock-start" title="Clock-in" value="clockin"></v-list-item>
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
import {MenuLink} from '~/utils/types';


const authStore = useAuthStore();

const toggleNav = ref(false);


const onLogout = () => {
  authStore.logout();
};

const dashboard: MenuLink[] = [
  {
    title: 'Người dùng',
    children: [
      {
        title: 'Danh sách người dùng',
      }
    ]
  }
];
</script>

<style lang="scss" scoped>
.menu::-webkit-scrollbar {
  display: none;
}

.v-main_background {
  background-color: #dfe6f3;
}
</style>
