<template>
  <div id="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <README title="JavaScript 全栈式开发进阶"/>
  </div>
</template>

<script>
// @ is an alias to /src
import README from '@/components/README.vue'

export default {
  name: 'home',
  data: () => {
    return {};
  },
  components: {
    README
  }
}
</script>
