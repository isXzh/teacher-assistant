<template>
  <div class="today-classes">
    <!-- 头部日期区域 -->
    <div class="header">
      <h2 class="date-title">{{ currentDate }} {{ currentWeekDay }}</h2>
      <div class="top-btn">
<el-button round :loading="loading" @click="handleRefresh"> 刷新 </el-button>
      <button class="calendar-button" @click="handleCalendarClick">
        <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6" stroke-width="2"></line>
          <line x1="8" y1="2" x2="8" y2="6" stroke-width="2"></line>
          <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"></line>
        </svg>
      </button>
      </div>
      
    </div>

    <!-- 教师端-会控SSE推送Controller

提供SSE (Server-Sent Events) 接口，实现服务端主动推送会议状态到前端

前端使用示例：
const eventSource = new EventSource('/teacher/meeting/control/1/sse');
eventSource.addEventListener('participants', (event) => {
    console.log('与会者状态更新:', JSON.parse(event.data));
});
eventSource.addEventListener('connect', (event) => {
    console.log('SSE连接已建立');
}); -->

    <!-- 课程列表 -->
    <div class="course-list">
      <!-- 有课程时显示课程卡片 -->
      <template v-if="courses.length > 0">
        <div v-for="course in courses" :key="course.id" class="course-card">
          <!-- 课程头部：名称和状态 -->
          <div class="card-header">
            <h3 class="course-name">{{ course.name }}</h3>
            <span class="status-tag" :class="getStatusClass(course.status)">
              {{ course.status }}
            </span>
          </div>

          <!-- 课程信息 -->
          <div class="course-info">
            <div class="info-row">
              <span class="info-label">上课时间：</span>
              <span class="info-value">{{ course.time }}</span>
            </div>
            <div class="info-row">
              <span class="info-value">{{ course.classroom }} · {{ course.teacher }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-footer">
            <button class="enter-button" :disabled="!canEnterCourse(course)" @click="handleEnterCourse(course)">
              {{ getButtonText(course) }}
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </template>

      <!-- 无课程时显示空状态 -->
      <div v-else class="empty-state">
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

  export default {
    name: 'TodayClasses',
    data() {
      return {
        courses: [],
      };
    },
    computed: {
      currentDate() {
        return getCurrentDate();
      },
      currentWeekDay() {
        return getCurrentWeekDay();
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
    },
    methods: {
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
      getStatusClass(status) {
        const statusMap = {
          进行中: 'status-progress',
          可提前入会: 'status-pending',
          未到上课时间: 'status-pending',
        };
        return statusMap[status] || 'status-pending';
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
        // 处理日历点击事件
        this.$message.info('日历功能开发中...');
      },
    },
  };
</script>

<style scoped>
  .today-classes {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 20px;
  }

  /* 头部样式 */
  .header {
    background: #ffffff;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .date-title {
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    margin: 0;
  }

  .calendar-button {
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #1e88e5;
    transition: all 0.2s ease;
  }

  .calendar-button:hover {
    background: #f5f7fa;
  }

  .calendar-icon {
    width: 20px;
    height: 20px;
  }

  /* 课程列表样式 */
  .course-list {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* 课程卡片样式 */
  .course-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .course-name {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    margin: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 状态标签样式 */
  .status-tag {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    margin-left: 8px;
  }

  .status-progress {
    background: #e3f2fd;
    color: #1976d2;
  }

  .status-pending {
    background: #f5f5f5;
    color: #666666;
  }

  .status-ended {
    background: #e8f5e9;
    color: #388e3c;
  }

  .status-cancelled {
    background: #ffebee;
    color: #d32f2f;
  }

  /* 课程信息样式 */
  .course-info {
    margin-bottom: 16px;
  }

  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }

  .info-row:last-child {
    margin-bottom: 0;
  }

  .info-label {
    font-size: 14px;
    color: #666666;
    white-space: nowrap;
  }

  .info-value {
    font-size: 14px;
    color: #333333;
  }

  /* 卡片底部按钮样式 */
  .card-footer {
    margin-top: 12px;
  }

  .enter-button {
    width: 100%;
    height: 42px;
    background: linear-gradient(135deg, #1e88e5 0%, #1976d2 100%);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .enter-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
  }

  .enter-button:disabled {
    background: #e0e0e0;
    color: #999999;
    cursor: not-allowed;
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
  .top-btn {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
