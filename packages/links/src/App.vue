<template>
    <a-config-provider :locale="antdLocales">
      <router-view></router-view>
    </a-config-provider>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { antdMessages } from "@/config/i18n";
const { locale } = useI18n();
const antdLocales = computed(()=> antdMessages[locale.value]);
</script>
