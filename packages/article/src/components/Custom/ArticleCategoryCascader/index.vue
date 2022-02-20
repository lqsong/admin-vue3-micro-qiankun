<script lang="ts">
/**
 * 文章分类 联动下拉 - 异步获取数据
 * @author LiQingSong
 * 
 * */
import { computed, defineComponent, PropType, reactive } from "vue";
import { queryList } from "./service";
export default defineComponent({
  name: 'ArticleCategoryCascader',
  props: {
      // 编辑页面调用时用到此参数 
      isEdit: {
        type: Boolean,
        default: false
      },
      dataLoading: {
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
          type: Array as PropType<number[]>,
          default: () => {
            return []
          }
      },
  },
  setup(props, { emit }) {


    // 数据值
    const value = computed<number[]>({
          get: () => props.modelValue,
          set: val => {
              emit('update:modelValue', val);
          }
    });

    // 是否加载options数据
    const modelDataLoading = computed<boolean>({
          get: () => props.dataLoading,
          set: val => {
              emit('update:dataLoading', val);
          }
    });

    const elProps = reactive({
          multiple: props.multipleSelection,
          checkStrictly: props.checkStrictly,
          expandTrigger: props.checkStrictly ? 'hover' : 'click',
          lazy: true,
          lazyLoad (node, resolve) {
              const { level } = node;
              const pid = level === 0 ? 0 : node.value; 
              queryList(pid).then(res => {  
                    const { code, data } = res;      
                    if(code === 0 ) {
                      const nodes = data.map((v) => {
                          return {
                            value: v.id,
                            label: v.name,
                            leaf: v.leaf
                          };
                      });
                      if (modelDataLoading.value) {
                        if(value.value.length<= (level + 1)) { 
                          modelDataLoading.value = false;
                        }
                      }
                      resolve(nodes);
                    } else {
                      resolve(null);
                    }
              }).catch(err => {                       
                  console.log(err);
              });

          }
      })

    return {
       value,
       modelDataLoading,
       props: elProps
    }

  }
})
</script>
<template>
    <div class="category-box" v-loading="modelDataLoading">
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
          >
      </el-cascader>
    </div>
</template>
<style lang="scss" scoped>
.category-box {
  display: inline-block;
  ::v-deep(.cascader) {
    width: 100%;
  }
}
</style>
