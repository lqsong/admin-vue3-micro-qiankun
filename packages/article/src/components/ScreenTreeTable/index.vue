<script lang="ts">
/**
 * 自定义 ScreenTreeTable
 * @author LiQingSong
 */
import TreeTable from '@/components/TreeTable/index.vue';
import { ColumnItem } from '@/components/TreeTable/data.d';
import { TreeData, TreeOptionProps, LoadFunction, TreeKey } from 'element-plus/es/components/tree/src/tree.type';
import Node from "element-plus/es/components/tree/src/model/node";
import { defineComponent, PropType, ref, ComponentInternalInstance, computed } from "vue";

export default defineComponent({
    name: 'ScreenTreeTable',
    components: {
        TreeTable
    },
    props: {
        // 栏目
        column: {
            type: Array as PropType<ColumnItem[]>,
            required: true
        },
        // 操作栏目是否开启
        operationOpen: {
            type: Boolean,
            default: true
        },
        // 操作栏目的标题
        operationText: {
            type: String,
            default: '操作'
        },
        // 操作栏目的宽度
        operationWidth: {
            type: Number,
            default: 200
        },
        // 数据
        data: {
            type: Array as PropType<TreeData>,
            default: () => {
                return [];
            }
        },
        nodeKey: {
            type: String,
            required: true
        },
        props: {
            type: Object as PropType<TreeOptionProps>,
            default: () => {
                return {
                    label: 'label',
                    children: 'children',
                    disabled: 'disabled',
                    isLeaf: 'leaf'
                };
            }
        },
        emptyText: {
            type: String,
            default: 'No data'
        },
        lazy: {
            type: Boolean,
            default: false
        },
        load: {
            type: Function as PropType<LoadFunction>,
        },
        defaultExpandedKeys: {
            type: Array as PropType<TreeKey[]>,
            default: () => {
                return [];
            }
        },
        showCheckbox: {
            type: Boolean,
            default: false
        },
        checkStrictly: {
            type: Boolean,
            default: false
        },
        defaultCheckedKeys: {
            type: Array as PropType<TreeKey[]>,
            default: () => {
                return [];
            }
        },
        accordion: {
            type:Boolean,
            default: false
        },
        iconClass: {
            type: String,
            default: ''
        },
        expandOnClickNode: {
            type: Boolean,
            default: true
        }
    },
    emits: ['node-click', 'node-expand', 'node-collapse'],
    setup(props, { emit }) {


        // 单击节点
        const handleNodeClick = (data: TreeData, node: Node , el: ComponentInternalInstance): void => {
            emit('node-click', data, node , el);
        }

        // 展开调用
        const handleNodeExpand = (data: TreeData, node: Node , el: ComponentInternalInstance): void => {
            emit('node-expand', data, node , el);
        }

        // 收起调用
        const handleNodeCollapse = (data: TreeData, node: Node , el: ComponentInternalInstance): void => {
            emit('node-collapse', data, node , el);
        }

        const treeTable = ref();
        const elTree = computed(()=> treeTable.value.elTree);


        return {
           handleNodeClick,
           handleNodeExpand,
           handleNodeCollapse,
           treeTable,
           elTree,
        }

    }
})
</script>
<template>
    <div class="main-conent-screen">

        <div v-if="$slots.header" class="screen-header"><slot name="header"></slot></div>
        <div v-else class="screen-padding" />

        <div class="screen-conent" ref="conentRef">
            <tree-table
                ref="treeTable"
                :column="column"
                :operationOpen="operationOpen"
                :operationText="operationText"
                :operationWidth="operationWidth"
                :data="data"
                :empty-text="emptyText"
                :node-key="nodeKey"
                :props="props"
                :lazy="lazy"
                :load="load"
                :default-expanded-keys="defaultExpandedKeys"
                :show-checkbox="showCheckbox"
                :check-strictly="checkStrictly"
                :default-checked-keys="defaultCheckedKeys"
                :accordion="accordion"
                :icon-class="iconClass"
                :expand-on-click-node="expandOnClickNode"
                @node-click="handleNodeClick"
                @node-expand="handleNodeExpand"
                @node-collapse="handleNodeCollapse"
                >

                <template v-if="$slots.column" #column="{ node, data, item, index }">
                    <slot name="column" :node="node" :data="data" :item="item" :index="index"></slot>
                </template>

                <template #default="{ node, data }">
                    <slot :node="node" :data="data"></slot>
                </template>
            </tree-table>
        </div>

        <div class="screen-padding" />
    </div>
</template>
<style lang="scss" scoped>
.main-conent-screen {
  display: flex;
  flex-direction: column;
  height: calc(100%);
  border-radius: 4px;
  background-color: #fff;
  .screen-header {
    padding: 20px;
    min-height: 33px;
  }
  .screen-conent {
    flex: 1;
    padding: 0 20px;
    overflow: hidden;
    display: flex;
    .tree-table {
        flex: 1;
    }
  }
  .screen-padding {
    padding-top: 20px;
  }

}
</style>
