<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref,watch } from 'vue'
import { userRegisterService,userLoginService } from "@/api/user";
// import { ElMessage } from 'element-plus';
const isRegister = ref(true)
// 整个的用于提交的form数据对象
const formModel = ref({
  username:'',
  password:'',
  repassword:''
})
// 整个表单的校验规则
// 1.非空校验
// 2.长度校验
// 3.正则校验 pattern: 正则规则 \S 非空字符 ;\s 空白字符
// 4.自定义校验  validator  => 自己写逻辑校验(校验函数)
//validator: (rule, value, callback)
// (1) rule 当前校验规则相关信息
// (2) value 所校验的表单元素当前的表单值
// (3) callback 无论成功还是失败 都需要 callback 回调
//     -callback() 校验成功
//     -callback(new Error(错误信息)) 校验失败
// (4) 加type 指明校验规则的类型
    // 常见值：
    // 'email'：验证输入是否符合邮箱格式。
    // 'string'：验证输入是否为字符串。
    // 'number'：验证输入是否为数字。
    // 'url'：验证输入是否为有效的 URL。
    // 'pattern'：使用正则表达式进行自定义验证。
const rules ={
  username:[
    // required: true 非空校验 ；trigger: 'blur' 触发校验的时机 失焦开始校验 change 实时校验;  submit 表单提交时校验  message 消息提示
    { required: true, message: '请输入用户名', trigger: 'blur'},
    { min: 1, max: 10, message: '用户名必须是1-10位的字母数字', trigger: 'blur'
    }
  ],
  password:[
    { required: true, message: '请输入密码', trigger: 'blur'},
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur'}
  ],
  repassword:[
    { required: true, message: '请再次输入密码', trigger: 'blur'},
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if(value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致!'))
        }else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const form = ref()
// form表单对应的一个方法
const register = async() => {
  // 注册成功之前，先进行预校验，校验成功 => 发送请求，校验失败 => 自动提示
  await form.value.validate()
  // console.log('开始注册请求');
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  isRegister.value = false
}

// 切换的时候，重置表单内容
watch(isRegister,() => {
  formModel.value={
    username:'',
    password:'',
    repassword:''
  }
})

 import { useUserStore } from "@/stores";
 import { useRouter } from "vue-router";
const userStore = useUserStore()
const router = useRouter()
const login = async() => {
  await form.value.validate()
  // console.log('开始登录');
  const res = await userLoginService(formModel.value)
  // console.log(res);
  ElMessage.success('登录成功')
  userStore.setToken(res.data.token)
  router.push('/')
}
</script>

<template>
  <!--
    1.结构相关
        el-row 表示一行，一行分为24份
        el-col 表示列
        (1)  :span="12" 代表在一行中占12份（50%）
        (2)  :offset="3"  代表在一行中，左侧margin份数
    2.校验相关
        (1) el-form => :model="ruleForm"    绑定的整个form的数据对象
        (2) el-form => :rules="rules"       绑定的整个rules的规则对象
        (3) 表单元素 => v-model="ruleForm.xxx"  给表单元素，绑定form的子属性
        (4) el-form-item => prop配置生效的是哪个校验规则（与rules中的字段要对应）-->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="formModel"
        :rules="rules"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formModel.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
