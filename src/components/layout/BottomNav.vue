<template>
  <div class="bottom-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="nav-item"
      :class="{ active: activeTab === tab.id }"
      @click="handleTabChange(tab.id)"
    >
      <svg class="nav-icon" :class="{ active: activeTab === tab.id }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="tab.id === 'today'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 002 2h5a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2V9z"></path>
        <path v-else-if="tab.id === 'profile'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m12-10v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m12-10h.01M12 12a4 4 0 110-8 0 4 4 0 1108 0z"></path>
      </svg>
      <span class="nav-text" :class="{ active: activeTab === tab.id }">{{ tab.name }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'BottomNav',
  props: {
    activeTab: {
      type: String,
      default: 'today'
    },
    tabs: {
      type: Array,
      default: () => [
        { id: 'today', name: '今日课堂' },
        { id: 'profile', name: '我的' }
      ]
    }
  },
  methods: {
    handleTabChange(tabId) {
      this.$emit('tab-change', tabId)
    }
  }
}
</script>

<style scoped>
.bottom-nav {
  height: 64px;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 88px;
  min-height: 44px;
}

.nav-item:hover {
  background: #f5f5f5;
}

.nav-item.active {
  color: #2979FF;
}

.nav-icon {
  width: 24px;
  height: 24px;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.nav-icon.active {
  color: #2979FF;
}

.nav-text {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  transition: color 0.2s ease;
}

.nav-text.active {
  color: #2979FF;
}
</style>
