<template>
    <el-drawer
      :size="size"
      :title="title"
      v-model="visible"
    >

        <div class="content" :class="{'footer-bottom': $slots.footer}">
            <slot></slot>
        </div>


        <div v-if="$slots.footer" :style="{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
        }">
            <slot  name="footer"></slot>
        </div>

      
    </el-drawer>
</template>
<script lang="ts">
import { defineComponent, computed} from "vue";
export default defineComponent({
    name: 'RestElDrawer',
    props: {
        size: {
            type: String,
            default: '360px'
        },
        modelValue: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            default: ''
        },     
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {

        const visible = computed<boolean>({
            get: () => props.modelValue,
            set: val => {
                emit('update:modelValue', val);
            }
        });


        return  {
            visible
        }

    }
})
</script>
<style lang="scss" scoped>
.content {
    padding: 20px;
    position:absolute;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    &.footer-bottom {
        bottom: 55px;
    }
}
</style>