<template>
  <v-layout>
    <v-container class="d-flex align-center justify-center">
      <v-row align="center" justify="center">
        <v-col cols="md-4">
          <v-card>
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
  </v-layout>

</template>
<script setup lang="ts">
</script>
