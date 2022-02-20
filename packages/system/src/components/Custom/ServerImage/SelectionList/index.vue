<script lang="ts">
/**
 * 服务器图片选择与上传
 * @author LiQingSong
 */
import { ElMessage } from 'element-plus';
import IconSvg from "@/components/IconSvg";
import ServerImageDialog from '@/components/Custom/ServerImage/Dialog/index.vue';
import { ListItem } from "./data.d";
import { defineComponent, ref, computed, PropType, reactive } from "vue";
import { useI18n } from "vue-i18n";
export default defineComponent({
  name: 'ServerImageSelectionList',
  props: {
    // 图片数据
    modelValue: {
        type: Array as PropType<string[]>,
        required: true
    },
    // 可以选择的数量
    limit: {
        type: Number,
        default: 1
    },
    // 选择图片后是否隐藏服务器图片弹框
    selectHideServerDialog: {
        type: Boolean,
        default: true
    }
  },
  components: {
    IconSvg,
    ServerImageDialog
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const dialogVisible = ref<boolean>(false)

    const value = computed<string[]>({
        get: () => props.modelValue,
        set: val => {
            emit('update:modelValue', val);
        }
    });
    const valueLen = computed<number>(()=> value.value.length);

    const selectData = (row: ListItem) =>  {
          if (valueLen.value >= props.limit) {
              ElMessage({ message: t('components.custom.serverimage.dialog.upload.num.external',{num: props.limit}), type: 'error' });
              dialogVisible.value = false;
              return false;
          }

          value.value = [
            ...value.value,
            row.imgurl
          ]

          if (props.selectHideServerDialog) {
              dialogVisible.value = false;
          }
    }


    const insertImgUrl = (value: string) => {
      selectData({imgurl: value, size: ''})
    }

    const pictureCardPreview = reactive({
      visible: false,
      imgurl: ''
    })
    const handlePictureCardPreview = (value: string) => {
      pictureCardPreview.imgurl = value;
      pictureCardPreview.visible = true;
    }

    const handlePictureDel = (index: number)=> {
      value.value.splice(index,1);
    }

    return {
        dialogVisible,
        value,
        valueLen,
        selectData,
        insertImgUrl,
        pictureCardPreview,
        handlePictureCardPreview,
        handlePictureDel,
        t
    }

  }
})
</script>
<template>
    <div>
        <div>
          <ul class="el-upload-list el-upload-list--picture-card">

            <li tabindex="0" class="el-upload-list__item is-success" v-for="(item, index) in value" :key="index">
              <img :src="item" class="el-upload-list__item-thumbnail">
              <label class="el-upload-list__item-status-label">
                <i class="el-icon el-icon--upload-success el-icon--check">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"></path></svg>
                </i>
              </label>
              
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(item)">
                  <icon-svg type="zoom-in"></icon-svg>
                </span>
                <span class="el-upload-list__item-delete" @click="handlePictureDel(index)">
                  <icon-svg type="delete"></icon-svg>
                </span>
              </span>
            </li>               

        
          </ul>

          <div v-if="valueLen < limit" class="el-upload el-upload--picture-card" @click="dialogVisible=true">
            <icon-svg class="plus" type="plus"></icon-svg>
          </div>

        </div>

        <el-dialog append-to-body v-model="pictureCardPreview.visible">
          <img :src="pictureCardPreview.imgurl" alt="">
        </el-dialog>

        <server-image-dialog :title="t('components.custom.serverimage.selectionlist.dialog.title')" v-model="dialogVisible" @insertImgUrl="insertImgUrl">
          <template #el-table-column>
                    <el-table-column
                        fixed="right"
                        width="90"
                        :label="t('components.custom.serverimage.selectionlist.dialog.table.column.action')">
                        <template #default="scope">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="selectData(scope.row)">
                                {{t('components.custom.serverimage.selectionlist.dialog.table.btn.choose')}}
                            </el-button>                     
                        </template>
                    </el-table-column>
                </template>
        </server-image-dialog>
    </div>
</template>
<style lang="scss" scoped>
.plus {
  margin-top: 59px;
  font-size: 28px;
  color: #8c939d;
}
</style>
