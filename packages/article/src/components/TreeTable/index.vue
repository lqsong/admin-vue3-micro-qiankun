<script lang="ts">
/**
 * 自定义 TreeTable
 * @author LiQingSong
 */
import { ColumnItem } from './data.d';
import debounce from "lodash.debounce";
import { ElTree } from "element-plus";
import { getScrollBarWidth } from 'element-plus/lib/utils/dom/scroll';
import { TreeData, TreeOptionProps, LoadFunction, TreeKey } from 'element-plus/es/components/tree/src/tree.type';
import Node from "element-plus/es/components/tree/src/model/node";
import { computed, defineComponent, PropType, ref, reactive, onMounted, onBeforeUnmount, ComponentInternalInstance } from "vue";

export default defineComponent({
  name: 'TreeTable',
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
            type: Function as PropType<LoadFunction>
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


    // 栏目个数
    const columnLen = computed<number>(()=> props.column.length);

    const treeTableBoxRef = ref<HTMLElement>();
    const treeTableMainRef = ref<HTMLElement>();
    const treeTable = reactive({
        // Tree Table 的宽度
        width:0,
        // Tree Table 内容区是否有滚动条
        mainIsScroll: false
    })


    // 表格宽度，不带边框(页面可视宽度)
    const treeTableWidth = computed<number>(()=> treeTable.width - 2);
    // 操作栏宽度
    const operWidth = computed<number>(()=> props.operationOpen ? props.operationWidth : 0);
    // 表格除去操作栏宽度(页面可视宽度)
    const treeTableDelOperWidth = computed<number>(()=> treeTableWidth.value - operWidth.value);
    // 所有栏目的总宽度
    const allColumTotalWidth = computed<number>(()=> {
        let total = 0;

        for (let index = 0; index < columnLen.value; index++) {
            const width = props.column[index]['minWidth'] || 100;
            total = total + width;
        }

        return total;
    })
    // 表格所有栏目+操作栏目的总宽度
    const treeTableAllColumOperWidth = computed<number>(()=> allColumTotalWidth.value + operWidth.value);
    // 表格Tr实际宽度
    const treeTableTrWidth = computed<number>(()=> treeTableAllColumOperWidth.value > treeTableWidth.value ? treeTableAllColumOperWidth.value : treeTableWidth.value);
    // 新栏目-重置栏目参数
    const newColumn = computed<ColumnItem[]>(() => {
        if(treeTableWidth.value < 1) {
            return [];
        }

        let restColum: ColumnItem[] = [];
        for (let index = 0; index < columnLen.value; index++) {
            const item = props.column[index];
            const width = item['minWidth'] ? item['minWidth'] : 100;
            const actualWidth =  treeTableDelOperWidth.value > allColumTotalWidth.value ? (treeTableDelOperWidth.value * width / allColumTotalWidth.value) : width;
            restColum.push({
                title: item['title'],
                label: item['label'],
                minWidth: actualWidth
            });
        }

        return restColum;
    })
    // treeTable mainBox 是否有滚动条
    const treeTableMainIsScroll = computed<boolean>(() => treeTable.mainIsScroll);
    // treeTable mainBox 滚动条宽度
    const treeTableMainScrollbarWidth = computed<number>(()=> getScrollBarWidth() + 1);

    // 设置tree mainBox 是否有滚动条
    const setTreeTableMainIsScroll = () => {
        setTimeout(()=>{
            if(treeTableMainRef.value) {
                treeTable.mainIsScroll = treeTableMainRef.value.scrollHeight > treeTableMainRef.value.clientHeight;
            }
        },500);
    }

    const resizeHandler = debounce(() => {
        if (treeTableBoxRef.value) {
            treeTable.width = treeTableBoxRef.value.offsetWidth;
        }
        if(treeTableMainRef.value) {
            treeTable.mainIsScroll = treeTableMainRef.value.scrollHeight > treeTableMainRef.value.clientHeight;
        }
    }, 100);


    // 设置td宽度
    const setNodeTdWidth = (index: number, node: Node, width: number): number => {
        return index < 1 ? (width - 24 - (node.level - 1 ) * 18) : width;
    }

    // 单击节点
    const handleNodeClick = (data: TreeData, node: Node , el: ComponentInternalInstance): void => {
        emit('node-click', data, node , el);
    }

    // 展开调用
    const handleNodeExpand = (data: TreeData, node: Node , el: ComponentInternalInstance): void => {
        setTreeTableMainIsScroll();
        setTimeout(()=>{
            resizeHandler();
        },500);
        emit('node-expand', data, node , el);
    }

    // 收起调用
    const handleNodeCollapse = (data: TreeData, node: Node , el: ComponentInternalInstance): void => {
        setTreeTableMainIsScroll();
        setTimeout(()=>{
            resizeHandler();
        },500);
        emit('node-collapse', data, node , el);
    }



    onMounted(()=> {
        resizeHandler();
        window.addEventListener('resize', resizeHandler);
    })

    onBeforeUnmount(()=> {
        window.removeEventListener('resize', resizeHandler);
    })


    const elTree = ref<typeof ElTree>();

    return {
        treeTableBoxRef,
        treeTableMainRef,
        treeTable,
        treeTableTrWidth,
        operWidth,
        newColumn,
        treeTableMainIsScroll,
        treeTableMainScrollbarWidth,
        setNodeTdWidth,
        handleNodeClick,
        handleNodeExpand,
        handleNodeCollapse,
        elTree
    }

  }
})
</script>
<template>
    <div ref="treeTableBoxRef" class="tree-table">
        <div class="tree-table-header" :style="{width: treeTableTrWidth + 'px', paddingRight: (treeTableMainIsScroll ? treeTableMainScrollbarWidth : 0) + 'px'}">
            <div class="tree-table-header-th" v-for="(item, index) in newColumn" :key="index" :style="{width: item.minWidth + 'px'}">
                <div class="cell">{{item.title}}</div>
            </div>
            <div class="tree-table-header-th" v-if="operationOpen" :style="{width: operWidth + 'px'}">
                <div class="cell">{{ operationText }}</div>
            </div>
        </div>
        <div ref="treeTableMainRef" class="tree-table-content" :style="{width: treeTableTrWidth + 'px'}">
            <el-tree
                ref="elTree"
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
                <template #default="{ node, data }">
                    <span class="custom-tree-node">
                         <span class="custom-tree-node-td" v-for="(item, index) in newColumn" :key="index" :style="{width: setNodeTdWidth(index, node, item.minWidth) + 'px'}">
                            <div class="cell">
                                <template v-if="$slots.column" >
                                    <slot name="column" :node="node" :data="data" :item="item" :index="index"></slot>
                                </template>
                                <template v-else>
                                    {{ data[item.label]}}
                                </template>
                            </div>
                        </span>
                        <span class="custom-tree-node-td" v-if="operationOpen" :style="{width: operWidth + 'px'}">
                            <div class="cell">
                                <slot :node="node" :data="data">
                                    <!-- <el-button
                                        type="text"
                                        size="small"
                                        @click="() => append(data)">
                                        添加下级
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="small"
                                        @click="() => remove(node, data)">
                                        删除
                                    </el-button> -->
                                    <el-button type="text" size="small">请添加内容，否则请禁用</el-button>
                                </slot>
                            </div>
                        </span>
                    </span>
                </template>
            </el-tree>
        </div>
        <div class="tree-table-bottom-border" :style="{width: treeTableTrWidth + 'px'}"></div>
    </div>
</template>
<style lang="scss" scoped>
.tree-table {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border: 1px solid #EBEEF5;
    border-bottom: 0;
    overflow: auto;
    .tree-table-header {
        display: table-row;
        box-sizing: border-box;
        font-size: 12px;
        font-weight: 700;
        border-bottom: 1px solid #EBEEF5;
        background-color: #F5F7FA;
        .tree-table-header-th {
            display: table-cell;
            box-sizing: border-box;
            padding: 4px 0;
            border-right: 1px solid #EBEEF5;
            .cell{
                display: inline-block;
                box-sizing: border-box;
                position: relative;
                vertical-align: middle;
                padding: 0 10px;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
                word-break: break-all;
                line-height: 23px;
            }
        }
    }
    .tree-table-content {
        flex: 1;
        overflow: auto;
        ::v-deep(.el-tree-node__content) {
                height: auto;
                border-bottom: 1px solid #EBEEF5;
            }
        ::v-deep(.custom-tree-node) {
            flex: 1;
            font-size: 14px;
            display: table-row;
            .custom-tree-node-td{
                display: table-cell;
                box-sizing: border-box;
                padding: 5px 0;
                border-right: 1px solid #EBEEF5;
                .cell{
                    display: inline-block;
                    box-sizing: border-box;
                    position: relative;
                    vertical-align: middle;
                    padding: 0 10px;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                    word-break: break-all;
                    line-height: 23px;
                }
            }
        }
    }
    .tree-table-bottom-border {
        position:absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0px;
        overflow: hidden;
        border-bottom: 1px solid #EBEEF5;
    }
}
</style>
