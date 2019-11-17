<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // TODO: 如何数据持久化。数据持久化更新不了视图。暂时无解
    if (this.$wsCache.get('userInfo')) {
      this.$store.dispatch('GenerateRoutes').then(() => {
        this.$router.addRoutes(this.$store.getters.addRouters) // 动态添加可访问路由表
      })
    }
  }
}
</script>

<style lang="less">
.size {
  width: 100;
  height: 100%;
}
html,body {
  .size;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
