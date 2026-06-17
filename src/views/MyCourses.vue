<template>
  <div class="my-courses">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">我的课程</h2>
          <p class="page-subtitle">课堂一体机自动采集的原始录像与解析状态看板</p>
        </div>
        <div class="header-right">
          <div class="status-item">
            <span class="status-dot dot-red"></span>
            <span class="status-text">今日采集中 2 节</span>
          </div>
          <div class="status-item">
            <span class="status-dot dot-orange"></span>
            <span class="status-text">解析中 1 节</span>
          </div>
        </div>
      </div>
    </div>

    <div class="page-body">
      <!-- 课程卡片网格 -->
      <div v-if="filteredCourses.length > 0" class="course-grid">
        <div v-for="course in filteredCourses" :key="course.id" class="course-card">
          <!-- 视频缩略图区域 -->
          <div class="video-thumb">
            <img
              :src="course.coverUrl || defaultThumbnail"
              :alt="course.title"
              class="thumb-img"
              @error="onThumbError($event)"
            />

            <!-- 播放按钮 -->
            <div class="play-overlay">
              <div class="play-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            <!-- 状态标签 -->
            <!-- <div class="status-tag-wrap">
              <span class="status-tag status-tag-parsed">
                <span class="tag-dot"></span>
                已解析
              </span>
            </div> -->

            <!-- 时长 -->
            <div class="duration-wrap">
              <span class="duration-tag">{{ formatDuration(course.duration) }}</span>
            </div>
          </div>

          <!-- 卡片内容 -->
          <div class="card-content">
            <!-- 标签 -->
            <div class="tag-row">
              <span class="course-tag">
                <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 12v8" />
                  <path d="M9 16h6" />
                </svg>
                互动探究
              </span>
            </div>

            <!-- 课程名称 -->
            <h3 class="course-name">{{ course.title || '未命名课程' }}</h3>

            <!-- 日期、时间、地点 -->
            <div class="course-meta">
              <span class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {{ formatDate(course.createdAt) }}
              </span>
              <span class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ formatTime(course.createdAt) }}
              </span>
              <!-- <span class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                A-301
              </span> -->
            </div>

            <!-- 底部信息 -->
            <div class="card-footer">
              <div class="footer-info">
                <span class="info-num">{{ course.viewCount || 0 }}</span>
                <span class="info-label">次浏览</span>
              </div>
              <button class="detail-btn" @click="handleViewDetail(course.id)">查看详情</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <p class="empty-text">暂无课程</p>
        <p class="empty-subtext">未找到匹配的课程记录</p>
      </div>
    </div>
  </div>
</template>

<script>
  import publicResourceApi from '@/api/publicResource.js';

  const DEFAULT_THUMBNAIL =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect fill='%23E3F2FD' width='320' height='180'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='14' fill='%231E88E5'%3E课程缩略图%3C/text%3E%3C/svg%3E";

  export default {
    name: 'MyCourses',
    data() {
      return {
        courses: [],
        loading: false,
        defaultThumbnail: DEFAULT_THUMBNAIL,
      };
    },
    computed: {
      filteredCourses() {
        return this.courses.filter(course => course.publishStatus === 1);
      },
    },
    created() {
      this.fetchCourses();
    },
    methods: {
      async fetchCourses() {
        this.loading = true;
        try {
          const res = await publicResourceApi.getVideoList();
          if (res && res.code === 200) {
            this.courses = res.data || [];
          } else {
            this.courses = [];
          }
        } catch (err) {
          console.error('获取课程列表失败:', err);
          this.courses = [];
        } finally {
          this.loading = false;
        }
      },
      formatDate(dateStr) {
        if (!dateStr) return '--';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '--';
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${m}-${day}`;
      },
      formatTime(dateStr) {
        if (!dateStr) return '--:--';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '--:--';
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
      },
      formatDuration(seconds) {
        if (!seconds && seconds !== 0) return '00:00';
        const total = Number(seconds) || 0;
        const m = Math.floor(total / 60);
        const s = Math.floor(total % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      },
      onThumbError(e) {
        e.target.src = this.defaultThumbnail;
      },
      handleViewDetail(courseId) {
        this.$emit('view-detail', courseId);
      },
    },
  };
</script>

<style scoped>
  .my-courses {
    min-height: 100%;
    background: #f5f7fa;
  }

  /* 页面头部 */
  .page-header {
    background: white;
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .header-left {
    flex: 1;
  }

  .page-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 2px 0;
  }

  .page-subtitle {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 13px;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .dot-red {
    background: #ef4444;
  }

  .dot-orange {
    background: #f97316;
  }

  .status-text {
    color: #4b5563;
  }

  /* 页面主体 */
  .page-body {
    padding: 24px;
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
    border: 1px solid #f3f4f6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
  }

  .course-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #e5e7eb;
  }

  /* 视频缩略图 */
  .video-thumb {
    position: relative;
    aspect-ratio: 16 / 9;
    background: #f3f4f6;
    overflow: hidden;
  }

  .thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .play-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .play-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  }

  .course-card:hover .play-btn {
    transform: scale(1.1);
  }

  .play-btn svg {
    width: 24px;
    height: 24px;
    color: #4b5563;
    margin-left: 2px;
  }

  .status-tag-wrap {
    position: absolute;
    top: 12px;
    left: 12px;
  }

  .status-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    color: white;
  }

  .status-tag-parsed {
    background: #22c55e;
  }

  .tag-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
    display: inline-block;
  }

  .duration-wrap {
    position: absolute;
    bottom: 12px;
    right: 12px;
  }

  .duration-tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background: rgba(0, 0, 0, 0.6);
    color: white;
  }

  /* 卡片内容 */
  .card-content {
    padding: 16px;
  }

  .tag-row {
    margin-bottom: 8px;
  }

  .course-tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid #fbcfe8;
    background: #fdf2f8;
    color: #ec4899;
  }

  .tag-icon {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }

  .course-name {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 8px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .course-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #9ca3af;
  }

  .meta-icon {
    width: 14px;
    height: 14px;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
  }

  .footer-info {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .info-num {
    font-size: 22px;
    font-weight: 700;
    color: #1e88e5;
  }

  .info-label {
    font-size: 13px;
    color: #9ca3af;
  }

  .detail-btn {
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    background: #1e88e5;
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease;
    box-shadow: 0 1px 2px rgba(30, 136, 229, 0.2);
  }

  .detail-btn:hover {
    background: #1565c0;
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
    background: #f3f4f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .empty-icon svg {
    width: 40px;
    height: 40px;
    color: #d1d5db;
  }

  .empty-text {
    font-size: 16px;
    font-weight: 500;
    color: #9ca3af;
    margin: 0 0 4px 0;
  }

  .empty-subtext {
    font-size: 13px;
    color: #d1d5db;
    margin: 0;
  }

  /* 响应式 */
  @media (max-width: 768px) {
    .page-header {
      padding: 12px 16px;
    }

    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .page-body {
      padding: 16px;
    }

    .course-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
