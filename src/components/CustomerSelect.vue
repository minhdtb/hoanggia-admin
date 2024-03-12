<template>
  <v-autocomplete v-model="selectUser"
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
      <v-list-item title="Tạo mới" @click="newCustomer">
      </v-list-item>

    </template>
  </v-autocomplete>
</template>
<script lang="ts" setup>
const userStore = useUserStore()
const {userList} = storeToRefs(userStore);

const selectUser = ref(undefined)
const model = defineModel()

const clearSearch = () => {
  model.value = undefined
}

const searchTerm = async (value: string) => {
  await userStore.list(undefined, `(name ~ "${value ?? ''}" || phone ~ "${value ?? ''}")`)
}

const newCustomer = () => {
  console.log('xxx')
}
</script>
