<template>
  <div>
    <div id="particles" />
  </div>
</template>

<script>
import 'particles.js'
import particlesConfig from './particles.json'

export default {
  data() {
    return {}
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      window.particlesJS('particles', particlesConfig)
    }
  }
}
</script>

<style scoped lang="scss">
#particles-js {
  width: 100%;
  height: 100%;
}
</style>
