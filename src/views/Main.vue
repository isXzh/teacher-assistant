<template>
  <page-layout :show-top-nav="activeTab === 'today'" :show-bottom-nav="true">
    <template #top>
      <top-nav
        title="兴图教学助手"
        :show-logout="true"
        :loading="loading"
        @logout="handleLogout"
        @refresh="handleRefresh"
      ></top-nav>
    </template>
    
    <template #bottom>
      <bottom-nav
        :active-tab="activeTab"
        @tab-change="handleTabChange"
      ></bottom-nav>
    </template>
    
    <div class="main-content">
      <today-classes v-if="activeTab === 'today'" ref="todayClassesRef"></today-classes>
      <profile v-if="activeTab === 'profile'"></profile>
    </div>
  </page-layout>
</template>

<script>
import PageLayout from '@/components/layout/PageLayout.vue'
import TopNav from '@/components/layout/TopNav.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import TodayClasses from './TodayClasses.vue'
import Profile from './Profile.vue'
import auth from '@/api/auth'

export default {
  name: 'Main',
  components: {
    PageLayout,
    TopNav,
    BottomNav,
    TodayClasses,
    Profile
  },
  data() {
    return {
      activeTab: 'today',
      loading: false
    }
  },
  methods: {
    handleTabChange(tabId) {
      this.activeTab = tabId
    },
    async handleLogout() {
      try {
        await auth.logout()
        this.$store.dispatch('user/logout')
        this.$router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    },
    async handleRefresh() {
      if (this.$refs.todayClassesRef && this.$refs.todayClassesRef.fetchCourses) {
        this.loading = true
        try {
          await this.$refs.todayClassesRef.fetchCourses()
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style scoped>
.main-content {
  flex: 1;
  overflow: hidden;
  background: #F5F7FA;
}
</style>
