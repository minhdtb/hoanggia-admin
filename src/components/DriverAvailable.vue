<template>
  <v-text-field
    v-bind="$attrs"
    readonly
    v-model="driverList"
    append-icon="mdi-plus"
    @click="onAdd"
    @click:append="onAdd"
  ></v-text-field>
  <v-dialog v-model="showAvailable" width="900">
    <driver-available-list @on-accept="handleAccept"></driver-available-list>
  </v-dialog>
</template>
<script lang="ts" setup>
import {Driver} from "~/stores/driver";

const showAvailable = ref(false);
const driverList = ref('');

const model = defineModel<string[]>({
  default: []
})

const handleAccept = (items: Driver[]) => {
  driverList.value = items.map(it => it.name).join(',')
  model.value = items.map(it => it.id ?? '')
  showAvailable.value = false;
};

const onAdd = () => {
  showAvailable.value = true;
};
</script>
