<script lang="ts">
/**
 * 标签搜索下拉 - 异步获取数据
 * @author LiQingSong
 * 
 * */
import { computed, defineComponent, PropType, ref } from "vue";
import { queryList } from "./service";
import { OptionItem } from "./data.d";
export default defineComponent({
  name: 'TagSelect',
  props: {
      placeholder: {
          type: String,
          default: '请搜索选择'
      },
      clearable: {
          type: Boolean,
          default: true
      },
      multiple: {//多选
          type: Boolean,
          default: true
      }, 
      modelValue: {
          type: Array as PropType<string[]>,
          default: () => {
            return []
          }
      },
      /** 
       * 此参数 为编辑页面用到的时候 设置
       * 数据格式: [{value:1,label:'文字'}]
       */
      defaultOptions: {
          type: Array as PropType<OptionItem[]>,
          default: () =>  {
            return [];
          } 
      },
  },
  setup(props, { emit }) {


    // 数据值
    const value = computed<string[]>({
          get: () => props.modelValue,
          set: val => {
              emit('update:modelValue', val);
          }
    });

    const optionsLoading = ref<boolean>(false)
    const options = ref<OptionItem[]>([])
    const getOptions = computed<OptionItem[]>(()=> options.value.length > 0 ? options.value : props.defaultOptions)
    const remoteMethod = (query: string): void => {
        if (query !== '') {
            optionsLoading.value = true;
            queryList(query).then(res => {  
                const { code, data } = res;      
                if(code === 0 ) {
                    const arr = data || [];

                    options.value = arr.map(item => {
                        return {
                            // value: item.id,
                            value: item.name,
                            label: item.name
                        };
                    });
                    optionsLoading.value = false;
                }
            }).catch(err => {                       
                console.log(err);
            });
        } else {
          options.value = [];
        }

    }

    
    return {
       value,
       optionsLoading,
       getOptions,
       remoteMethod
    }

  }
})
</script>
<template>
    <el-select 
        :loading="optionsLoading"
        :multiple="multiple"       
        :placeholder="placeholder"
        :clearable="clearable"
        v-model="value"
        filterable
        remote
        reserve-keyword
        :remote-method="remoteMethod">
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
