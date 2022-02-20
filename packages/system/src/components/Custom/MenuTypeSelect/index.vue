<script lang="ts">
/**
 * 菜单类型下拉 
 * @author LiQingSong
 */
import { computed, defineComponent, ref } from "vue";
import { OptionItem } from "./data.d";
import { useI18n } from "vue-i18n";
export default defineComponent({
  name: 'MenuTypeSelect',
  props: {
      placeholder: {
          type: String,
          default: '请选择'
      },
      clearable: {
          type: Boolean,
          default: true
      },
      modelValue: {
          type: [Number, String],
          default: ''
      },
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    // 数据值
    const value = computed<number| string>({
          get: () => props.modelValue,
          set: val => {
              emit('update:modelValue', val);
          }
    });

    const optionsLoading = ref<boolean>(false)
    const options = ref<OptionItem[]>([
        {value: 1,label:t('components.custom.menutypeselect.text.menu')},
        {value: 2,label:t('components.custom.menutypeselect.text.button')}
    ])
    const getOptions = computed<OptionItem[]>(()=> options.value)
    

    
    return {
       value,
       optionsLoading,
       getOptions
    }

  }
})
</script>
<template>
    <el-select 
        :loading="optionsLoading"
        :placeholder="placeholder"
        :clearable="clearable"
        v-model="value"
        >
        <el-option
            v-for="item in getOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
    </el-select>
</template>
<style lang="scss" scoped>
</style>
