<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cacheList">
        <router-view class="view-main" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    tagNavList() {
      return this.$store.state.tagsView.visitedViews
    },
    cacheList() {
      return ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.noCache)).map(item => item.name) : []]
    }
  }
}
</script>

<style lang="less">
.app-main {
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
  background-color: #f5f7f9;
}
.affix--header+.app-main {
  padding-top: 50px;
}
.hasTagsView {
  .app-main {
    min-height: calc(100vh - 85px);
  }

  .affix--header+.app-main {
    padding-top: 85px;
  }
}
.view-main {
  padding: 20px;
}
</style>
