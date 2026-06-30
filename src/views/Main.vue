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
          <div class="notification-dropdown" ref="notificationRef">
            <button class="notification-trigger" @click="toggleNotificationPanel">
              <svg class="notification-bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
            </button>
            <div v-if="notificationPanelOpen" class="notification-panel">
              <div class="notification-panel-header">
                <h3 class="notification-panel-title">通知消息</h3>
                <div class="notification-actions">
                  <button v-if="unreadCount > 0" class="notification-read-all-btn" @click="markAllNotificationsRead">全部已读</button>
                  <button v-if="notifications.length > 0" class="notification-delete-btn" title="清空通知" @click="clearNotifications">
                    <svg class="notification-delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18"></path>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="notification-tabs">
                <button v-for="tab in notificationTabs" :key="tab.key" class="notification-tab" :class="{ active: notificationFilter === tab.key }" @click="handleNotificationFilterChange(tab.key)">
                  {{ tab.label }}
                  <span v-if="getNotificationUnreadCount(tab.key)" class="notification-tab-count">{{ getNotificationUnreadCount(tab.key) }}</span>
                </button>
              </div>
              <div class="notification-list">
                <div v-if="filteredNotifications.length === 0" class="notification-empty">
                  <svg class="notification-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <p>暂无通知</p>
                </div>
                <div v-else class="notification-items">
                  <div v-for="item in filteredNotifications" :key="item.id" class="notification-item" :class="{ unread: !item.read }" @click="handleNotificationClick(item)">
                    <div class="notification-icon-box" :class="'notification-icon-' + item.category">
                      <svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <g v-if="item.category === 'schedule'"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path><path d="M9 16l2 2 4-4"></path></g>
                        <g v-else-if="item.category === 'reschedule'"><path d="M8 7h11"></path><path d="M15 3l4 4-4 4"></path><path d="M16 17H5"></path><path d="M9 21l-4-4 4-4"></path></g>
                        <g v-else-if="item.category === 'system'"><path d="M3 11l18-5v12L3 13v-2z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></g>
                        <g v-else><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></g>
                      </svg>
                    </div>
                    <div class="notification-content">
                      <div class="notification-title-row">
                        <h4 class="notification-title">{{ item.title }}</h4>
                        <span class="notification-time">{{ item.time }}</span>
                      </div>
                      <p class="notification-text">{{ item.content }}</p>
                      <div v-if="!item.read" class="notification-unread-row"><span class="notification-unread-dot"></span><span class="notification-unread-text">未读</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="filteredNotifications.length > 0" class="notification-footer">
                <button class="notification-footer-btn" @click="openApplicationsModal">查看我的调课申请 →</button>
              </div>
            </div>
          </div>
          <div class="user-dropdown" ref="dropdownRef">
            <button class="user-trigger" @click="userDropdownOpen = !userDropdownOpen; notificationPanelOpen = false">
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
      <reschedule-applications-modal :visible.sync="applicationsVisible"></reschedule-applications-modal>
    </div>
  </div>
</template>

<script>
  import TodayClasses from './TodayClasses.vue';
  import MyCourses from './MyCourses.vue';
  import ResourcesPage from './ResourcesPage.vue';
  import ProfilePage from './Profile.vue';
  import ResourceDetail from './ResourceDetail.vue';
  import RescheduleApplicationsModal from '@/components/business/RescheduleApplicationsModal.vue';
  import auth from '@/api/auth';
  import noticeApi from '@/api/notice';

  export default {
    name: 'MainLayout',
    components: {
      TodayClasses,
      MyCourses,
      ResourcesPage,
      ProfilePage,
      ResourceDetail,
      RescheduleApplicationsModal,
    },
    data() {
      return {
        activeTab: 'today',
        loading: false,
        sidebarCollapsed: false,
        mobileMenuOpen: false,
        userDropdownOpen: false,
        notificationPanelOpen: false,
        notificationFilter: 'all',
        notifications: [],
        notificationLoading: false,
        notificationTimer: null,
        noticePageNum: 1,
        noticePageSize: 1000,
        noticeTotal: 0,
        applicationsVisible: false,
        resourceDetailId: null,
        sidebarMenus: [
          { id: 'today', name: '今日课堂' },
          { id: 'my-courses', name: '我的课程' },
          { id: 'resources', name: '资源库' },
          // { id: 'profile', name: '个人中心' },
        ],
        notificationTabs: [
          { key: 'all', label: '全部' },
          { key: 'schedule', label: '排课' },
          { key: 'reschedule', label: '调课' },
          { key: 'system', label: '系统' },
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
      unreadCount() {
        return this.notifications.filter(item => !item.read).length;
      },
      filteredNotifications() {
        if (this.notificationFilter === 'all') {
          return this.notifications;
        }
        return this.notifications.filter(item => item.category === this.notificationFilter);
      },
    },
    mounted() {
      document.addEventListener('mousedown', this.handleClickOutside);
      this.fetchNotifications();
      this.startNotificationTimer();
    },
    beforeDestroy() {
      document.removeEventListener('mousedown', this.handleClickOutside);
      this.stopNotificationTimer();
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
        if (this.$refs.notificationRef && !this.$refs.notificationRef.contains(event.target)) {
          this.notificationPanelOpen = false;
        }
      },
      toggleNotificationPanel() {
        this.notificationPanelOpen = !this.notificationPanelOpen;
        if (this.notificationPanelOpen) {
          this.userDropdownOpen = false;
          this.fetchNotifications();
        }
      },
      handleNotificationFilterChange(filter) {
        this.notificationFilter = filter;
      },
      getLoginUserId() {
        const userInfoStr = sessionStorage.getItem('userInfo');
        if (!userInfoStr) {
          return null;
        }
        try {
          const userInfo = JSON.parse(userInfoStr);
          return userInfo && (userInfo.userId || userInfo.id || userInfo.teacherId);
        } catch (error) {
          return null;
        }
      },
      async fetchNotifications() {
        const userId = this.getLoginUserId();
        if (!userId || this.notificationLoading) {
          return;
        }
        this.notificationLoading = true;
        try {
          const res = await noticeApi.page({
            userId,
            userType: 'teacher',
            pageNum: this.noticePageNum,
            pageSize: this.noticePageSize,
          });
          if (this.isSuccessResult(res)) {
            const pageData = res.data || {};
            const list = Array.isArray(pageData.list) ? pageData.list : [];
            this.notifications = list.map(this.normalizeNotification).filter(item => item.rawId !== undefined && item.rawId !== null);
            this.noticeTotal = pageData.total || this.notifications.length;
          }
        } catch (error) {
          console.error('获取通知消息失败:', error);
        } finally {
          this.notificationLoading = false;
        }
      },
      normalizeNotification(item) {
        const category = this.getNotificationCategory(item.msgType);
        return {
          id: String(item.id),
          rawId: item.id,
          category,
          msgType: item.msgType,
          title: item.title || this.getNotificationTypeName(item.msgType),
          content: item.content || '',
          time: this.formatNoticeTime(item.createTime),
          read: Number(item.isRead) === 1,
          createTime: item.createTime,
          readTime: item.readTime,
        };
      },
      getNotificationCategory(msgType) {
        const type = Number(msgType);
        if (type === 2) {
          return 'schedule';
        }
        if (type === 3) {
          return 'reschedule';
        }
        if (type === 1) {
          return 'system';
        }
        return 'default';
      },
      getNotificationTypeName(msgType) {
        const type = Number(msgType);
        if (type === 2) {
          return '排课消息';
        }
        if (type === 3) {
          return '调课消息';
        }
        if (type === 1) {
          return '系统公告';
        }
        return '通知消息';
      },
      formatNoticeTime(time) {
        if (!time) {
          return '';
        }
        const date = new Date(time);
        if (Number.isNaN(date.getTime())) {
          return String(time);
        }
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        const pad = value => String(value).padStart(2, '0');
        if (target === today) {
          return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
        }
        if (target === today - 24 * 60 * 60 * 1000) {
          return '昨天';
        }
        if (target === today - 2 * 24 * 60 * 60 * 1000) {
          return '前天';
        }
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      },
      getNotificationUnreadCount(filter) {
        return this.notifications.filter(item => !item.read && (filter === 'all' || item.category === filter)).length;
      },
      async handleNotificationClick(item) {
        if (item.read) {
          this.notificationPanelOpen = false;
          return;
        }
        try {
          const res = await noticeApi.markRead(item.rawId);
          if (this.isSuccessResult(res)) {
            this.notifications = this.notifications.map(notification =>
              notification.id === item.id ? { ...notification, read: true } : notification
            );
            this.notificationPanelOpen = false;
          } else {
            this.$message && this.$message.error((res && res.message) || '标记已读失败');
          }
        } catch (error) {
          console.error('标记通知已读失败:', error);
          this.$message && this.$message.error('标记已读失败');
        }
      },
      async markAllNotificationsRead() {
        if (this.unreadCount === 0) {
          return;
        }
        try {
          const res = await noticeApi.markAllRead();
          if (this.isSuccessResult(res)) {
            this.notifications = this.notifications.map(item => ({ ...item, read: true }));
            this.$message && this.$message.success('已全部标记为已读');
          } else {
            this.$message && this.$message.error((res && res.message) || '全部已读失败');
          }
        } catch (error) {
          console.error('全部标记已读失败:', error);
          this.$message && this.$message.error('全部已读失败');
        }
      },
      async clearNotifications() {
        const ids = this.notifications.map(item => Number(item.rawId)).filter(id => !Number.isNaN(id));
        if (ids.length === 0) {
          return;
        }
        try {
          const res = await noticeApi.deleteByIds(ids);
          if (this.isSuccessResult(res)) {
            this.notifications = [];
            this.noticeTotal = 0;
            this.$message && this.$message.success('通知已清空');
          } else {
            this.$message && this.$message.error((res && res.message) || '删除通知失败');
          }
        } catch (error) {
          console.error('删除通知失败:', error);
          this.$message && this.$message.error('删除通知失败');
        }
      },
      openApplicationsModal() {
        this.notificationPanelOpen = false;
        this.applicationsVisible = true;
      },
      startNotificationTimer() {
        this.stopNotificationTimer();
        this.notificationTimer = setInterval(() => {
          this.fetchNotifications();
        }, 30000);
      },
      stopNotificationTimer() {
        if (this.notificationTimer) {
          clearInterval(this.notificationTimer);
          this.notificationTimer = null;
        }
      },
      isSuccessResult(res) {
        return res && (res.success === true || res.code === 200);
      },
      goToProfile() {
        this.notificationPanelOpen = false;
        this.userDropdownOpen = false;
        this.activeTab = 'profile';
      },
      goToSecurity() {
        this.notificationPanelOpen = false;
        this.userDropdownOpen = false;
        this.activeTab = 'profile';
        this.$nextTick(() => {
          if (this.$refs.profileRef) {
            this.$refs.profileRef.activeTab = 'security';
          }
        });
      },
      async handleLogout() {
        this.notificationPanelOpen = false;
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

  .notification-dropdown {
    position: relative;
  }

  .notification-trigger {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: none;
    background: transparent;
    color: #6b7280;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .notification-trigger:hover {
    background: #f3f4f6;
    color: #4b5563;
  }

  .notification-bell-icon {
    width: 20px;
    height: 20px;
  }

  .notification-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    background: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: 700;
    line-height: 18px;
    border-radius: 999px;
    text-align: center;
  }

  .notification-panel {
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    width: 380px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    z-index: 100;
    overflow: hidden;
    animation: notification-panel-in 0.2s ease;
  }

  @keyframes notification-panel-in {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .notification-panel-header {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .notification-panel-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }

  .notification-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .notification-read-all-btn,
  .notification-delete-btn,
  .notification-tab,
  .notification-footer-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .notification-read-all-btn {
    padding: 4px 8px;
    color: #2563eb;
    font-size: 12px;
    border-radius: 4px;
  }

  .notification-read-all-btn:hover {
    background: #eff6ff;
  }

  .notification-delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    color: #9ca3af;
    border-radius: 4px;
  }

  .notification-delete-btn:hover {
    background: #fef2f2;
    color: #ef4444;
  }

  .notification-delete-icon {
    width: 14px;
    height: 14px;
  }

  .notification-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border-bottom: 1px solid #f3f4f6;
    background: rgba(249, 250, 251, 0.5);
  }

  .notification-tab {
    padding: 4px 12px;
    color: #6b7280;
    font-size: 12px;
    font-weight: 500;
    border-radius: 999px;
  }

  .notification-tab:hover {
    background: #f3f4f6;
  }

  .notification-tab.active {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .notification-tab-count {
    margin-left: 4px;
    color: #ef4444;
    font-size: 10px;
  }

  .notification-list {
    max-height: 360px;
    overflow-y: auto;
  }

  .notification-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: #9ca3af;
  }

  .notification-empty-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
    opacity: 0.3;
  }

  .notification-empty p {
    margin: 0;
    font-size: 14px;
  }

  .notification-item {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .notification-item + .notification-item {
    border-top: 1px solid #f9fafb;
  }

  .notification-item:hover {
    background: #f9fafb;
  }

  .notification-item.unread {
    background: rgba(239, 246, 255, 0.3);
  }

  .notification-icon-box {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .notification-icon-box.notification-icon-schedule {
    background: #eff6ff;
    border-color: #dbeafe;
    color: #2563eb;
  }

  .notification-icon-box.notification-icon-reschedule {
    background: #fffbeb;
    border-color: #fef3c7;
    color: #d97706;
  }

  .notification-icon-box.notification-icon-system {
    background: #f8fafc;
    border-color: #e2e8f0;
    color: #475569;
  }

  .notification-icon-box.notification-icon-default {
    background: #f9fafb;
    border-color: #f3f4f6;
    color: #4b5563;
  }

  .notification-icon {
    width: 16px;
    height: 16px;
  }

  .notification-content {
    flex: 1;
    min-width: 0;
  }

  .notification-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  .notification-title {
    margin: 0;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
  }

  .notification-item.unread .notification-title {
    color: #111827;
    font-weight: 600;
  }

  .notification-time {
    flex-shrink: 0;
    margin-top: 2px;
    color: #9ca3af;
    font-size: 11px;
  }

  .notification-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 2px 0 0;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.625;
  }

  .notification-unread-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
  }

  .notification-unread-dot {
    width: 6px;
    height: 6px;
    background: #ef4444;
    border-radius: 50%;
  }

  .notification-unread-text {
    color: #ef4444;
    font-size: 11px;
    font-weight: 500;
  }

  .notification-footer {
    padding: 8px 16px;
    border-top: 1px solid #f3f4f6;
    background: rgba(249, 250, 251, 0.5);
    text-align: center;
  }

  .notification-footer-btn {
    color: #2563eb;
    font-size: 12px;
    font-weight: 500;
  }

  .notification-footer-btn:hover {
    color: #1d4ed8;
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

    .notification-panel {
      right: -52px;
      width: calc(100vw - 32px);
      max-width: 380px;
    }
  }
</style>
