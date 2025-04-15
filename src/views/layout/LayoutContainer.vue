<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from "@/stores";
const userStore = useUserStore()
userStore.getUser()
console.log(userStore.user);  //请求获取用户信息

import { useRouter } from "vue-router";
const router = useRouter()
const handleCommand  = async (key) => {
  if(key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm(
    '你确认要退出大事件吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    // 加await,上述代码成功了才会执行下述代码
    // 清除本地数据（token + user信息）
    userStore.removeToken()
    userStore.removeUser()
    router.push('/login')
  }else {
    // 跳转操作
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <!-- <el-container>：外层容器
      <el-aside>：侧边栏容器。
      <el-header>：顶栏容器。
      <el-main>：主要区域容器。
      <el-footer>：底栏容器。
        el-menu 菜单组件
      当子元素中包含 <el-header> 或 <el-footer> 时，全部子元素会垂直上下排列， 否则会水平左右排列。
  -->
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <!-- :default-active="$route.path" 配置默认高亮的菜单项（实现高亮）
            router    router选项开启 ，el-menu-item 的index 就是点击跳转的路径 （实现跳转） index配合default-active的值实现高亮-->
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <!-- 多级菜单的标题 具名插槽-->
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <!-- 展开内容  默认插槽-->
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>黑马程序员：<strong>{{userStore.user.nickname || userStore.user.username}}</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <!-- 展示给用户，默认看到的 -->
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!-- 折叠的下拉部分 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 二级路由出口 -->
        <router-view></router-view>
      </el-main>
      <el-footer>大事件 ©2023 Created by 黑马程序员</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
