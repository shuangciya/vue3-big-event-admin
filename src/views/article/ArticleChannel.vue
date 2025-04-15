<script setup>
import { artGetChannelsService } from '@/api/article';
import { ref } from "vue";
import { Edit,Delete } from "@element-plus/icons-vue";
import channelEdit from './compontents/channelEdit.vue';
import { ElMessageBox,ElMessage } from "element-plus";
import { artDelChannelService } from '@/api/article';
const channelList = ref([])
const loading = ref(false)
const dialog = ref()
const getChannelList = async() => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  // console.log(channelList.value);
  loading.value = false
}
getChannelList()

const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onAddChannel = () => {
  dialog.value.open()
}
const onDelChannel = async (row) => {
  console.log(row);
  await ElMessageBox.confirm(
    '你确认删除该分类信息吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
<page-container title="文章分类">
  <template #extra>
    <el-button type="primary" @click="onAddChannel">添加分类</el-button>
  </template>
  <el-table v-loading="loading" :data="channelList" style="width: 100%">
    <el-table-column type="index" label="序号" width="100"></el-table-column>
    <el-table-column prop="cate_name" label="分类名称" ></el-table-column>
    <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
    <el-table-column label="操作" width="100">
      <!-- row就是channelList的一项，$index下标 -->
      <template #default="{row,$index}">
        <el-button type="primary" :icon="Edit" circle plain @click="onEditChannel(row,$index)" />
        <el-button type="danger" :icon="Delete" circle plain @click="onDelChannel(row,$index)" />
      </template>
    </el-table-column>
    <template #empty>
      <el-empty description="没有数据"></el-empty>
    </template>
  </el-table>
  <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
</page-container>
</template>

<style scoped>

</style>

