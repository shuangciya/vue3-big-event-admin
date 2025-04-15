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

//添加文章管理
// 注意：data需要是一个formData格式的对象
export const artPublishService = (data) => {
  return request.post('/my/article/add',data)
}

// 获取文章管理详情
export const artGetDetailService = (id) => {
  return request.get('/my/article/info',{
    params: {
      id
    }
  })
}

// 编辑文章管理
export const artEditService = (data) => request.put('/my/article/info',data)

// 删除文章管理
export const artDelManageService = (id) => request.delete('/my/article/info',{
  params:{id}
})

// put post 直接写参数
// get delect 需{params: 写参数}


