<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  data() {
    return {
      helloWorld: true,
    }
  },
  head() {
    return {
      title: this.helloWorld ? 'Hello World' : 'Vue 2 Head',
      meta: [
        {
          name: 'description',
          content: 'Vue 2 Head is a Vue 3 composition API for managing the document head.',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: 'https://vueuse.org/logo.png',
        },
      ],
    }
  },
}
</script>

<template>
  <div id="app">
    <HelloWorld v-if="helloWorld" msg="Welcome to Your Vue.js App" />
    <button @click="helloWorld = !helloWorld">
      Toggle Hello World
    </button>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
