import { createApp } from 'vue'
import App from './App.vue'
import io from 'socket.io-client'
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"

// 创建 WebSocket 连接
const socket = io('http://localhost:5000')

const app = createApp(App)

// 将 socket 注入到所有组件中
app.config.globalProperties.$socket = socket
app.use(ElementPlus)

app.mount('#app')
