<script setup>
import { Edit,Delete } from "@element-plus/icons-vue";
import { artGetManageService,artDelManageService } from "@/api/article";
import { ref } from "vue";
import channelSelect from "./compontents/channelSelect.vue";
import articleEdit from "./compontents/articleEdit.vue";
import { formatTime } from "@/utils/format";
import { ElMessageBox,ElMessage } from "element-plus";
const articleList  = ref([])  //文章列表
const total = ref(0)  //总条数
const loading  =ref(false)
// 定义请求参数对象
const params = ref({
  pagenum: 1,   //当前页
  pagesize: 5,  //当前生效的每页条数
  cate_id: '',  //文章分类id
  state: ''
})

// 基于params参数，获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetManageService(params.value)
  // console.log(res.data)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

// 搜索 => 按照最新条件，重新检索 从第一页开始展示
const onSearch = () => {
  params.value.pagenum  = 1
  getArticleList()
}

//重置 => 将筛选条件清空,重新检索 从第一页开始展示
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id  = ''
  params.value.state = ''
  getArticleList()
}

// 处理条数逻辑
const onSizeChange = (size) => {
  // console.log(size);
  // 每页条数变化了，需重新从第一页渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新的 当前页 和 每页条数，渲染数据
  getArticleList()
}

// 处理页数逻辑
const onCurrentChange = (page) => {
  // console.log(page);
  // 重置页数
  params.value.pagenum = page
  // 基于当前页重新渲染数据
  getArticleList()
}

const articleEditRef = ref()
//发布文章
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 删除逻辑
const onDelArticle = async (row) => {
  await ElMessageBox.confirm(
    '你确认删除该分类信息吗?',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    await artDelManageService(row.id)
    ElMessage.success('删除成功')
    getArticleList()
}

</script>

<template>
<page-container title="文章管理">
  <template #extra>
    <el-button type="primary" @click="onAddArticle">发布文章</el-button>
  </template>

  <!-- 表单区域 -->
  <el-form inline class="demo-form-inline">
      <el-form-item label="文章分类:">
        <!-- Vue2 => v-model :value 和 @input 的简写 -->
        <!-- Vue3 => v-model :modelValue 和 @update:modelValue 的简写 -->
        <channel-select v-model="params.cate_id"></channel-select>

        <!-- Vue3 => v-model:cid  :cid 和 @update:cid 的简写 -->
        <!-- <channel-select v-model:cid="params.cate_id"></channel-select> -->
      </el-form-item>
      <el-form-item label="发布状态:">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布 / 草稿 -->
        <el-select v-model="params.state">
          <!-- label展示给用户看的 value收集起来提交给后台的 ，value通常情况下是id值-->
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
  </el-form>

  <!-- 表格区域 -->
  <el-table
    v-loading="loading"
    :data="articleList"
    >
      <el-table-column label="文章标题" prop="title" width="400">
        <template #default="{row}">
          <el-link
            type="primary"
            :underline="false"
          >
            {{ row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <!-- 利用作用域插槽 row 可以获取当前行的数据 => 遍历 item -->
        <template #default="{row,$index}">
            <el-button type="primary" :icon="Edit" circle plain @click="onEditArticle(row,$index)" />
            <el-button type="danger" :icon="Delete" circle plain @click="onDelArticle(row,$index)" />
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
  </el-table>

  <!-- 分页区域 -->
  <!--  :page-sizes  可供选择的列表项 -->
  <el-pagination
    v-model:current-page="params.pagenum "
    v-model:page-size="params.pagesize"
    :page-sizes="[2, 3, 5, 10]"
    :background="true"
    layout="jumper, total, sizes, prev, pager, next"
    :total="total"
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
    style="margin-top: 20px; justify-content: flex-end"
  />

  <!-- 抽屉 -->
  <article-edit ref="articleEditRef"></article-edit>
</page-container>
</template>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
