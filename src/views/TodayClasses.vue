<template>
  <div class="today-classes">
    <!-- 头部日期区域 -->
    <div class="header">
      <div class="date-display">
        <span class="date-text">{{ currentDate }} {{ currentWeekDay }}</span>
        <button class="refresh-btn" :class="{ 'loading': loading }" :disabled="loading" @click="handleRefresh">
          <svg v-if="loading" class="loading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="loading-path"/>
          </svg>
          <svg v-else class="refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M23 4v6h-6M1 20v-6h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ loading ? '刷新中' : '刷新' }}
        </button>
      </div>
      
    </div>

    <!-- 课程列表 -->
    <div class="course-list">
      <!-- 进行中的课程 -->
      <div v-for="(group, status) in groupedCourses" :key="status" class="course-group">
        <div class="status-header">
          <span class="status-dot" :class="getStatusDotClass(status)"></span>
          <span class="status-label">{{ status }}</span>
        </div>
        
        <div class="course-cards">
          <div v-for="course in group" :key="course.id" class="course-card">
            <!-- 课程图标 -->
            <div class="course-icon" :class="getIconClass(course.status)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            
            <!-- 课程信息 -->
            <div class="course-info">
              <h3 class="course-name">{{ course.name }}</h3>
              <div class="course-meta">
                <span class="meta-item">上课时间：{{ course.time }}</span>
                <span class="meta-divider">·</span>
                <span class="meta-item">{{ course.classroom }} · {{ course.teacher }}</span>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="course-action">
              <button 
                class="action-btn" 
                :class="getButtonClass(course)"
                :disabled="!canEnterCourse(course)"
                @click="handleEnterCourse(course)"
              >
                {{ getButtonText(course) }}
                <svg v-if="canEnterCourse(course)" class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 无课程时显示空状态 -->
      <div v-if="courses.length === 0" class="empty-state">
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
    </div>
  </div>
</template>

<script>
  import { getCurrentDate, getCurrentWeekDay } from '@/utils/format';
  import homeApi from '@/api/home';
  import { EventSourcePolyfill } from 'event-source-polyfill';

  export default {
    name: 'TodayClasses',
    data() {
      return {
        courses: [],
        sseClient: null,
        heartbeatTimer: null,
      };
    },
    computed: {
      currentDate() {
        return getCurrentDate();
      },
      currentWeekDay() {
        return getCurrentWeekDay();
      },
      groupedCourses() {
        const groups = {};
        this.courses.forEach(course => {
          const status = course.status;
          if (!groups[status]) {
            groups[status] = [];
          }
          groups[status].push(course);
        });
        return groups;
      }
    },
    props:{
      loading: {
        type: Boolean,
        default: false,
      }
    },
    
    async created() {
      await this.fetchCourses();
      this.initSSE();
    },
    beforeDestroy() {
      this.closeSSE();
    },
    methods: {
      initSSE() {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          console.error('未找到访问令牌，无法建立SSE连接');
          return;
        }

        if (this.sseClient) {
          this.closeSSE();
        }

        this.sseClient = new EventSourcePolyfill(
          `${window.businessURL}/api/teacher/reminder/sse`,
          {
            headers: {
              token: `Bearer ${token}`
            },
            withCredentials: false,
            heartbeatTimeout: 60000,
            connectionTimeout: 30000
          }
        );

        this.sseClient.onopen = () => {
          console.log('课程提醒SSE连接已建立');
          this.startHeartbeat();
        };

        this.sseClient.onerror = (error) => {
          console.error('课程提醒SSE连接错误:', error);
          this.stopHeartbeat();
          this.handleSSEError();
        };

        this.sseClient.addEventListener('classReminder', this.handleClassReminder);
      },
      startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
          if (this.sseClient && this.sseClient.readyState === 1) {
            console.log('SSE心跳检测: 连接正常');
          } else {
            console.warn('SSE心跳检测: 连接异常');
            this.stopHeartbeat();
            this.handleSSEError();
          }
        }, 30000);
      },
      stopHeartbeat() {
        if (this.heartbeatTimer) {
          clearInterval(this.heartbeatTimer);
          this.heartbeatTimer = null;
        }
      },
      handleSSEError() {
        if (this.sseClient) {
          this.sseClient.close();
          this.sseClient = null;
        }
        console.log('5秒后尝试重连SSE...');
        setTimeout(() => {
          this.initSSE();
        }, 5000);
      },
      handleClassReminder(event) {
        try {
          const data = JSON.parse(event.data);
          console.log('收到课程提醒:', data);
           this.$alert(data.message, data.courseName, {
          confirmButtonText: '确定',
          callback: action => {
          }
        });
          // this.$message.warning(data.message || '即将开始的课程提醒');
          this.fetchCourses();
        } catch (error) {
          console.error('解析课程提醒数据失败:', error);
        }
      },
      closeSSE() {
        this.stopHeartbeat();
        if (this.sseClient) {
          this.sseClient.removeEventListener('classReminder', this.handleClassReminder);
          this.sseClient.close();
          this.sseClient = null;
          console.log('课程提醒SSE连接已关闭');
        }
      },
      handleRefresh() {
        this.$emit('refresh');
      },
      async fetchCourses() {
        try {
          this.courses = await this.$store.dispatch('course/fetchTodayCourses');
        } catch (error) {
          console.error('获取课程失败:', error);
          this.courses = [];
        }
      },
      getStatusDotClass(status) {
        if (status === '进行中') return 'progress';
        if (status === '未开始') return 'pending';
        return 'pending';
      },
      getIconClass(status) {
        if (status === '进行中') return 'progress';
        if (status === '未开始') return 'pending';
        return 'pending';
      },
      getButtonClass(course) {
        if (course.status === '进行中') return 'btn-primary';
        if (course.status === '未开始') return 'btn-secondary';
        return 'btn-disabled';
      },
      canEnterCourse(course) {
        return course.status === '进行中' || course.status === '可提前入会';
      },
      getButtonText(course) {
        if (course.status === '进行中') {
          return '进入课堂';
        } else if (course.status === '可提前入会') {
          return '提前进入';
        } else if (course.status === '未到上课时间') {
          return '未到上课时间';
        }
        return '进入课堂';
      },
      async handleEnterCourse(course) {
        if (!this.canEnterCourse(course)) return;
        try {
          const response = await homeApi.enterClassroom(course.id);
          if (response.data) {
            this.$router.push(`/interaction/${course.id}`);
          } else {
            this.$message.error('进入课堂失败');
          }
        } catch (error) {
          console.error('进入课堂失败:', error);
          this.$message.error('进入课堂失败，请稍后重试');
        }
      },
      handleCalendarClick() {
        this.$message.info('日历功能开发中...');
      },
    },
  };
</script>

<style scoped>
  .today-classes {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 80px;
  }

  /* 头部样式 */
  .header {
    background: #f5f7fa;
    padding: 12px 16px;
  }

  .date-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .date-text {
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }

  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid #2979FF;
    background: white;
    color: #2979FF;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .refresh-btn:hover:not(:disabled) {
    background: #2979FF;
    color: white;
  }

  .refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .refresh-btn.loading {
    opacity: 0.8;
  }

  .refresh-icon, .loading-icon {
    width: 16px;
    height: 16px;
  }

  .loading-icon {
    animation: rotate 1s linear infinite;
  }

  .loading-path {
    stroke: #2979FF;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  /* 课程列表样式 */
  .course-list {
    padding: 0 16px;
  }

  .course-group {
    margin-bottom: 16px;
  }

  .status-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .status-dot.progress {
    background: #4CAF50;
  }

  .status-dot.pending {
    background: #FF9800;
  }

  .status-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .course-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .course-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .course-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .course-icon.progress {
    background: #E8F5E9;
    color: #4CAF50;
  }

  .course-icon.pending {
    background: #FFF3E0;
    color: #FF9800;
  }

  .course-icon svg {
    width: 24px;
    height: 24px;
  }

  .course-info {
    flex: 1;
    min-width: 0;
  }

  .course-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .course-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #666;
  }

  .meta-divider {
    color: #999;
  }

  .course-action {
    flex-shrink: 0;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .action-btn.btn-primary {
    background: #4CAF50;
    color: white;
  }

  .action-btn.btn-primary:hover:not(:disabled) {
    background: #45a049;
  }

  .action-btn.btn-secondary {
    background: white;
    color: #FF9800;
    border: 1px solid #FF9800;
  }

  .action-btn.btn-secondary:hover:not(:disabled) {
    background: #FFF3E0;
  }

  .action-btn.btn-disabled {
    background: #E0E0E0;
    color: #999;
  }

  .arrow-icon {
    width: 16px;
    height: 16px;
  }

  /* 空状态样式 */
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
    background: #f5f7fa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .empty-icon svg {
    width: 40px;
    height: 40px;
    color: #cccccc;
  }

  .empty-text {
    font-size: 16px;
    color: #999999;
    margin: 0;
  }
</style>
