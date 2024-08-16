<template>
  <div id="content">
    <div class="title">Gemma大模型</div>
    <div class="chat-container">
      <ul class="chat-log">
        <li v-for="(msg, index) in messages" :key="index" v-html="renderMarkdown(msg)" class="chat-message"></li>
      </ul>
    </div>

    <div class="input-container">
      <input v-model="message" @keyup.enter="sendMessage" placeholder="输入你的消息..." class="chat-input"/>
      <el-button v-if="!isReciving" size="large" @click="sendMessage" class="send-button">发送</el-button>
      <el-button v-else size="large" type="primary" disabled>发送</el-button>
    </div>
  </div>
</template>

<script>
import {marked} from "marked"
import hljs from "highlight.js"
import "highlight.js/styles/monokai-sublime.css"

export default {
  data() {
    return {
      message: '',
      messages: [],
      partialMsg: "# Gemma：\n",  // 当前正在接收的消息
      isReciving: false,
    }
  },
  mounted() {
    // 监听 WebSocket 消息
    this.$socket.on('message', (msg) => {
      this.partialMsg += msg;

      if (this.messages.length === 0 || this.messages[this.messages.length - 1].endsWith("<end_of_turn>")) {
        this.messages.push(this.partialMsg);  // 开始新的消息

      } else {
        this.messages[this.messages.length - 1] = this.partialMsg;  // 更新当前正在显示的消息
      }

      if (msg.endsWith("<end_of_turn>")) {
        this.messages[this.messages.length - 1] = this.partialMsg.replace("<end_of_turn>", '');
        this.partialMsg = '# Gemma：\n';  // 重置
        this.isReciving = false

      }
    });
    this.hanleHightLight()
  },
  updated() {
    this.scrollToBottom()
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== '') {
        this.messages.push("用户：\n" + this.message + "<end_of_turn>");
        this.isReciving = true
        this.$socket.send(this.message);
        this.message = '';
      }
    },
    renderMarkdown(msg) {
      const rendered = marked(msg);
      this.$nextTick(()=>{
        this.hanleHightLight()
      })
      return rendered
    },
    scrollToBottom() {
      const chatLog = this.$el.querySelector('.chat-log');
      chatLog.scrollTop = chatLog.scrollHeight;
    },
    hanleHightLight(){
      let blocks = document.querySelectorAll("pre code");
      blocks.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  },
}

</script>

<style scoped>
#content {
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.chat-container {
  width: 100%;
  margin: 0 auto;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: calc(100% - 50px - 2.5em - 10%);
}

.title {
  font-size: 2em;
  line-height: 2.5em;
  font-weight: 600;
}

.chat-log {
  list-style-type: none;
  padding: 0;
  height: 100%;
  overflow-y: auto;
}

.chat-message {
  padding: 10px 10px 10px 30px;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: left;
  white-space: pre-wrap;
}

.input-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.chat-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-right: 10px;
}

.send-button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.send-button:hover {
  background-color: #0056b3;
}

.chat-log::-webkit-scrollbar {
  width: 2px;
}

.chat-log::-webkit-scrollbar-thumb {
  background-color: #007BFF;
  border-radius: 4px;
}

.hljs {
  background: #272822; /* Monokai 主题的背景色（黑色） */
  color: #f8f8f2; /* Monokai 主题的文本颜色（白色） */
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre; /* 保持代码的空格和缩进 */
}

/* 代码块的滚动条样式 */
.hljs::-webkit-scrollbar {
  width: 8px;
}

.hljs::-webkit-scrollbar-thumb {
  background-color: #444; /* 滚动条颜色 */
  border-radius: 4px;
}
</style>
