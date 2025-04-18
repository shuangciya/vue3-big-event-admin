<script setup>
import { userUpdateInfoService } from '@/api/user'
import { useUserStore } from '@/stores'
import { ref } from 'vue'

const { user:{username, nickname, email, id},getUser } = useUserStore()
// 将解构的四个值存成对象 因为 下方:model需要绑定表单的数据对象
const  form = ref({ username, nickname, email, id })
const formRef = ref()

const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

const submitForm = async() => {
  // 预校验
  await formRef.value.validate()
  // 提交修改(后端修改)
  await userUpdateInfoService(form.value)
  // 通知user模块 ，进行数据的更新
  getUser()
  // 提示用户
  ElMessage.success('修改成功')
}
</script>

<template>
<page-container title="基本资料">
  <el-row>
    <el-col :span="12">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" size="large">
         <el-form-item label="登录名称">
            <el-input v-model="form.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户用户名" prop="nickname">
            <el-input v-model="form.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交修改</el-button>
          </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</page-container>
</template>

<style scoped>

</style>

