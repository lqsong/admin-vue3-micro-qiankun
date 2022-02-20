<script lang="ts">
/**
 * 页面头部header
 * @author LiQingSong
 * 
 * */
import { defineComponent } from "vue";
export default defineComponent({
  name: 'PageHeader',
  props: {
      into: {
          type: String,
          default: ''
      },
  },
  setup() {

    return {
    }

  }
})
</script>
<template>
    <div class="page-header">
        <div class="page-header-conent">
            <div class="page-header-top">
                <slot>标题</slot>
            </div>
            <div class="page-header-msg" v-if="into !== ''">{{ into }}</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.page-header {
    margin: -24px -24px 0;
    background-color: #FFF;
    .page-header-conent {
        padding: 16px 24px;
        .page-header-top {
            color: rgba(0,0,0,.85);
            font-size: 20px;
            line-height: 32px;
        }
        .page-header-msg {
            padding-top: 12px;
            color: rgba(0,0,0,.65);
            font-size: 14px;
            font-variant: tabular-nums;
            line-height: 1.5715;
            list-style: none;
            font-feature-settings: "tnum","tnum";
        }
    }
}
</style>
