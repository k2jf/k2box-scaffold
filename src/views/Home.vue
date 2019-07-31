<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {demo} from "../api";

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  mounted () {
    // recommended: use api methods in src/api
    demo()
      .then(data => console.log(data))
      .catch(err => {
        this.$Message.warning(err.message);
      });

    // in-component use
    this.$axios.post(`/hello-k2-box`, { // with default baseUrl: /api
      // request body
      params: 'foobar'
    }).then(resp => resp.data);
  }
}
</script>
