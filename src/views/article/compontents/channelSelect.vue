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
defineProps({
  width:{
    type: String
  }
})
console.log(modelValue);
</script>

<template>
  <!-- :style="{ width:width } 对象属性名和变量名相同 可简写  -->
  <el-select v-model="modelValue" :style="{ width }">
    <el-option v-for="item in channelList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
  </el-select>
</template>
