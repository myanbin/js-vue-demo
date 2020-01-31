<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <p>本项目是“JavaScript 全栈式开发进阶”培训的课后作业。<a href="https://github.com/myanbin/js-vue-demo" target="_blank" rel="noopener">查看源代码</a>
    </p>
    <h2>相关文档</h2>
    <ul>
      <li><a href="https://github.com/myanbin/js-express-app/blob/master/README.md" target="_blank" rel="noopener">RESTful API</a></li>
    </ul>
    <h2></h2>
    <ul>
      <li>&copy; 2020 马艳彬 版权所有</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'README',
  props: {
    title: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
