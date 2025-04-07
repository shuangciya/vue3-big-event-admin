<script setup>
import { useUserStore } from "@/stores"
const userStore = useUserStore()
</script>

<template>
  <!-- 一级路由出口 -->
  <router-view></router-view>
  <hr>
  <hr>
  <hr>
  <div>我是App</div>
  <!-- <testDemo></testDemo>
  <testDemo></testDemo> -->
  <test-demo></test-demo>
  <el-button type="primary">Primary</el-button>
  <el-button type="success">Success</el-button>
  <p>{{ userStore.token }}</p>
  <el-button @click="userStore.setToken('你好，欢迎登陆！')">登录</el-button>
  <el-button @click="userStore.removeToken()">退出</el-button>

</template>

<style scoped>

</style>
