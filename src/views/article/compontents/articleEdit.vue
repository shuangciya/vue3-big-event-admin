<script setup>
import { ref,defineExpose } from "vue";
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

// 组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({})  => 表单无需渲染，说明是添加
// open({ id, cate_name, ... })  => 表单需要渲染，说明是编辑
// open调用后，可以打开抽屉
const open = (row) => {
  visibleDrawer.value = true
  console.log(row);
}
defineExpose({
  open
})
</script>
<template>
  <el-drawer
      v-model="visibleDrawer"
      title="大标题"
      size="50%"
   >
      <el-form style="margin-left: 30px;">
        <el-form-item label="文章标题">
          <el-input placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <channel-select></channel-select>
        </el-form-item>
        <el-form-item label="文章封面">

        </el-form-item>
        <el-form-item label="文章内容">

        </el-form-item>
      </el-form>
    </el-drawer>
</template>
