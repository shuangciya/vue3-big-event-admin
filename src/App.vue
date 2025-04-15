<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import en from 'element-plus/dist/locale/en.mjs'
</script>

<template>
  <!-- Config Provider全局配置 配置中文 中英国际化处理 -->
   <el-config-provider :locale="zhCn">
     <!-- 一级路由出口 -->
     <router-view></router-view>
   </el-config-provider>
</template>

<style scoped>

</style>
