<script lang="ts">
/**
 * api 联动下拉 - 获取全部数据
 * @author LiQingSong
 */
import { computed, defineComponent, PropType, reactive, ref, watch, onMounted } from "vue";
import { queryList } from "./service";
import { formatEleUiLevelData, EleUiLevelData } from '@/utils/formatData';
export default defineComponent({
  name: 'ApiCascader',
  props: {
      // 编辑页面调用时用到此参数 
      isEdit: {
        type: Boolean,
        default: false
      },
      checkStrictly: {
        type: Boolean,
        default: false
      },
      separator: {
          type: String,
          default: '>'
      },
      placeholder: {
          type: String,
          default: '请选择'
      },
      clearable: {
          type: Boolean,
          default: true
      },
      multipleSelection: {//多选
          type: Boolean,
          default: false
      }, 
      modelValue: {
          type: Array as PropType<number[] | number[][]>,
          default: () => {
            return []
          }
      },
  },
  setup(props, { emit }) {


    // 数据值
    const value = computed<number[]| number[][]>({
          get: () => props.modelValue,
          set: val => {
              emit('update:modelValue', val);
          }
    });

    // 是否编辑
    const modelIsEdit = computed<boolean>({
          get: () => props.isEdit,
          set: val => {
              emit('update:isEdit', val);
          }
    });

   

    const elProps = reactive({
          multiple: props.multipleSelection,
          checkStrictly: props.checkStrictly,
          expandTrigger: props.checkStrictly ? 'hover' : 'click',
    })

    const options = ref<EleUiLevelData[]>([]);
    const optionsLoading = ref<boolean>(false);
    // 获取 options 列表
    const getOptionList = () => { 
        optionsLoading.value = true;
        queryList().then(res => {  
            const { code, data } = res;      
            if(code === 0 ) {
                const o = data || [];
                options.value = formatEleUiLevelData(o, 'id', 'name', 'pid', 0) || [];
                optionsLoading.value = false;
                modelIsEdit.value = false;
                
            }
        }).catch(err => {                       
            console.log(err);
        });

    }

    // 下拉框 显示/隐藏 调用
    const visibleChange = (v: boolean) => {
          if(!v){
              return false;
          }
          if(options.value.length > 0) {
              optionsLoading.value = false;
              modelIsEdit.value = false;
              return false;
          }
          getOptionList();
    }

    // 监听编辑
    watch(modelIsEdit ,(value)=> {
        if(value) {
            visibleChange(true);
        }
    })

    onMounted(()=> {
        if(modelIsEdit.value) {
            visibleChange(true);
        }
    })




    return {
       value,
       optionsLoading,
       props: elProps,
       options,
       visibleChange
    }

  }
})
</script>
<template>
    <div class="box" v-loading="optionsLoading">
      <el-input 
        v-if="isEdit"
        v-loading="true"
        :placeholder="placeholder">
      </el-input>
      <el-cascader   
          class="cascader" 
          v-else        
          :separator="separator"
          :placeholder="placeholder"
          :clearable="clearable"
          :props="props"
          v-model="value"
          :options="options"
           @visible-change="visibleChange"
          >
      </el-cascader>
    </div>
</template>
<style lang="scss" scoped>
.box {
  display: inline-block;
  ::v-deep(.cascader) {
    width: 100%;
  }
}
</style>
