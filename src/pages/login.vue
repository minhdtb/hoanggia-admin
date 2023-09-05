<template>
  <v-container class="fill-height">
    <v-row class="d-flex flex-row justify-center">
      <v-col cols="md-4">
        <v-card class="pa-4">
          <v-form>
            <v-card-item>
              <v-text-field label="Email" type="text"></v-text-field>
            </v-card-item>
            <v-card-item>
              <v-text-field label="Mật khẩu" type="password"></v-text-field>
            </v-card-item>
            <v-card-actions>
              <v-btn width="100%" color="blue" variant="elevated">Đăng nhập</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'public',
});
</script>
