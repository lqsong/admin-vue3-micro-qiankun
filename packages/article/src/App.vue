<template>
  <el-config-provider :locale="elementPlusLocales">
    <router-view></router-view>
  </el-config-provider>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { elementPlusMessages } from "@/config/i18n";
const { locale } = useI18n();
const elementPlusLocales = computed(()=> elementPlusMessages[locale.value]);
</script>
