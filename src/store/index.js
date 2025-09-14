import { createPinia } from 'pinia'
import persist from './plugins/persist'

const pinia = createPinia()

// 注册持久化插件
pinia.use(persist)

export default pinia
