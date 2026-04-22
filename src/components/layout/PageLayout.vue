<template>
  <div class="page-layout">
    <div v-if="showTopNav" class="layout-top">
      <slot name="top"></slot>
    </div>
    
    <div class="layout-content" :class="{ 'with-top': showTopNav, 'with-bottom': showBottomNav }">
      <slot></slot>
    </div>
    
    <div v-if="showBottomNav" class="layout-bottom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageLayout',
  props: {
    showTopNav: {
      type: Boolean,
      default: false
    },
    showBottomNav: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.layout-top {
  flex-shrink: 0;
}

.layout-content {
  flex: 1;
  overflow: auto;
}

.layout-content.with-top {
  padding-top: 0;
}

.layout-content.with-bottom {
  padding-bottom: 0;
}

.layout-bottom {
  flex-shrink: 0;
}
</style>
