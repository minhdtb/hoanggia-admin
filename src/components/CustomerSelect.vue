<template>
  <v-autocomplete v-bind="$attrs"
                  v-model="selectUser"
                  :items="userList"
                  @update:search="searchTerm"
                  item-title="name"
                  @click:clear="clearSearch"
                  clearable
                  no-filter
                  return-object>
    <template v-slot:item="{ props, item }">
      <v-list-item
        v-bind="props"
        :title="`${item.raw.name} (${item.raw.phone})`"
      ></v-list-item>
    </template>
    <template v-slot:no-data>
      <v-list-item title="Tạo khách hàng mới" @click="newCustomer">
      </v-list-item>
    </template>
  </v-autocomplete>
  <v-dialog v-model="showCreateCustomer" width="800">
    <customer-new :initial-phone="searchValue" @on-submit="handleCustomerSubmit"></customer-new>
  </v-dialog>
</template>
<script lang="ts" setup>
const userStore = useUserStore()
const {userList} = storeToRefs(userStore);

const selectUser = ref(undefined)
const model = defineModel()
const showCreateCustomer = ref(false)
const searchValue = ref('')

const handleCustomerSubmit = (data: any) => {
  selectUser.value = data
  showCreateCustomer.value = false
}

const clearSearch = () => {
  model.value = undefined
}

watch(selectUser, (value) => {
  model.value = value
})

const searchTerm = async (value: string) => {
  searchValue.value = value
  await userStore.listAll(`(name ~ "${value ?? ''}" || phone ~ "${value ?? ''}")`)
}

const newCustomer = () => {
  showCreateCustomer.value = true
}
</script>
