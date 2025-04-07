import { defineStore } from "pinia"
import { ref } from "vue"

// 用户模块 token setToken removeToken
export const useUserStore = defineStore('big-user',() => {
  // 定义数据
  const token = ref('')
  // 定义操作数据的方法
  const setToken = (newToken) => {
    token.value = newToken
  }
  const removeToken = () => {
    token.value = ''
  }
  return{
    token,
    setToken,
    removeToken
  }
},{
  persist:true
})

