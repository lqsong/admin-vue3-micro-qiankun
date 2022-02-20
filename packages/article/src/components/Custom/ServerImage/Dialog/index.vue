<script lang="ts">
/**
 * 服务器图片列表弹框
 * @author LiQingSong
 */
import { isExternal } from '@/utils/validate';
import settings from '@/config/settings';
import { getToken } from '@/utils/localToken';
import { useI18n } from "vue-i18n";
import { ElForm, ElMessage } from 'element-plus';
import { ExternalLink, TableData } from './data.d';
import { uploadUrl, queryList } from "./service";
import { ResponseData } from '@/utils/request';
import { defineComponent, computed, reactive, ref, onMounted, watch } from "vue";
export default defineComponent({
  name: 'ServerImageDialog',
  props: {
    modelValue: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: 'Image list'
    },
    width: {
        type: String,
        default: '780px'
    },
    clickModalClose: {
        type: Boolean,
        default: true
    },
    // 允许文件上传的类型
    isFileType: {
        type: Array,
        default: () => {
            return  ['image/png','image/gif','image/jpeg'];
        }
    },
    // 单文件最大上传大小，单位M
    maxsize: {
        type: Number,
        default: 1
    }
  },
  emits: ['update:modelValue', 'insertImgUrl'],
  setup(props, { emit }) {

        const { t } = useI18n();

        const visible = computed<boolean>({
            get: () => props.modelValue,
            set: val => {
                emit('update:modelValue', val);
            }
        });


        const externalLinkFormRef = ref<typeof ElForm>();
        const externalLink = reactive<ExternalLink>({
            visible: false,
            ruleForm: {
                url: ''
            },
            rules: {
                url: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error(t('components.custom.serverimage.dialog.form.url.required')));
                            } else if (!isExternal(value)) {
                                callback(new Error(t('components.custom.serverimage.dialog.form.url.external')));
                            }else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            insertUrl: async () => {
                try {
                    const valid: boolean | undefined =  await externalLinkFormRef.value?.validate();
                    if(valid === true) {
                        emit('insertImgUrl', externalLink.ruleForm.url);
                        externalLinkFormRef.value?.resetFields();
                        externalLink.visible = false;
                    }
                } catch (error) {
                  console.log(error);
                }
            }
        })



        const tableData = reactive<TableData>({
            tableIndexMethod(index) {
                return index + (tableData.pagination.current - 1) * tableData.pagination.pageSize + 1;
            },
            loading: false,
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 5,
                onChange: (page: number) => {}
            }
        });
        const handleCurrentChange = async (current: number) => {
            tableData.loading = true;
            const response: ResponseData =  await queryList({page: current, per: tableData.pagination.pageSize});
            const { data } = response;
            const list = data.list || [];
            tableData.list =  list.map(item=> {
                return {
                    imgurl: item.imgurl,
                    size: item.size
                };
            });
            tableData.pagination = {
                total: data.total || 0,
                current: current,
                pageSize: 5,
                onChange: (page: number) => {handleCurrentChange(page)}
            }
            tableData.loading = false;
        }
        watch(visible ,(value)=> {
            if(value) {
                handleCurrentChange(1);
            } else {
                externalLink.visible = false;
            }
        })




        const upload = reactive<{
            loading: boolean;
            headers: any;
            action: string;
            fileUploadBeforeUpload: (file: any) => false | undefined;
            fileUploadSuccess: () => void;
            fileUploadError: (err: any) => void;
        }>({
            loading: false,
            headers: {},
            action: uploadUrl,
            // 上传 - 上传之前
            fileUploadBeforeUpload(file) {
                // console.log(file);
                const isType = props.isFileType.length > 0 ? props.isFileType.includes(file.type) : true;
                if(!isType) {
                    ElMessage.error(t('components.custom.serverimage.dialog.upload.type.external',{str: props.isFileType.join('、')}));
                    return false;
                }

                const isLtMaxSize = file.size / 1024 / 1024 < props.maxsize;
                if (!isLtMaxSize) {
                    ElMessage.error(t('components.custom.serverimage.dialog.upload.num.external',{num: props.maxsize}));
                    return false;
                }

                upload.loading = true;
            },
            // 上传 - 成功时
            fileUploadSuccess(){
                // console.log(response, file, fileList);
                upload.loading = false;
                handleCurrentChange(1);
            },
            // 上传 - 失败时
            fileUploadError(err) {
                // console.log(err, file, fileList);
                upload.loading = false;
                ElMessage.warning(t('components.custom.serverimage.dialog.upload.error') + err);
            },
        })
        onMounted(async ()=> {
            const headers = {};
            const headerToken = await getToken();
            if (headerToken) {
                headers[settings.ajaxHeadersTokenKey] = headerToken;
            }
            upload.headers = {
               ...headers
            }
        })



    return {
        visible,
        tableData,
        externalLinkFormRef,
        externalLink,
        upload,
        t
    }

  }
})
</script>
<template>
    <el-dialog
        append-to-body
        custom-class="custom-dialog custom1"
        :title="title"
        :width="width"
        :close-on-click-modal="clickModalClose"
        v-model="visible">

            <el-table
                border
                stripe
                height="320"
                class="custom-table"
                header-row-class-name="custom-table-header"
                v-loading="tableData.loading"
                :data="tableData.list"
                >
                <el-table-column
                    type="index"
                    :label="t('components.custom.serverimage.dialog.table.column.index')"
                    width="80"
                    :index="tableData.tableIndexMethod">
                </el-table-column>
                <el-table-column
                    prop="imgurl"
                    :label="t('components.custom.serverimage.dialog.table.column.imgurl')"
                    min-width="93">
                    <template #default="scope">
                        <el-image
                            style="width: 70px; height: 70px"
                            :src="scope.row.imgurl"
                            :preview-src-list="[scope.row.imgurl]"
                            fit="contain">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="size"
                    :label="t('components.custom.serverimage.dialog.table.column.size')"
                    min-width="100">
                </el-table-column>

                <slot name="el-table-column"></slot>

            </el-table>

            <template #footer>
                <el-row>
                    <el-col :span="5" class="text-left">

                        <el-popover
                            placement="top-start"
                            width="300px"
                            trigger="manual"
                            v-model:visible="externalLink.visible">

                            <el-form :model="externalLink.ruleForm" :rules="externalLink.rules" label-position="top" ref="externalLinkFormRef">
                                <el-form-item :label="t('components.custom.serverimage.dialog.form.url')" prop="url">
                                    <el-input v-model="externalLink.ruleForm.url"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button @click="externalLink.insertUrl()">{{t('components.custom.serverimage.dialog.form.btn.submit')}}</el-button>
                                    <el-button @click="externalLink.visible = !externalLink.visible">{{t('components.custom.serverimage.dialog.form.btn.cancel')}}</el-button>
                                </el-form-item>
                            </el-form>

                            <template #reference>
                                <el-button  class="float-left" size="small" type="primary" @click="externalLink.visible = !externalLink.visible">{{t('components.custom.serverimage.dialog.form.btn.link')}}</el-button>
                            </template>


                        </el-popover>


                        <el-button v-if="upload.loading" class="margin-l5" size="small" type="primary" :loading="true" >{{t('components.custom.serverimage.dialog.form.btn.upload')}}</el-button>
                          <!--with-credentials 用的是token 所以不需要设置为true -->
                        <el-upload
                            v-else
                            :with-credentials="false"
                            :headers="upload.headers"
                            :action="upload.action"
                            :show-file-list="false"
                            :on-success="upload.fileUploadSuccess"
                            :on-error="upload.fileUploadError"
                            :before-upload="upload.fileUploadBeforeUpload">
                            <el-button  class="margin-l5" size="small" type="primary" >{{t('components.custom.serverimage.dialog.form.btn.upload')}}</el-button>
                        </el-upload>

                    </el-col>
                    <el-col :span="19">
                        <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="tableData.pagination.current"
                            :page-size="tableData.pagination.pageSize"
                            :total="tableData.pagination.total"
                            @current-change="tableData.pagination.onChange"
                            >
                        </el-pagination>
                    </el-col>
                </el-row>
            </template>

    </el-dialog>
</template>
<style lang="scss" scoped>
</style>
