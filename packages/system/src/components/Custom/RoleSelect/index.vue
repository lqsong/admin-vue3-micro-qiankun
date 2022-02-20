<script lang="ts">
/**
 * 角色下拉 - 异步获取数据
 * @author LiQingSong
 * 
 * */
import { computed, defineComponent, PropType, ref } from "vue";
import { queryList } from "./service";
import { OptionItem } from "./data.d";
export default defineComponent({
  name: 'RoleSelect',
  props: {
      placeholder: {
          type: String,
          default: '请选择'
      },
      clearable: {
          type: Boolean,
          default: true
      },
      multiple: {//多选
          type: Boolean,
          default: false
      }, 
      modelValue: {
          required: true
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
    const value = computed<any>({
          get: () => props.modelValue,
          set: val => {
              emit('update:modelValue', val);
          }
    });

    const optionsLoading = ref<boolean>(false)
    const options = ref<OptionItem[]>([])
    const getOptions = computed<OptionItem[]>(()=> options.value.length > 0 ? options.value : props.defaultOptions)
    const getOptionList = (): void => {
        optionsLoading.value = true;
        queryList().then(res => {  
            const { code, data } = res;      
            if(code === 0 ) {
                const arr = data || [];

                options.value = arr.map(item => {
                    return {
                        value: item.id,
                        label: item.name
                    };
                });
                optionsLoading.value = false;
            }
        }).catch(err => {                       
            console.log(err);
        });
    }

    // select 下拉框 显示/隐藏 调用
    const visibleChange = (v) => {
        if(!v){
            return false;
        }
        if(options.value.length > 0) {
            return false;
        }
        getOptionList();
    }

    
    return {
       value,
       optionsLoading,
       getOptions,
       visibleChange
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
        @visible-change="visibleChange">
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
