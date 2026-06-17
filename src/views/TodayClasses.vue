<template>
  <div class="today-classes">
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">今日课堂</h2>
          <p class="page-subtitle">管理您的授课与辅讲任务，高效开展课堂教学</p>
        </div>
        <div class="header-right">
          <div class="date-display">
            <p class="date-text">{{ currentDate }}</p>
            <p class="week-text">{{ currentWeekDay }}</p>
          </div>
          <button class="schedule-btn" @click="scheduleModalVisible = true">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span class="btn-text">查看排课</span>
          </button>
          <button class="schedule-btn" @click="handleRefresh">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M23 4v6h-6M1 20v-6h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="btn-text">{{ loading ? '刷新中' : '刷新' }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="page-body">
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

      <div v-else class="course-grid">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="course-card"
          :class="{ ended: course.status === '已结束' }"
        >
          <div class="card-thumbnail" @click="handleThumbnailClick(course)">
            <div class="thumbnail-bg"></div>
            <svg class="thumbnail-text" viewBox="0 0 320 180">
              <rect fill="#E3F2FD" width="320" height="180" />
              <text
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
                font-family="system-ui"
                font-size="14"
                fill="#1E88E5"
              >
                课程缩略图
              </text>
            </svg>

            <div class="status-badge" :class="getStatusBadgeClass(course.status)">
              <span class="status-dot" :class="getStatusDotClass(course.status)"></span>
              <span class="status-text">{{ course.status }}</span>
            </div>

            <div class="role-badge" :class="course.teachType === 2 ? 'role-assistant' : 'role-main'">
              {{ course.teachTypeName }}
            </div>

            <div v-if="course.status !== '已结束'" class="play-btn-wrapper">
              <div class="play-btn" @click.stop="handleEnterCourse(course)">
                <svg class="play-icon-small" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          </div>

          <div class="card-content">
            <h3 class="course-name" :title="course.name">{{ course.name }}</h3>

            <div class="course-period-time">
              <span class="period-badge">{{ course.period }}</span>
              <span class="time-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ course.time }}
              </span>
            </div>

            <div v-if="course.location" class="course-location">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span class="location-text">{{ course.location }}</span>
            </div>

            <div v-if="course.tagNames && course.tagNames.length" class="course-tag-names">
              <span v-for="(tag, idx) in course.tagNames" :key="idx" class="tag-name-item">
                {{ tag }}
              </span>
            </div>

            <div v-if="course.activityTypeName" class="course-tags">
              <span class="tag-item" :class="getTagStyle(course.activityType)">
                <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                {{ course.activityTypeName }}
              </span>
            </div>

            <div class="card-footer">
              <div class="footer-left">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span class="teacher-name">{{ course.teacher }}</span>
              </div>

              <div class="footer-right">
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

                <span v-else-if="course.status === '已结束'" class="action-btn btn-ended"> 已结束 </span>

                <button
                  v-else-if="course.controlStatus === 2"
                  class="action-btn btn-early"
                  @click="handleEnterCourse(course)"
                >
                  提前进入
                </button>

                <span v-else class="action-btn btn-disabled"> 未到时间 </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ScheduleModal :visible.sync="scheduleModalVisible" />
  </div>
</template>

<script>
  import { getCurrentDate, getCurrentWeekDay } from '@/utils/format';
  import homeApi from '@/api/home';
  import ScheduleModal from '@/components/business/ScheduleModal.vue';

  export default {
    name: 'TodayClasses',
    components: {
      ScheduleModal,
    },
    data() {
      return {
        courses: [],
        isListenerRegistered: false,
        activeFilter: 'all',
        scheduleModalVisible: false,
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
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
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
            callback: () => {},
          });
          this.fetchCourses();
        } catch (error) {
          console.error('解析课程提醒数据失败:', error);
        }
      },
      handleRefresh() {
        this.$emit('refresh');
        // this.fetchCourses();
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
      getTagStyle(activityType) {
        const map = {
          1: 'tag-daily',
          2: 'tag-outdoor',
        };
        return map[activityType] || 'tag-daily';
      },
      canEnterCourse(course) {
        return course.controlStatus === 1 || course.controlStatus === 2;
      },
      handleThumbnailClick(course) {
        if (course.status === '已结束') return;
        if (!this.canEnterCourse(course)) return;
        this.handleEnterCourse(course);
      },
      async handleEnterCourse(course) {
        if (!this.canEnterCourse(course)) return;
        try {
          const response = await homeApi.enterClassroom(course.id);
          if (response.data) {
            console.log('进入课堂成功，scheduleId:', course.id, 'teachType:', course.teachType);
            await this.$store.dispatch('sse/initSSE', course.id);
            if (course.teachType === 2) {
              console.log('===============', course);

              this.$router.push({
                path: `/assistant/${course.id}`,
                query: {
                  courseName: course.name,
                  teacher: course.teacher,
                  time: course.time,
                  classroom: course.classroom,
                  location: course.location,
                  subjectName: course.subjectName,
                  courseDesc: course.courseDesc,
                  period: course.period,
                  teachType: course.teachType,
                  schoolName: course.schoolName,
                },
              });
            } else {
              this.$router.push(`/interaction/${course.id}`);
            }
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
    background: #f5f7fa;
    padding-bottom: 80px;
  }

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
    color: #1e88e5;
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
    background: #e3f2fd;
    color: #1e88e5;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .schedule-btn:hover {
    background: #bbdefb;
  }

  .schedule-btn .btn-icon {
    width: 16px;
    height: 16px;
  }

  .page-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 24px;
  }

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
    background: #1e88e5;
    color: white;
    border-color: #1e88e5;
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

  .course-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .course-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    transition: all 0.2s ease;
  }

  .course-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #e0e0e0;
  }

  .course-card.ended {
    opacity: 0.75;
  }

  .card-thumbnail {
    position: relative;
    aspect-ratio: 16 / 9;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    overflow: hidden;
    cursor: pointer;
  }

  .card-thumbnail:hover .thumbnail-text {
    transform: scale(1.05);
  }

  .thumbnail-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.15) 0%, transparent 60%);
  }

  .thumbnail-text {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .status-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    z-index: 1;
    border: 1px solid transparent;
  }

  .status-badge.status-ongoing {
    background: #e8f5e9;
    color: #2e7d32;
    border-color: #c8e6c9;
  }

  .status-badge.status-pending {
    background: #e3f2fd;
    color: #1565c0;
    border-color: #bbdefb;
  }

  .status-badge.status-ended {
    background: #f5f5f5;
    color: #757575;
    border-color: #e0e0e0;
  }

  .status-badge.status-cancelled {
    background: #ffebee;
    color: #c62828;
    border-color: #ffcdd2;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .status-dot.dot-ongoing {
    background: #4caf50;
  }
  .status-dot.dot-pending {
    background: #2196f3;
  }
  .status-dot.dot-ended {
    background: #9e9e9e;
  }
  .status-dot.dot-cancelled {
    background: #f44336;
  }

  .role-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 4px;
    z-index: 1;
  }

  .role-badge.role-main {
    background: #1e88e5;
    color: white;
  }

  .role-badge.role-assistant {
    background: #fb8c00;
    color: white;
  }

  .play-btn-wrapper {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .play-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .course-card:hover .play-btn {
    transform: scale(1.1);
  }

  .play-icon-small {
    width: 20px;
    height: 20px;
    color: #37474f;
    margin-left: 2px;
  }

  .card-content {
    padding: 12px 16px 16px;
  }

  .course-name {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 8px 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.2s ease;
  }

  .course-card:hover .course-name {
    color: #1e88e5;
  }

  .course-period-time {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;
    margin-bottom: 6px;
  }

  .period-badge {
    padding: 2px 8px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 12px;
    color: #666;
  }

  .time-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .meta-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .course-location {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #999;
    margin-bottom: 8px;
  }

  .location-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .course-tags {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  .course-tag-names {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  .tag-name-item {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background: #f3e5f5;
    color: #7b1fa2;
    border: 1px solid #e1bee7;
  }

  .tag-item {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid transparent;
  }

  .tag-icon {
    width: 12px;
    height: 12px;
  }

  .tag-item.tag-daily {
    background: #e3f2fd;
    color: #1e88e5;
    border-color: #bbdefb;
  }

  .tag-item.tag-outdoor {
    background: #e8f5e9;
    color: #43a047;
    border-color: #c8e6c9;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #999;
  }

  .teacher-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 120px;
  }

  .footer-right {
    flex-shrink: 0;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .action-btn .btn-icon {
    width: 14px;
    height: 14px;
  }

  .action-btn.btn-primary {
    background: #1e88e5;
    color: white;
  }

  .action-btn.btn-primary:hover {
    background: #1976d2;
  }

  .action-btn.btn-early {
    background: white;
    color: #1e88e5;
    border: 2px solid #1e88e5;
    padding: 4px 12px;
  }

  .action-btn.btn-early:hover {
    background: #e3f2fd;
  }

  .action-btn.btn-ended {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }

  .action-btn.btn-disabled {
    background: #f5f5f5;
    color: #bbb;
    cursor: not-allowed;
  }

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

    .course-grid {
      grid-template-columns: 1fr;
    }

    .course-name {
      font-size: 14px;
    }

    .play-btn {
      width: 40px;
      height: 40px;
    }

    .play-icon-small {
      width: 16px;
      height: 16px;
    }
  }
</style>
