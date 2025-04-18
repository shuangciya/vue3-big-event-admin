<script setup>
import { ref,defineExpose,defineEmits,nextTick } from "vue";
import channelSelect from "./channelSelect.vue";
import { Plus } from "@element-plus/icons-vue";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { artPublishService,artGetDetailService,artEditService } from "@/api/article";
// import { ElMessage } from "element-plus";
import { baseURL } from "@/utils/request";
import axios from 'axios';
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

// 默认数据
const defaultForm = {
  title:'', //标题
  cate_id:'', // 分类id
  cover_img:'', // 封面图片 file 对象
  content:'', // string 内容
  state:'' // 状态
}

// 准备数据
const formModel = ref({
  ...defaultForm
})

const rules = {
  title:[{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  cate_id:[{ required: true, message: '请输入文章分类', trigger: 'blur' }],
  cover_img:[{ required: true, message: '请上传封面图', trigger: 'blur' }],
  content:[{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}
const formRef = ref()

// 图片上传相关逻辑
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  console.log(uploadFile);
  imgUrl.value = URL.createObjectURL(uploadFile.raw)  //预览图片
  formModel.value.cover_img = uploadFile.raw
  // console.log(imgUrl.value);
}

// 提交
const emit = defineEmits(['success'])
const onPublish = async(state) => {
  await formRef.value.validate()
  formModel.value.state = state
  // 注意：当前接口，需要的是formData 对象
  // 将普通对象  => 转换成 => formData对象
  const fd = new FormData()
  for(let key in formModel.value) {
    fd.append(key,formModel.value[key])
  }
  console.log(state);
  if(formModel.value.id) {
    // 编辑操作
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success','edit')
  }else {
    // 添加操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 通知到父组件，添加成功了
    emit('success','add')
  }

}

const editorRef = ref()

// 将网络图片地址转换为File对象
async function imageUrlToFile(imgUrl, fileName) {
    try {
      // 第一步：使用axios获取网络图片数据
      const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
      const imageData = response.data;
      // 第二步：将图片数据转换为Blob对象
      const blob = new Blob([imageData], { type: response.headers['content-type'] });

      // 第三步：创建一个新的File对象
      const file = new File([blob], fileName, { type: blob.type });

      return file;
    } catch (error) {
      console.error('将图片转换为File对象时发生错误:', error);
      throw error;
    }
  }

// 组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({})  => 表单无需渲染，说明是添加
// open({ id, cate_name, ... })  => 表单需要渲染，说明是编辑
// open调用后，可以打开抽屉
const open = async (row) => {
  visibleDrawer.value = true
  if(row.id) {
    // 需要基于 row.id 发送请求，获取编辑对应的详情数据，进行回显
    // console.log('编辑回显')
    console.log(row);
    const res = await artGetDetailService(row.id)
    console.log(res)
    formModel.value = res.data.data
    // 图片需要单独处理回显
    imgUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需把网络图片地址 => 转换成 file 对象，存储起来,将来便于提交
    const file = await imageUrlToFile(imgUrl.value,formModel.value.cover_img)
    formModel.value.cover_img = file
  }else {
    formModel.value = {
      ...defaultForm // 基于默认数据，重置form数据
      // formModel.value.reset()
    }
    // 重置了表单数据，但图片上传img地址，富文本编译器内容 => 需手动重置
    imgUrl.value = ''
    // 等DOM加载完成
    await nextTick()
    editorRef.value.setHTML('')
    // 或 if(editorRef) {
    // editorRef.value.setHTML('')
    // }
    // console.log('添加');

  }
  // console.log(row);
}
defineExpose({
  open
})
</script>
<template>
  <el-drawer
      v-model="visibleDrawer"
      :title="formModel.id ? '编辑文章' : '添加文章'"
      size="50%"
   >
   <!-- label-width 标签长度-->
      <el-form :model="formModel" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input placeholder="请输入标题" v-model="formModel.title"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <!-- 行内表单需要设置宽度，这里不需要设宽度 或 style="width:30%" 可生效-->
           <!-- 新版本默认宽度100% -->
          <channel-select
            v-model="formModel.cate_id"
            width="100%"
          ></channel-select>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
            <!-- 此处需要关闭 element-plus 的自动上传，不需要配置action等参数
                只需要做前端的本地预览图片即可，要在提交时一起上传
                语法：URL.createObjectURL(...) 创建本地预览的地址，来预览
            -->
            <!-- :before-upload上传前的校验 -->
             <!-- 关闭自动上传 -->
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
              :on-change="onSelectFile"
            >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <div class="editor">
            <!-- content-type 指定内容格式 -->
            <quill-editor
              theme="snow"
              v-model:content="formModel.content"
              content-type="html"
              ref="editorRef"
            ></quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
          <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
  </el-drawer>
</template>

<style scoped lang="scss">
  .avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      /* css变量 */
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
