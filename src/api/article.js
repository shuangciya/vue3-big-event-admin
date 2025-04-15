import request from "@/utils/request";

// 获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')

// 添加文章分类
export const artAddChannelService = ({cate_name,cate_alias}) => request.post('/my/cate/add',{cate_name,cate_alias})

// 编辑文章分类
export const artEditChannelService = ({id,cate_name,cate_alias}) => request.put('/my/cate/info',{id,cate_name,cate_alias})

// 删除文章分类
export const artDelChannelService = (id) => request.delete('/my/cate/del',{
  params:{id}
})

// 获取文章管理列表
export const artGetManageService = (params) => {
  return request.get('/my/article/list',{
    params
  })
}

// 删除文章管理
export const artDelManageService = (id) => request.delete('/my/article/info',{
  params:{id}
})
