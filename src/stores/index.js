import { createPinia } from 'pinia'
import persist from "pinia-plugin-persistedstate";

// createPinia().use(persist)
const pinia = createPinia()
pinia.use(persist)
export default pinia

// import { useCounterStore } from "./counter";
// export {useCounterStore}
// 等价于
export * from './modules/user'//将user模块下的所有按需导出
