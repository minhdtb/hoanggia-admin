<template>
  <v-autocomplete v-model="position"
                  :items="places"
                  @update:search="searchTerm"
                  item-title="description"
                  @click:clear="clearSearch"
                  clearable
                  no-filter
                  return-object></v-autocomplete>
</template>
<script lang="ts" setup>
const model = defineModel()

import {HANOI_LOCATION} from "~/utils/types";

const props = defineProps<{
  sessionToken: string;
}>();

const timerId = ref<any>(undefined);

const goong = useGoong()
const appConfig = useAppConfig()
const places = ref([])
const position = ref(undefined)

watch(position, async (value: any) => {
  if (value) {
    goong.get('/Place/Detail', {
      params: {
        api_key: appConfig.backend.goongAPIKey,
        sessiontoken: props.sessionToken,
        place_id: value.place_id
      }
    }).then(res => {
      model.value = res.data['result']
    })
  }
})

const clearSearch = () => {
  model.value = undefined
}

const searchTerm = (value: string) => {
  if (!value) return false
  clearTimeout(timerId.value)
  timerId.value = setTimeout(() => {
    goong.get('/Place/AutoComplete', {
      params: {
        api_key: appConfig.backend.goongAPIKey,
        location: HANOI_LOCATION,
        sessiontoken: props.sessionToken,
        input: value
      }
    }).then(res => {
      places.value = res.data.predictions
    })
  }, 500)
}

</script>
