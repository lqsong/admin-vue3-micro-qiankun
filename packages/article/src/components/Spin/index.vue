<template>
    <div class="el-loading-parent--relative" :class="{'min-height': spinning}">
        <div v-if="spinning" :class="{'el-loading-mask': spinning && $slots.default }">
            <div class="el-loading-spinner">
                <slot name="icon">
                    <!-- <svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none"></circle></svg> -->
                    <svg class="circular" viewBox="0 0 1024 1024"><path  class="path" d="M896 512m-128 0a2 2 0 1 0 256 0 2 2 0 1 0-256 0Z"></path><path d="M128 512m-128 0a2 2 0 1 0 256 0 2 2 0 1 0-256 0Z" ></path><path d="M512 128m-128 0a2 2 0 1 0 256 0 2 2 0 1 0-256 0Z" ></path><path d="M512 896m-128 0a2 2 0 1 0 256 0 2 2 0 1 0-256 0Z"></path></svg>

                </slot>
            </div>
        </div>
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: 'Spin',
    props: {
        spinning: {
            type: Boolean,
            default: true
        }
    }
})
</script>
<style lang="scss" scoped>
.el-loading-parent--relative {
   &.min-height {
        min-height: 45px;
   }
   .circular {
     path {
      color: var(--el-color-primary);
      fill: currentColor;
     }
   }
}
.el-loading-mask {
    z-index:auto;
}
</style>
