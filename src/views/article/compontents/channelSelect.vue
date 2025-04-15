<script setup>
import { artGetChannelsService } from '@/api/article';
import { ref,defineModel } from "vue";
const channelList = ref([])
const getChannelList = async() => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  console.log(channelList.value)
}
getChannelList()
const modelValue = defineModel({type:[Number,String]})
console.log(modelValue);
</script>

<template>
  <el-select v-model="modelValue">
    <el-option v-for="item in channelList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
  </el-select>
</template>
