<template>
  <div id="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="JavaScript 全栈式开发进阶"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  data: () => {
    return {};
  },
  components: {
    HelloWorld
  }
}
</script>
