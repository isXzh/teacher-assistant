<template>
  <div class="main-layout">
    <!-- PC/平板端左侧导航栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Logo区域 -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <div v-if="!sidebarCollapsed" class="logo-text">
          <h1 class="logo-title">兴图教学助手</h1>
          <p class="logo-subtitle">教师助手</p>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <button
          v-for="menu in sidebarMenus"
          :key="menu.id"
          class="nav-item"
          :class="{ active: activeTab === menu.id }"
          :title="sidebarCollapsed ? menu.name : ''"
          @click="handleTabChange(menu.id)"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="menu.id === 'today'" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <path v-if="menu.id === 'today'" d="M9 22V12h6v10"></path>
            <path v-if="menu.id === 'my-courses'" d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path v-if="menu.id === 'my-courses'" d="M6 12v5c3 3 9 3 12 0v-5"></path>
            <path v-if="menu.id === 'resources'" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path v-if="menu.id === 'resources'" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            <path v-if="menu.id === 'profile'" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle v-if="menu.id === 'profile'" cx="12" cy="7" r="4"></circle>
          </svg>
          <span v-if="!sidebarCollapsed" class="nav-label">{{ menu.name }}</span>
        </button>
      </nav>

      <!-- 底部折叠按钮 -->
      <div class="sidebar-footer">
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg
            v-if="sidebarCollapsed"
            class="btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <div class="main-area">
      <!-- 顶部导航栏 -->
      <header class="top-header">
        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <svg
            v-if="mobileMenuOpen"
            class="btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- 页面标题 - 移动端显示 -->
        <h2 class="mobile-page-title">{{ currentPageTitle }}</h2>

        <!-- 右侧用户信息 -->
        <div class="header-right">
          <div class="user-dropdown" ref="dropdownRef">
            <button class="user-trigger" @click="userDropdownOpen = !userDropdownOpen">
              <div class="user-avatar">{{ userNameFirstChar }}</div>
              <span class="user-name">{{ userName }}</span>
              <svg
                class="dropdown-arrow"
                :class="{ open: userDropdownOpen }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <!-- 下拉菜单 -->
            <div v-if="userDropdownOpen" class="dropdown-menu">
              <button class="dropdown-item" @click="goToProfile">
                <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                个人中心
              </button>
              <button class="dropdown-item" @click="goToSecurity">
                <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                修改密码
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item danger" @click="handleLogout">
                <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 移动端侧边菜单遮罩 -->
      <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>

      <!-- 移动端侧边菜单 -->
      <div class="mobile-sidebar" :class="{ open: mobileMenuOpen }">
        <div class="mobile-sidebar-header">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <div class="logo-text">
            <h1 class="logo-title">兴图教学助手</h1>
            <p class="logo-subtitle">教师助手</p>
          </div>
        </div>
        <nav class="mobile-sidebar-nav">
          <button
            v-for="menu in sidebarMenus"
            :key="menu.id"
            class="nav-item"
            :class="{ active: activeTab === menu.id }"
            @click="
              handleTabChange(menu.id);
              mobileMenuOpen = false;
            "
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="menu.id === 'today'" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <path v-if="menu.id === 'today'" d="M9 22V12h6v10"></path>
              <path v-if="menu.id === 'my-courses'" d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path v-if="menu.id === 'my-courses'" d="M6 12v5c3 3 9 3 12 0v-5"></path>
              <path v-if="menu.id === 'resources'" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path v-if="menu.id === 'resources'" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              <path v-if="menu.id === 'profile'" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle v-if="menu.id === 'profile'" cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="nav-label">{{ menu.name }}</span>
          </button>
        </nav>
      </div>

      <!-- 内容区域 -->
      <main class="main-content">
        <today-classes
          v-if="activeTab === 'today'"
          ref="todayClassesRef"
          :loading="loading"
          @refresh="handleRefresh"
        ></today-classes>
        <my-courses
          v-if="activeTab === 'my-courses' && !resourceDetailId"
          @view-detail="handleViewResourceDetail"
        ></my-courses>
        <resource-detail
          v-if="activeTab === 'my-courses' && resourceDetailId"
          :resource-id="resourceDetailId"
          @back="handleBackFromDetail"
        ></resource-detail>
        <resources-page
          v-if="activeTab === 'resources' && !resourceDetailId"
          @view-detail="handleViewResourceDetail"
        ></resources-page>
        <resource-detail
          v-if="activeTab === 'resources' && resourceDetailId"
          :resource-id="resourceDetailId"
          @back="handleBackFromDetail"
        ></resource-detail>
        <profile-page v-if="activeTab === 'profile'" ref="profileRef"></profile-page>
      </main>
    </div>
  </div>
</template>

<script>
  import TodayClasses from './TodayClasses.vue';
  import MyCourses from './MyCourses.vue';
  import ResourcesPage from './ResourcesPage.vue';
  import ProfilePage from './Profile.vue';
  import ResourceDetail from './ResourceDetail.vue';
  import auth from '@/api/auth';

  export default {
    name: 'Main',
    components: {
      TodayClasses,
      MyCourses,
      ResourcesPage,
      ProfilePage,
      ResourceDetail,
    },
    data() {
      return {
        activeTab: 'today',
        loading: false,
        sidebarCollapsed: false,
        mobileMenuOpen: false,
        userDropdownOpen: false,
        resourceDetailId: null,
        sidebarMenus: [
          { id: 'today', name: '今日课堂' },
          { id: 'my-courses', name: '我的课程' },
          { id: 'resources', name: '资源库' },
          // { id: 'profile', name: '个人中心' },
        ],
      };
    },
    computed: {
      currentPageTitle() {
        const menu = this.sidebarMenus.find(m => m.id === this.activeTab);
        return menu ? menu.name : '';
      },
      userName() {
        const userInfoStr = sessionStorage.getItem('userInfo');
        if (!userInfoStr) {
          return '教师';
        }
        const userInfo = JSON.parse(userInfoStr);

        return userInfo?.realName || '教师';
      },
      userNameFirstChar() {
        return this.userName.charAt(0);
      },
    },
    mounted() {
      document.addEventListener('mousedown', this.handleClickOutside);
    },
    beforeDestroy() {
      document.removeEventListener('mousedown', this.handleClickOutside);
    },
    methods: {
      handleTabChange(tabId) {
        if (tabId !== this.activeTab) {
          this.resourceDetailId = null;
        }
        this.activeTab = tabId;
      },
      handleViewResourceDetail(id) {
        this.resourceDetailId = id;
      },
      handleBackFromDetail() {
        this.resourceDetailId = null;
      },
      handleClickOutside(event) {
        if (this.$refs.dropdownRef && !this.$refs.dropdownRef.contains(event.target)) {
          this.userDropdownOpen = false;
        }
      },
      goToProfile() {
        this.userDropdownOpen = false;
        this.activeTab = 'profile';
      },
      goToSecurity() {
        this.userDropdownOpen = false;
        this.activeTab = 'profile';
        this.$nextTick(() => {
          if (this.$refs.profileRef) {
            this.$refs.profileRef.activeTab = 'security';
          }
        });
      },
      async handleLogout() {
        this.userDropdownOpen = false;
        try {
          await auth.logout();
          // this.$store.dispatch('user/logout')
          this.$router.push('/login');
        } catch (error) {
          console.error('退出登录失败:', error);
        }
      },
      async handleRefresh() {
        if (this.$refs.todayClassesRef && this.$refs.todayClassesRef.fetchCourses) {
          this.loading = true;
          try {
            await this.$refs.todayClassesRef.fetchCourses();
          } finally {
            this.loading = false;
          }
        }
      },
    },
  };
</script>

<style scoped>
  .main-layout {
    display: flex;
    height: 100vh;
    background: #f5f7fa;
    overflow: hidden;
  }

  /* 左侧导航栏 */
  .sidebar {
    display: none;
    flex-direction: column;
    background: white;
    border-right: 1px solid #e8e8e8;
    transition: width 0.3s ease;
    width: 224px;
    flex-shrink: 0;
  }

  .sidebar.collapsed {
    width: 64px;
  }

  @media (min-width: 768px) {
    .sidebar {
      display: flex;
    }
  }

  .sidebar-logo {
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid #f0f0f0;
    gap: 12px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background: #1e88e5;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .logo-icon svg {
    width: 18px;
    height: 18px;
  }

  .logo-text {
    overflow: hidden;
  }

  .logo-title {
    font-size: 14px;
    font-weight: 700;
    color: #1e88e5;
    margin: 0;
    white-space: nowrap;
  }

  .logo-subtitle {
    font-size: 12px;
    color: #999;
    margin: 0;
    white-space: nowrap;
  }

  .sidebar-nav {
    flex: 1;
    padding: 16px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: #666;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
  }

  .nav-item:hover {
    background: #f5f5f5;
  }

  .nav-item.active {
    background: #e3f2fd;
    color: #1e88e5;
  }

  .nav-item.active .nav-icon {
    color: #1e88e5;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
    color: #888;
    flex-shrink: 0;
  }

  .nav-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-footer {
    padding: 8px;
    border-top: 1px solid #f0f0f0;
  }

  .collapse-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: none;
    background: transparent;
    color: #999;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .collapse-btn:hover {
    background: #f5f5f5;
    color: #666;
  }

  .collapse-btn .btn-icon {
    width: 20px;
    height: 20px;
  }

  /* 主内容区域 */
  .main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  /* 顶部导航栏 */
  .top-header {
    height: 56px;
    background: white;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
  }

  .mobile-menu-btn {
    display: flex;
    padding: 8px;
    border: none;
    background: transparent;
    color: #666;
    border-radius: 8px;
    cursor: pointer;
  }

  .mobile-menu-btn:hover {
    background: #f5f5f5;
  }

  .mobile-menu-btn .btn-icon {
    width: 20px;
    height: 20px;
  }

  .mobile-page-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* 用户下拉 */
  .user-dropdown {
    position: relative;
  }

  .user-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .user-trigger:hover {
    background: #f5f5f5;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    background: #1e88e5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 500;
  }

  .user-name {
    font-size: 14px;
    color: #555;
  }

  .dropdown-arrow {
    width: 16px;
    height: 16px;
    color: #999;
    transition: transform 0.2s ease;
  }

  .dropdown-arrow.open {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    width: 180px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    border: 1px solid #f0f0f0;
    padding: 6px;
    z-index: 100;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-size: 14px;
    color: #555;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dropdown-item:hover {
    background: #e3f2fd;
    color: #1e88e5;
  }

  .dropdown-item.danger {
    color: #f44336;
  }

  .dropdown-item.danger:hover {
    background: #ffebee;
    color: #f44336;
  }

  .item-icon {
    width: 16px;
    height: 16px;
  }

  .dropdown-divider {
    height: 1px;
    background: #f0f0f0;
    margin: 6px 0;
  }

  /* 移动端侧边菜单遮罩 */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }

  /* 移动端侧边菜单 */
  .mobile-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 256px;
    background: white;
    z-index: 50;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .mobile-sidebar.open {
    transform: translateX(0);
  }

  .mobile-sidebar-header {
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid #f0f0f0;
    gap: 12px;
  }

  .mobile-sidebar-nav {
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* 内容区域 */
  .main-content {
    flex: 1;
    overflow: auto;
  }

  /* 响应式适配 */
  @media (min-width: 768px) {
    .mobile-menu-btn,
    .mobile-page-title,
    .mobile-overlay,
    .mobile-sidebar {
      display: none !important;
    }

    .top-header {
      justify-content: flex-end;
    }
  }

  @media (max-width: 640px) {
    .user-name {
      display: none;
    }
  }
</style>
