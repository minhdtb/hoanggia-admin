<template>
  <v-autocomplete v-bind="$attrs"
                  :items="places"
                  @update:search="searchTerm"
                  item-title="description"
                  no-filter
                  return-object></v-autocomplete>
</template>
<script setup lang="ts">

import {HANOI_LOCATION} from "~/utils/types";

const props = defineProps<{
  sessionToken: string;
}>();

const goong = useGoong()
const appConfig = useAppConfig()
const places = ref([])

const searchTerm = (value: string) => {
  if (!value) return false
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
}

</script>
