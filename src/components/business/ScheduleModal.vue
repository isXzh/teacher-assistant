<template>
  <div v-if="visible" class="schedule-modal-overlay">
    <div class="schedule-modal-mask" @click="handleClose"></div>
    <div class="schedule-modal">
      <div class="modal-header">
        <div class="header-left">
          <h3 class="modal-title">排课查看</h3>
          <div class="view-toggle">
            <button class="toggle-btn" :class="{ active: viewMode === 'week' }" @click="setViewMode('week')">
              <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              本周
            </button>
            <button class="toggle-btn" :class="{ active: viewMode === 'month' }" @click="setViewMode('month')">
              <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              本月
            </button>
          </div>
        </div>
        <button class="close-btn" @click="handleClose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="date-nav">
        <div class="date-nav-left">
          <button class="nav-btn" @click="handlePrev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <span class="date-range">{{ dateRangeText }}</span>
          <button class="nav-btn" @click="handleNext">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <button class="today-btn" @click="handleToday">回到今天</button>
      </div>

      <div class="modal-body">
        <div v-if="loading" class="loading-state">
          <p class="loading-text">加载中...</p>
        </div>
        <div v-else-if="!hasCourses" class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <p class="empty-text">暂无排课安排</p>
        </div>
        <div v-else class="date-groups">
          <div v-for="group in groupedCourses" :key="group.dateKey" class="date-group">
            <div class="date-header">
              <div class="date-day-badge">
                <span class="date-day-text">{{ group.day }}</span>
              </div>
              <span class="date-label">{{ group.dateLabel }}</span>
              <div class="date-divider"></div>
            </div>

            <div class="course-list">
              <div
                v-for="course in group.courses"
                :key="course.scheduleId"
                class="course-item"
                :class="getCourseItemClass(course.statusText)"
              >
                <div class="course-item-content">
                  <div class="course-info-left">
                    <span class="role-tag" :class="course.teachType === 1 ? 'role-main' : 'role-assistant'">
                      {{ course.teachTypeName }}
                    </span>
                    <span class="status-tag" :class="getStatusTagClass(course.statusText)">
                      {{ course.statusText }}
                    </span>
                    <h4 class="course-name">{{ course.courseName }}</h4>
                  </div>
                  <div class="course-info-right">
                    <span class="info-item">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {{ course.periodTimeRange }}
                    </span>
                    <span class="info-item">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {{ course.classroomName }}
                    </span>
                    <span class="info-item">
                      <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                      {{ course.mainTeacherName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <span class="footer-stat">
          <svg
            class="footer-icon footer-icon-main"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          主讲: {{ mainCount }}节
        </span>
        <span class="footer-stat">
          <svg
            class="footer-icon footer-icon-assistant"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
          辅讲: {{ assistantCount }}节
        </span>
        <span class="footer-stat">
          <svg
            class="footer-icon footer-icon-total"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          总计: {{ totalCount }}节
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import homeApi from '@/api/home';

  export default {
    name: 'ScheduleModal',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        viewMode: 'week',
        currentDate: new Date(),
        scheduleData: [],
        loading: false,
      };
    },
    computed: {
      dateRange() {
        const date = new Date(this.currentDate);
        if (this.viewMode === 'week') {
          const start = new Date(date);
          const day = start.getDay();
          const diff = start.getDate() - day + (day === 0 ? -6 : 1);
          start.setDate(diff);
          start.setHours(0, 0, 0, 0);
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          return { start, end };
        }
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        return { start, end };
      },
      dateRangeText() {
        if (this.viewMode === 'week') {
          return `${this.formatMonthDay(this.dateRange.start)} - ${this.formatMonthDay(this.dateRange.end)}`;
        }
        return `${this.currentDate.getFullYear()}年${this.currentDate.getMonth() + 1}月`;
      },
      mappedCourses() {
        return (this.scheduleData || []).map(item => ({
          scheduleId: item.scheduleId,
          courseName: item.courseName,
          teachType: item.teachType,
          teachTypeName: item.teachTypeName || (item.teachType === 1 ? '主讲' : '辅讲'),
          status: item.status,
          statusText: this.getStatusText(item),
          lessonDate: item.lessonDate,
          periodTimeRange: item.periodTimeRange,
          periodName: item.periodName,
          location: item.location,
          classroomName: item.location,
          mainTeacherId: item.mainTeacherId,
          mainTeacherName: item.mainTeacherName,
        }));
      },
      groupedCourses() {
        const groups = {};
        this.mappedCourses.forEach(course => {
          if (!course.lessonDate) return;
          const key = course.lessonDate;
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(course);
        });
        const sortedKeys = Object.keys(groups).sort();
        return sortedKeys.map(key => {
          const dateObj = new Date(key);
          return {
            dateKey: key,
            day: String(dateObj.getDate()).padStart(2, '0'),
            dateLabel: `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`,
            courses: groups[key],
          };
        });
      },
      hasCourses() {
        return this.groupedCourses.length > 0;
      },
      mainCount() {
        return this.mappedCourses.filter(c => c.teachType === 1).length;
      },
      assistantCount() {
        return this.mappedCourses.filter(c => c.teachType === 2).length;
      },
      totalCount() {
        return this.mappedCourses.length;
      },
    },
    watch: {
      visible(val) {
        if (val) {
          this.currentDate = new Date();
          this.viewMode = 'week';
          this.fetchSchedules();
        }
      },
    },
    methods: {
      formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      },
      formatMonthDay(date) {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      },
      getStatusText(item) {
        if (item.statusName) return item.statusName;
        const map = { 0: '已取消', 1: '未开始', 2: '进行中', 3: '已结束' };
        return map[item.status] || '未开始';
      },
      getStatusTagClass(statusText) {
        if (statusText === '进行中') return 'status-ongoing';
        if (statusText === '已结束' || statusText === '已完成') return 'status-ended';
        if (statusText === '已取消') return 'status-cancelled';
        return 'status-pending';
      },
      getCourseItemClass(statusText) {
        if (statusText === '进行中') return 'item-ongoing';
        if (statusText === '已结束' || statusText === '已完成') return 'item-ended';
        return '';
      },
      setViewMode(mode) {
        this.viewMode = mode;
        this.fetchSchedules();
      },
      handlePrev() {
        const newDate = new Date(this.currentDate);
        if (this.viewMode === 'week') {
          newDate.setDate(newDate.getDate() - 7);
        } else {
          newDate.setMonth(newDate.getMonth() - 1);
        }
        this.currentDate = newDate;
        this.fetchSchedules();
      },
      handleNext() {
        const newDate = new Date(this.currentDate);
        if (this.viewMode === 'week') {
          newDate.setDate(newDate.getDate() + 7);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        this.currentDate = newDate;
        this.fetchSchedules();
      },
      handleToday() {
        this.currentDate = new Date();
        this.fetchSchedules();
      },
      handleClose() {
        this.$emit('update:visible', false);
        this.$emit('close');
      },
      async fetchSchedules() {
        this.loading = true;
        try {
          const params = {
            startDate: this.formatDate(this.dateRange.start),
            endDate: this.formatDate(this.dateRange.end),
          };
          const response = await homeApi.getSchedules(params);
          this.scheduleData = (response && response.data) || [];
        } catch (error) {
          console.error('获取排课数据失败:', error);
          this.scheduleData = [];
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style scoped>
  .schedule-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .schedule-modal-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .schedule-modal {
    position: relative;
    background: #fff;
    border-radius: 16px;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-width: 896px;
    margin: 0 16px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .view-toggle {
    display: flex;
    align-items: center;
    background: #f3f4f6;
    border-radius: 8px;
    padding: 4px;
  }

  .toggle-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    background: transparent;
    color: #6b7280;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .toggle-btn:hover {
    color: #374151;
  }

  .toggle-btn.active {
    background: #fff;
    color: #1e88e5;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .toggle-icon {
    width: 16px;
    height: 16px;
  }

  .close-btn {
    padding: 8px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #9ca3af;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    color: #4b5563;
    background: #f3f4f6;
  }

  .close-btn svg {
    width: 20px;
    height: 20px;
  }

  .date-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    border-bottom: 1px solid #f3f4f6;
  }

  .date-nav-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-btn {
    padding: 8px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-btn:hover {
    color: #374151;
    background: #f3f4f6;
  }

  .nav-btn svg {
    width: 20px;
    height: 20px;
  }

  .date-range {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    min-width: 200px;
    text-align: center;
  }

  .today-btn {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #1e88e5;
    background: #e3f2fd;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .today-btn:hover {
    background: #bbdefb;
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
  }

  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
    color: #d1d5db;
    margin-bottom: 16px;
  }

  .empty-text,
  .loading-text {
    font-size: 15px;
    color: #9ca3af;
    margin: 0;
  }

  .date-groups {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .date-group {
    display: flex;
    flex-direction: column;
  }

  .date-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .date-day-badge {
    width: 32px;
    height: 32px;
    background: #e3f2fd;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .date-day-text {
    font-size: 14px;
    font-weight: 700;
    color: #1e88e5;
  }

  .date-label {
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
  }

  .date-divider {
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  .course-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-left: 40px;
  }

  .course-item {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #fff;
    transition: all 0.2s ease;
  }

  .course-item:hover {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .course-item.item-ongoing {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .course-item.item-ended {
    background: #f9fafb;
    border-color: #e5e7eb;
    opacity: 0.6;
  }

  .course-item-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .course-info-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    flex-wrap: wrap;
  }

  .role-tag {
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 9999px;
  }

  .role-tag.role-main {
    background: #1e88e5;
    color: #fff;
  }

  .role-tag.role-assistant {
    background: #ffedd5;
    color: #ea580c;
  }

  .status-tag {
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 9999px;
  }

  .status-tag.status-ongoing {
    background: #dcfce7;
    color: #16a34a;
  }

  .status-tag.status-pending {
    background: #dbeafe;
    color: #2563eb;
  }

  .status-tag.status-ended {
    background: #f3f4f6;
    color: #6b7280;
  }

  .status-tag.status-cancelled {
    background: #fee2e2;
    color: #dc2626;
  }

  .course-name {
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
    margin: 0;
  }

  .course-info-right {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #6b7280;
    flex-wrap: wrap;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .info-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 12px 24px;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
    border-radius: 0 0 16px 16px;
    font-size: 14px;
    color: #4b5563;
  }

  .footer-stat {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .footer-icon {
    width: 16px;
    height: 16px;
  }

  .footer-icon-main {
    color: #1e88e5;
  }

  .footer-icon-assistant {
    color: #f97316;
  }

  .footer-icon-total {
    color: #22c55e;
  }

  @media (min-width: 640px) {
    .course-item-content {
      flex-direction: row;
      align-items: center;
    }
  }

  @media (max-width: 768px) {
    .modal-header {
      padding: 12px 16px;
    }
    .date-nav {
      padding: 12px 16px;
    }
    .modal-body {
      padding: 12px 16px;
    }
    .modal-footer {
      padding: 12px 16px;
      gap: 12px;
      flex-wrap: wrap;
    }
    .header-left {
      gap: 8px;
    }
    .date-range {
      min-width: auto;
      font-size: 14px;
    }
    .course-list {
      margin-left: 0;
    }
  }
</style>
