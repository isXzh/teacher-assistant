<template>
  <div class="today-classes">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">今日课堂</h2>
          <p class="page-subtitle">管理您的授课与辅讲任务，高效开展课堂教学</p>
        </div>
        <div class="header-right">
          <!-- 日期显示 -->
          <div class="date-display">
            <p class="date-text">{{ currentDate }}</p>
            <p class="week-text">{{ currentWeekDay }}</p>
          </div>
          <!-- 刷新按钮 -->
          <button class="schedule-btn" @click="handleRefresh">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M23 4v6h-6M1 20v-6h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="btn-text">{{ loading ? '刷新中' : '刷新' }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="page-body">
      <!-- 筛选按钮 -->
      <div class="filter-bar">
        <button
          v-for="filter in filterButtons"
          :key="filter.id"
          class="filter-btn"
          :class="{ active: activeFilter === filter.id }"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
          <span class="filter-count">{{ filter.count }}</span>
        </button>
      </div>

      <!-- 课程列表 -->
      <div v-if="filteredCourses.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6" stroke-width="2"></line>
            <line x1="8" y1="2" x2="8" y2="6" stroke-width="2"></line>
            <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"></line>
          </svg>
        </div>
        <p class="empty-text">暂无课程，好好休息吧</p>
      </div>

      <div v-else class="course-list">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="course-card"
          :class="{ ended: course.status === '已结束' }"
        >
          <!-- 左侧图片/状态区域 -->
          <div class="course-media">
            <div class="media-placeholder">
              <div class="media-gradient"></div>
              <!-- 状态标签 -->
              <div class="status-badge" :class="getStatusBadgeClass(course.status)">
                <span class="status-dot" :class="getStatusDotClass(course.status)"></span>
                <span class="status-text">{{ course.status }}</span>
              </div>
              <!-- 播放图标（未结束课程显示） -->
              <svg v-if="course.status !== '已结束'" class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>

          <!-- 右侧内容区域 -->
          <div class="course-content">
            <h3 class="course-name">{{ course.name }}</h3>

            <div class="course-meta">
              <span class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {{ course.teacher }}
              </span>
              <span class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ course.time }}
              </span>
            </div>

            <div v-if="course.classroom" class="course-meta">
              <span class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {{ course.classroom }}
              </span>
              <span v-if="course.period" class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {{ course.period }}
              </span>
            </div>

            <!-- 操作按钮 -->
            <div class="course-actions">
              <button
                v-if="course.controlStatus === 1"
                class="action-btn btn-primary"
                @click="handleEnterCourse(course)"
              >
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                进入课堂
              </button>

              <button
                v-else-if="course.controlStatus === 2"
                class="action-btn btn-early"
                @click="handleEnterCourse(course)"
              >
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                提前进入
              </button>

              <span
                v-else-if="course.status === '已结束'"
                class="action-btn btn-ended"
              >
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                已结束
              </span>

              <span
                v-else
                class="action-btn btn-disabled"
              >
                未到上课时间
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getCurrentDate, getCurrentWeekDay } from '@/utils/format';
  import homeApi from '@/api/home';

  export default {
    name: 'TodayClasses',
    data() {
      return {
        courses: [],
        isListenerRegistered: false,
        activeFilter: 'all',
      };
    },
    computed: {
      currentDate() {
        return getCurrentDate();
      },
      currentWeekDay() {
        return getCurrentWeekDay();
      },
      sseConnected() {
        return this.$store.getters['sse/isSseConnected'];
      },
      filterButtons() {
        return [
          { id: 'all', label: '全部', count: this.courses.length },
          { id: 'ongoing', label: '进行中', count: this.courses.filter(c => c.status === '进行中').length },
          { id: 'notstarted', label: '未开始', count: this.courses.filter(c => c.status === '未开始').length },
          { id: 'ended', label: '已结束', count: this.courses.filter(c => c.status === '已结束').length },
        ];
      },
      filteredCourses() {
        if (this.activeFilter === 'all') return this.courses;
        if (this.activeFilter === 'ongoing') return this.courses.filter(c => c.status === '进行中');
        if (this.activeFilter === 'notstarted') return this.courses.filter(c => c.status === '未开始');
        if (this.activeFilter === 'ended') return this.courses.filter(c => c.status === '已结束');
        return this.courses;
      },
    },
    props:{
      loading: {
        type: Boolean,
        default: false,
      }
    },

    async created() {
      await this.fetchCourses();
      await this.$store.dispatch('sse/initSSE');
      this.setupSSEConnectionWatcher();
    },
    beforeDestroy() {
      this.removeSSEConnectionWatcher();
      this.unregisterSSEEventListener();
    },
    methods: {
      setupSSEConnectionWatcher() {
        this.sseConnectionWatcher = setInterval(() => {
          if (this.sseConnected && !this.isListenerRegistered) {
            console.log('TodayClasses: 检测到SSE连接已建立，注册事件监听器');
            this.registerSSEEventListener();
          }
        }, 500);
      },

      removeSSEConnectionWatcher() {
        if (this.sseConnectionWatcher) {
          clearInterval(this.sseConnectionWatcher);
          this.sseConnectionWatcher = null;
        }
      },

      registerSSEEventListener() {
        if (this.isListenerRegistered) {
          console.log('TodayClasses: 事件监听器已注册，跳过重复注册');
          return;
        }

        try {
          this.$store.dispatch('sse/addEventListener', {
            event: 'classReminder',
            handler: this.handleClassReminder,
          });
          this.isListenerRegistered = true;
          console.log('TodayClasses: 事件监听器注册成功');
        } catch (error) {
          console.error('TodayClasses: 注册事件监听器失败:', error);
        }
      },

      unregisterSSEEventListener() {
        if (!this.isListenerRegistered) {
          return;
        }

        try {
          this.$store.dispatch('sse/removeEventListener', {
            event: 'classReminder',
            handler: this.handleClassReminder,
          });
          this.isListenerRegistered = false;
          console.log('TodayClasses: 事件监听器已移除');
        } catch (error) {
          console.error('TodayClasses: 移除事件监听器失败:', error);
        }
      },

      handleClassReminder(event) {
        try {
          const data = JSON.parse(event.data);
          console.log('收到课程提醒:', data);
          this.$alert(data.message, data.courseName, {
            confirmButtonText: '确定',
            callback: () => {
            }
          });
          this.fetchCourses();
        } catch (error) {
          console.error('解析课程提醒数据失败:', error);
        }
      },
      handleRefresh() {
        this.$emit('refresh');
        this.fetchCourses();
      },
      async fetchCourses() {
        try {
          this.courses = await this.$store.dispatch('course/fetchTodayCourses');
        } catch (error) {
          console.error('获取课程失败:', error);
          this.courses = [];
        }
      },
      getStatusBadgeClass(status) {
        if (status === '进行中') return 'status-ongoing';
        if (status === '已结束') return 'status-ended';
        if (status === '已取消') return 'status-cancelled';
        return 'status-pending';
      },
      getStatusDotClass(status) {
        if (status === '进行中') return 'dot-ongoing';
        if (status === '已结束') return 'dot-ended';
        if (status === '已取消') return 'dot-cancelled';
        return 'dot-pending';
      },
      canEnterCourse(course) {
        return course.controlStatus === 1 || course.controlStatus === 2;
      },
      async handleEnterCourse(course) {
        if (!this.canEnterCourse(course)) return;
        try {
          const response = await homeApi.enterClassroom(course.id);
          if (response.data) {
            console.log('进入课堂成功，开始建立SSE连接，scheduleId:', course.id);
            await this.$store.dispatch('sse/initSSE', course.id);
            console.log('SSE连接建立成功，跳转到课堂页面');
            this.$router.push(`/interaction/${course.id}`);
          } else {
            this.$message.error('进入课堂失败');
          }
        } catch (error) {
          console.error('进入课堂失败:', error);
          this.$message.error('进入课堂失败，请稍后重试');
        }
      },
    },
  };
</script>

<style scoped>
  .today-classes {
    min-height: 100vh;
    background: #F5F7FA;
    padding-bottom: 80px;
  }

  /* 页面头部 */
  .page-header {
    background: white;
    padding: 16px 24px;
    border-bottom: 1px solid #e8e8e8;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .header-left {
    flex: 1;
  }

  .page-title {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 4px 0;
  }

  .page-subtitle {
    font-size: 13px;
    color: #888;
    margin: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .date-display {
    text-align: right;
  }

  .date-text {
    font-size: 15px;
    font-weight: 600;
    color: #1E88E5;
    margin: 0;
  }

  .week-text {
    font-size: 13px;
    color: #999;
    margin: 0;
  }

  .schedule-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #E3F2FD;
    color: #1E88E5;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .schedule-btn:hover {
    background: #BBDEFB;
  }

  .schedule-btn .btn-icon {
    width: 16px;
    height: 16px;
  }

  /* 页面主体 */
  .page-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 24px;
  }

  /* 筛选栏 */
  .filter-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .filter-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #e0e0e0;
    background: white;
    color: #666;
  }

  .filter-btn:hover {
    border-color: #c0c0c0;
  }

  .filter-btn.active {
    background: #1E88E5;
    color: white;
    border-color: #1E88E5;
  }

  .filter-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
    background: #f0f0f0;
    color: #888;
  }

  .filter-btn.active .filter-count {
    background: rgba(255, 255, 255, 0.25);
    color: white;
  }

  /* 课程列表 */
  .course-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .course-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    display: flex;
    gap: 16px;
    transition: all 0.2s ease;
  }

  .course-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .course-card.ended {
    opacity: 0.75;
  }

  /* 左侧媒体区域 */
  .course-media {
    width: 200px;
    flex-shrink: 0;
  }

  .media-placeholder {
    width: 100%;
    aspect-ratio: 16 / 10;
    background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .media-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%);
  }

  .play-icon {
    width: 32px;
    height: 32px;
    color: rgba(255, 255, 255, 0.9);
    position: relative;
    z-index: 1;
  }

  /* 状态标签 */
  .status-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    z-index: 1;
  }

  .status-badge.status-ongoing {
    background: #E8F5E9;
    color: #2E7D32;
  }

  .status-badge.status-pending {
    background: #E3F2FD;
    color: #1565C0;
  }

  .status-badge.status-ended {
    background: #F5F5F5;
    color: #757575;
  }

  .status-badge.status-cancelled {
    background: #FFEBEE;
    color: #C62828;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .status-dot.dot-ongoing {
    background: #4CAF50;
  }

  .status-dot.dot-pending {
    background: #2196F3;
  }

  .status-dot.dot-ended {
    background: #9E9E9E;
  }

  .status-dot.dot-cancelled {
    background: #F44336;
  }

  /* 右侧内容区域 */
  .course-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .course-name {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 10px 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .course-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #888;
  }

  .meta-icon {
    width: 14px;
    height: 14px;
  }

  /* 操作按钮 */
  .course-actions {
    margin-top: auto;
    padding-top: 12px;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .action-btn .btn-icon {
    width: 16px;
    height: 16px;
  }

  .action-btn.btn-primary {
    background: #1E88E5;
    color: white;
  }

  .action-btn.btn-primary:hover {
    background: #1976D2;
  }

  .action-btn.btn-early {
    background: white;
    color: #1E88E5;
    border: 2px solid #1E88E5;
  }

  .action-btn.btn-early:hover {
    background: #E3F2FD;
  }

  .action-btn.btn-ended {
    background: #F5F5F5;
    color: #999;
    cursor: not-allowed;
  }

  .action-btn.btn-disabled {
    background: #F5F5F5;
    color: #bbb;
    cursor: not-allowed;
  }

  /* 空状态 */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
  }

  .empty-icon {
    width: 80px;
    height: 80px;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .empty-icon svg {
    width: 36px;
    height: 36px;
    color: #ccc;
  }

  .empty-text {
    font-size: 15px;
    color: #aaa;
    margin: 0;
  }

  /* 响应式适配 */
  @media (max-width: 768px) {
    .page-header {
      padding: 12px 16px;
    }

    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .header-right {
      width: 100%;
      justify-content: space-between;
    }

    .page-body {
      padding: 12px 16px;
    }

    .course-card {
      flex-direction: column;
      gap: 12px;
    }

    .course-media {
      width: 100%;
    }

    .media-placeholder {
      aspect-ratio: 16 / 9;
    }

    .course-name {
      font-size: 15px;
    }
  }
</style>
