<template>
  <div class="my-courses">
    <!-- 课程详情页 -->
    <course-detail
      v-if="showDetail"
      :course-id="selectedCourseId"
      @back="showDetail = false"
    />
    <!-- 课程列表 -->
    <template v-if="!showDetail">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">我的课程</h2>
          <p class="page-subtitle">共 {{ filteredCourses.length }} 门课程</p>
        </div>
        <div class="header-right">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="searchKeyword"
              type="text"
              class="search-input"
              placeholder="搜索课程名称或学科..."
            />
          </div>
        </div>
      </div>
    </div>

    <div class="page-body">
      <!-- 排序提示 -->
      <div class="sort-hint">
        <svg class="hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span class="hint-text">按上课日期排序（最近在上）</span>
      </div>

      <!-- 课程列表 -->
      <div v-if="filteredCourses.length > 0" class="course-list">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="course-card"
        >
          <div class="card-inner">
            <!-- 左侧内容 -->
            <div class="card-left">
              <div class="course-icon-wrap">
                <div class="course-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
              </div>
              <div class="course-info">
                <h3 class="course-name">{{ course.name }}</h3>
                <div class="course-meta">
                  <span class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {{ course.date }}
                  </span>
                  <span class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {{ course.timeRange }}
                  </span>
                  <span class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {{ course.location }}
                  </span>
                </div>
                <!-- 标签 -->
                <div v-if="course.tags && course.tags.length" class="course-tags">
                  <span
                    v-for="tag in course.tags"
                    :key="tag"
                    class="tag"
                    :class="getTagClass(tag)"
                  >
                    <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 右侧操作区 -->
            <div class="card-right">
              <span class="parse-status" :class="getParseStatusClass(course.parseStatus)">
                <svg v-if="course.parseStatus === 'parsing'" class="status-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                <svg v-else-if="course.parseStatus === 'parsed'" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <svg v-else class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                {{ getParseStatusText(course) }}
              </span>
              <button class="detail-btn" @click="handleViewDetail(course.id)">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        </div>
        <p class="empty-text">暂无课程</p>
        <p class="empty-subtext">未找到匹配的课程记录</p>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import CourseDetail from './CourseDetail.vue'

export default {
  name: 'MyCourses',
  components: {
    CourseDetail,
  },
  data() {
    return {
      showDetail: false,
      selectedCourseId: '',
      searchKeyword: '',
      courses: [
        {
          id: '1',
          name: '数学基础课 - 轴对称图形',
          date: '2026-04-15',
          timeRange: '08:00 - 08:45',
          location: '坪山中学 教学楼A-301',
          tags: ['精品课'],
          subject: '数学',
          parseStatus: 'parsed',
          knowledgePointCount: 5,
        },
        {
          id: '2',
          name: '英语口语训练',
          date: '2026-04-14',
          timeRange: '14:00 - 14:45',
          location: '东湖公园',
          tags: ['户外教学'],
          subject: '英语',
          parseStatus: 'parsing',
        },
        {
          id: '3',
          name: '语文阅读课 - 古诗词赏析',
          date: '2026-04-12',
          timeRange: '09:00 - 09:45',
          location: '实验小学',
          tags: ['精品课'],
          subject: '语文',
          parseStatus: 'parsed',
          knowledgePointCount: 4,
        },
        {
          id: '4',
          name: '物理实验课 - 力学基础',
          date: '2026-04-10',
          timeRange: '10:00 - 10:45',
          location: '坪山中学',
          tags: ['实验课'],
          subject: '物理',
          parseStatus: 'none',
        },
        {
          id: '5',
          name: '化学入门 - 元素周期表',
          date: '2026-04-08',
          timeRange: '08:00 - 08:45',
          location: '实验中学',
          tags: ['精品课', '实验课'],
          subject: '化学',
          parseStatus: 'parsing',
        },
        {
          id: '6',
          name: '美术创作课 - 户外写生',
          date: '2026-04-05',
          timeRange: '14:00 - 15:30',
          location: '东湖公园',
          tags: ['户外教学'],
          subject: '美术',
          parseStatus: 'parsed',
          knowledgePointCount: 3,
        },
        {
          id: '7',
          name: '历史讲堂 - 近代史',
          date: '2026-04-03',
          timeRange: '09:00 - 09:45',
          location: '坪山中学',
          tags: ['精品课'],
          subject: '历史',
          parseStatus: 'none',
        },
        {
          id: '8',
          name: '地理探索 - 地质考察',
          date: '2026-04-01',
          timeRange: '08:00 - 10:00',
          location: '地质公园',
          tags: ['户外教学'],
          subject: '地理',
          parseStatus: 'parsing',
        },
      ],
    }
  },
  computed: {
    filteredCourses() {
      return this.courses
        .filter(course => course.parseStatus !== 'none')
        .filter(course =>
          course.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          course.subject.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
    },
  },
  methods: {
    getTagClass(tag) {
      const map = {
        '精品课': 'tag-blue',
        '户外教学': 'tag-green',
        '实验课': 'tag-orange',
      }
      return map[tag] || 'tag-gray'
    },
    getParseStatusClass(status) {
      const map = {
        parsing: 'status-parsing',
        parsed: 'status-parsed',
        none: 'status-none',
      }
      return map[status] || 'status-none'
    },
    getParseStatusText(course) {
      if (course.parseStatus === 'parsing') return '解析中'
      if (course.parseStatus === 'parsed') return `已解析 · ${course.knowledgePointCount || 0}个知识点`
      return '未解析'
    },
    handleViewDetail(courseId) {
      this.selectedCourseId = courseId
      this.showDetail = true
    },
  },
}
</script>

<style scoped>
.my-courses {
  min-height: 100%;
  background: #F5F7FA;
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

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #999;
}

.search-input {
  width: 260px;
  height: 40px;
  padding: 0 12px 0 36px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background: #f8f8f8;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #1E88E5;
  box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
  background: white;
}

/* 页面主体 */
.page-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
}

.sort-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  padding: 0 4px;
}

.hint-icon {
  width: 16px;
  height: 16px;
  color: #999;
}

.hint-text {
  font-size: 13px;
  color: #888;
}

/* 课程列表 */
.course-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-card {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #e0e0e0;
}

.card-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.card-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.course-icon-wrap {
  flex-shrink: 0;
}

.course-icon {
  width: 40px;
  height: 40px;
  background: #E3F2FD;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1E88E5;
}

.course-icon svg {
  width: 20px;
  height: 20px;
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-name {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-card:hover .course-name {
  color: #1E88E5;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 16px;
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

.course-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  margin-left: 54px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
}

.tag-icon {
  width: 12px;
  height: 12px;
}

.tag-blue {
  background: #E3F2FD;
  color: #1E88E5;
  border-color: #BBDEFB;
}

.tag-green {
  background: #E8F5E9;
  color: #43A047;
  border-color: #C8E6C9;
}

.tag-orange {
  background: #FFF3E0;
  color: #FB8C00;
  border-color: #FFE0B2;
}

.tag-gray {
  background: #f5f5f5;
  color: #666;
  border-color: #e0e0e0;
}

/* 右侧操作区 */
.card-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.parse-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
  white-space: nowrap;
}

.status-icon {
  width: 14px;
  height: 14px;
}

.status-icon.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.status-parsing {
  background: #FFF8E1;
  color: #F9A825;
  border-color: #FFECB3;
}

.status-parsed {
  background: #E8F5E9;
  color: #43A047;
  border-color: #C8E6C9;
}

.status-none {
  background: #f5f5f5;
  color: #999;
  border-color: #e0e0e0;
}

.detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  background: #1E88E5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.detail-btn:hover {
  background: #1976D2;
}

.detail-btn .btn-icon {
  width: 15px;
  height: 15px;
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
  width: 72px;
  height: 72px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
  color: #ccc;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #aaa;
  margin: 0 0 4px 0;
}

.empty-subtext {
  font-size: 13px;
  color: #ccc;
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

  .search-input {
    width: 100%;
  }

  .page-body {
    padding: 12px 16px;
  }

  .card-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-right {
    width: 100%;
    justify-content: flex-end;
  }

  .course-tags {
    margin-left: 0;
  }
}
</style>
