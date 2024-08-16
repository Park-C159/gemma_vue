<template>
<!--  <img alt="Vue logo" src="./assets/logo.png">-->
<!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <table></table>
  <ChatContent />
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import ChatContent from './components/ChatContent.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    ChatContent,
  }
}
</script>

<style>
body, html, head{
  margin: 0;
  padding: 0;
}
*{
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
