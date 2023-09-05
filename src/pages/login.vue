<template>
  <v-layout>
    <v-container>
      <v-col cols="4">
        <v-card>
          <v-card-title>Đăng nhập vào admin</v-card-title>
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
    </v-container>
  </v-layout>

</template>
<script setup lang="ts">
</script>
