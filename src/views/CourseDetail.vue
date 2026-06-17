<template>
  <div class="course-detail">
    <div class="detail-container">
      <!-- 返回按钮 -->
      <div class="back-bar">
        <button class="back-btn" @click="$emit('back')">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          返回课程列表
        </button>
      </div>

      <!-- 主内容区 - 左右分栏 -->
      <div class="detail-layout">
        <!-- 左侧区域 -->
        <div class="detail-left">
          <!-- 视频播放器 -->
          <div v-if="hasVideo && !videoError" class="video-player">
            <div class="video-wrap">
              <video
                ref="videoRef"
                class="video-element"
                :src="course.videoUrl"
                @click="togglePlay"
                @error="videoError = true"
                @timeupdate="onTimeUpdate"
                @loadedmetadata="onLoadedMetadata"
                @ended="isPlaying = false"
              />
              <!-- 播放按钮覆盖层 -->
              <div v-if="!isPlaying" class="play-overlay" @click="togglePlay">
                <div class="play-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
              <!-- 视频控制栏 -->
              <div class="video-controls">
                <div class="progress-bar">
                  <input
                    type="range"
                    min="0"
                    :max="duration"
                    :value="currentTime"
                    class="progress-input"
                    @input="onSeek"
                  />
                </div>
                <div class="controls-row">
                  <div class="controls-left">
                    <button class="ctrl-btn" @click="togglePlay">
                      <svg
                        v-if="isPlaying"
                        class="ctrl-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                      <svg v-else class="ctrl-icon" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </button>
                    <button class="ctrl-btn" @click="jumpToTime(Math.max(0, currentTime - 10))">
                      <svg class="ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="19 20 9 12 19 4 19 20"></polygon>
                        <line x1="5" y1="19" x2="5" y2="5"></line>
                      </svg>
                    </button>
                    <button class="ctrl-btn" @click="jumpToTime(Math.min(duration, currentTime + 10))">
                      <svg class="ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                      </svg>
                    </button>
                    <span class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
                  </div>
                  <div class="controls-right">
                    <!-- 音量 -->
                    <div class="volume-wrap">
                      <button class="ctrl-btn" @click="toggleMute">
                        <svg
                          v-if="isMuted"
                          class="ctrl-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <line x1="23" y1="9" x2="17" y2="15"></line>
                          <line x1="17" y1="9" x2="23" y2="15"></line>
                        </svg>
                        <svg
                          v-else
                          class="ctrl-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        :value="isMuted ? 0 : volume"
                        class="volume-slider"
                        @input="onVolumeChange"
                      />
                    </div>
                    <!-- 倍速 -->
                    <div class="rate-wrap">
                      <button class="rate-btn" @click="showRateMenu = !showRateMenu">{{ playbackRate }}x</button>
                      <div v-if="showRateMenu" class="rate-menu">
                        <button
                          v-for="rate in playbackRates"
                          :key="rate"
                          class="rate-item"
                          :class="{ active: playbackRate === rate }"
                          @click="handleRateChange(rate)"
                        >
                          {{ rate }}x
                        </button>
                      </div>
                    </div>
                    <button class="ctrl-btn" @click="toggleFullscreen">
                      <svg class="ctrl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path
                          d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 视频加载失败或无视频时的占位 -->
          <div v-else class="video-placeholder">
            <div class="placeholder-inner">
              <div class="placeholder-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <p class="placeholder-title">{{ videoError ? '视频资源加载失败' : '暂无课程视频' }}</p>
              <p class="placeholder-desc">{{ videoError ? '请检查网络连接或稍后重试' : '该课程尚未上传视频' }}</p>
            </div>
          </div>

          <!-- 课程基本信息 -->
          <div class="info-card">
            <!-- <div class="info-header">
              <h2 class="info-title">{{ course.name }}</h2>
              <span v-if="course.parseStatus && course.parseStatus !== 'none'" class="parse-badge" :class="course.parseStatus === 'parsing' ? 'badge-parsing' : 'badge-parsed'">
                <svg v-if="course.parseStatus === 'parsing'" class="badge-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                <svg v-else class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {{ course.parseStatus === 'parsing' ? '解析中' : '已解析' }}
              </span>
            </div> -->
            <div class="info-meta">
              <span class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ course.date }} {{ course.timeRange }}
              </span>
              <span class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {{ course.location }}
              </span>
              <span v-for="tag in course.tags" :key="tag" class="meta-tag" :class="getTagClass(tag)">
                <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 课程简介 -->
          <div v-if="course.parseStatus !== 'parsing'" class="info-card">
            <div class="intro-header">
              <h3 class="intro-title">
                <svg class="intro-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                课程简介
              </h3>
              <button class="expand-btn" @click="isExpanded = !isExpanded">
                {{ isExpanded ? '收起' : '展开' }}
                <svg
                  class="expand-icon"
                  :class="{ rotated: isExpanded }"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            <p class="intro-text" :class="{ collapsed: !isExpanded }">
              {{ course.description }}
            </p>
          </div>
        </div>

        <!-- 右侧区域 - AI分析面板 -->
        <div class="detail-right">
          <div class="ai-panel">
            <!-- 解析中状态 -->
            <div v-if="course.parseStatus === 'parsing'" class="parsing-state">
              <div class="parsing-icon">
                <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
              </div>
              <p class="parsing-title">AI解析中</p>
              <p class="parsing-desc">
                正在对课程视频进行智能分析，包括知识点切片、知识脑图和AI笔记生成，请稍后再来查看
              </p>
            </div>

            <!-- 解析完成内容 -->
            <template v-else>
              <!-- 标签页 -->
              <div class="ai-tabs">
                <button
                  v-for="tab in aiTabs"
                  :key="tab.id"
                  class="ai-tab"
                  :class="{ active: activeTab === tab.id }"
                  @click="activeTab = tab.id"
                >
                  <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <template v-if="tab.id === 'slices'">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </template>
                    <template v-if="tab.id === 'mindmap'">
                      <path d="M12 2a3 3 0 0 0-3 3v14a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M12 8h.01"></path>
                      <path d="M8 14h.01"></path>
                      <path d="M16 14h.01"></path>
                      <path d="M12 20h.01"></path>
                    </template>
                    <template v-if="tab.id === 'notes'">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </template>
                  </svg>
                  {{ tab.label }}
                  <div v-if="activeTab === tab.id" class="tab-indicator"></div>
                </button>
              </div>

              <!-- 知识点切片 -->
              <div v-if="activeTab === 'slices'" class="tab-content">
                <div class="content-header">
                  <p class="content-subtitle">AI自动识别 {{ course.knowledgePoints?.length || 0 }} 个知识点节点</p>
                  <span class="sort-hint">按时间排序</span>
                </div>
                <div class="slice-list">
                  <div
                    v-for="(point, index) in course.knowledgePoints"
                    :key="point.id"
                    class="slice-item"
                    @click="jumpToTime(point.timestamp)"
                  >
                    <div class="slice-left">
                      <span class="slice-num">{{ index + 1 }}</span>
                      <div class="slice-info">
                        <p class="slice-name">{{ point.name }}</p>
                        <p class="slice-time">时间点 {{ point.formattedTime }}</p>
                      </div>
                    </div>
                    <button class="slice-jump">
                      <svg class="jump-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      跳转
                    </button>
                  </div>
                  <div v-if="!course.knowledgePoints || course.knowledgePoints.length === 0" class="empty-content">
                    暂无知识点切片数据
                  </div>
                </div>
              </div>

              <!-- 知识脑图 -->
              <div v-if="activeTab === 'mindmap'" class="tab-content">
                <div class="mindmap-wrap">
                  <div class="mindmap-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2a3 3 0 0 0-3 3v14a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M12 8h.01"></path>
                      <path d="M8 14h.01"></path>
                      <path d="M16 14h.01"></path>
                      <path d="M12 20h.01"></path>
                    </svg>
                    <p>AI自动生成知识脑图</p>
                    <p class="sub">数据来源：视图AI一体机</p>
                  </div>
                  <div class="mindmap-structure">
                    <p class="structure-title">课程知识结构：</p>
                    <div class="structure-center">
                      <span class="center-node">{{ courseNameShort }}</span>
                    </div>
                    <div class="structure-nodes">
                      <span v-for="item in mindMapItems" :key="item" class="structure-node">{{ item }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- AI笔记 -->
              <div v-if="activeTab === 'notes'" class="tab-content">
                <div class="notes-search">
                  <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input v-model="noteSearch" type="text" class="search-input" placeholder="按笔记内容关键词搜索" />
                </div>
                <p class="notes-count">AI语音转写笔记，共 {{ filteredNotes.length }} 条</p>
                <div class="notes-list">
                  <div v-for="note in filteredNotes" :key="note.id" class="note-item">
                    <div class="note-header">
                      <button class="note-time" @click="jumpToTime(note.timestamp)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {{ note.formattedTime }}
                      </button>
                      <span class="note-speaker">{{ note.speaker }}</span>
                    </div>
                    <p class="note-content">{{ note.content }}</p>
                  </div>
                  <div v-if="filteredNotes.length === 0" class="empty-content">暂无AI笔记数据</div>
                </div>
              </div>
            </template>

            <!-- 底部操作按钮 -->
            <div class="panel-footer">
              <p class="footer-source">数据来源：视图AI一体机</p>
              <div class="footer-actions">
                <a v-if="course.videoUrl" :href="course.videoUrl" download class="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  下载视频
                </a>
                <button class="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  导出笔记
                </button>
                <button class="action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  分享课程
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const mockCourseDetail = {
    1: {
      id: '1',
      name: '数学基础课 - 轴对称图形',
      date: '2026-04-15',
      timeRange: '08:00 - 08:45',
      location: '坪山中学 教学楼A-301',
      tags: ['精品课'],
      description:
        '本节课主要讲解轴对称图形的基本概念、性质及在生活中的应用。通过多媒体展示和互动练习，帮助学生理解轴对称的定义，掌握判断轴对称图形的方法，并能够画出简单图形的对称轴。课堂氛围活跃，学生参与度高。',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      parseStatus: 'parsed',
      knowledgePoints: [
        { id: '1', name: '轴对称定义', timestamp: 320, formattedTime: '05:20' },
        { id: '2', name: '生活中的轴对称', timestamp: 765, formattedTime: '12:45' },
        { id: '3', name: '对称轴画法', timestamp: 1110, formattedTime: '18:30' },
        { id: '4', name: '课堂练习', timestamp: 1680, formattedTime: '28:00' },
        { id: '5', name: '课堂总结', timestamp: 2110, formattedTime: '35:10' },
      ],
      aiNotes: [
        {
          id: '1',
          timestamp: 15,
          formattedTime: '00:15',
          content: '同学们好，今天我们来学习轴对称图形。请大家先看屏幕上的这几张图片。',
          speaker: '教师',
        },
        {
          id: '2',
          timestamp: 320,
          formattedTime: '05:20',
          content: '轴对称图形的定义是：如果一个图形沿着一条直线对折后，两边能够完全重合，那么这个图形就是轴对称图形。',
          speaker: '教师',
        },
        {
          id: '3',
          timestamp: 765,
          formattedTime: '12:45',
          content: '老师，生活中的轴对称有哪些例子？',
          speaker: '学生',
        },
        {
          id: '4',
          timestamp: 780,
          formattedTime: '13:00',
          content:
            '很好，生活中的轴对称非常多，比如蝴蝶的翅膀、树叶、建筑物等等。大家观察一下教室里的物品，有哪些是轴对称的？',
          speaker: '教师',
        },
        {
          id: '5',
          timestamp: 1110,
          formattedTime: '18:30',
          content:
            '画对称轴的方法是：先找到图形中对折后能够重合的对应点，然后连接这些对应点，对称轴就在这些连线的垂直平分线上。',
          speaker: '教师',
        },
        {
          id: '6',
          timestamp: 1680,
          formattedTime: '28:00',
          content: '现在请大家完成练习册第15页的第3题，画出下列图形的对称轴。',
          speaker: '教师',
        },
        {
          id: '7',
          timestamp: 2110,
          formattedTime: '35:10',
          content: '今天我们学习了轴对称图形的定义、性质和画法。下节课我们将继续学习轴对称的应用。请大家课后复习。',
          speaker: '教师',
        },
      ],
    },
  };

  const tagStyles = {
    精品课: 'tag-blue',
    户外教学: 'tag-green',
    实验课: 'tag-orange',
  };

  export default {
    name: 'CourseDetail',
    props: {
      courseId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        isPlaying: false,
        currentTime: 0,
        duration: 2400,
        volume: 1,
        isMuted: false,
        playbackRate: 1,
        showRateMenu: false,
        isExpanded: false,
        noteSearch: '',
        activeTab: 'slices',
        videoError: false,
        aiTabs: [
          { id: 'slices', label: '知识点切片' },
          { id: 'mindmap', label: '知识脑图' },
          { id: 'notes', label: 'AI笔记' },
        ],
        mindMapItems: ['定义与性质', '生活中的应用', '核心方法', '课堂练习', '总结回顾'],
      };
    },
    computed: {
      course() {
        return (
          mockCourseDetail[this.courseId] || {
            id: this.courseId,
            name: '未知课程',
            date: '',
            timeRange: '',
            location: '',
            tags: [],
            description: '',
            videoUrl: '',
            parseStatus: 'none',
            knowledgePoints: [],
            aiNotes: [],
          }
        );
      },
      hasVideo() {
        return this.course.videoUrl && this.course.videoUrl.length > 0;
      },
      courseNameShort() {
        return this.course.name.split('-')[0]?.trim() || this.course.name;
      },
      filteredNotes() {
        if (!this.course.aiNotes) return [];
        if (!this.noteSearch) return this.course.aiNotes;
        return this.course.aiNotes.filter(note => note.content.toLowerCase().includes(this.noteSearch.toLowerCase()));
      },
      playbackRates() {
        return [1, 1.25, 1.5, 2];
      },
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
      document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
      getTagClass(tag) {
        return tagStyles[tag] || 'tag-gray';
      },
      togglePlay() {
        const video = this.$refs.videoRef;
        if (!video) return;
        if (this.isPlaying) {
          video.pause();
        } else {
          video.play();
        }
        this.isPlaying = !this.isPlaying;
      },
      onTimeUpdate() {
        const video = this.$refs.videoRef;
        if (video) this.currentTime = video.currentTime;
      },
      onLoadedMetadata() {
        const video = this.$refs.videoRef;
        if (video) this.duration = video.duration || 2400;
      },
      onSeek(e) {
        const time = parseFloat(e.target.value);
        const video = this.$refs.videoRef;
        if (video) {
          video.currentTime = time;
          this.currentTime = time;
        }
      },
      onVolumeChange(e) {
        const vol = parseFloat(e.target.value);
        this.volume = vol;
        this.isMuted = vol === 0;
        const video = this.$refs.videoRef;
        if (video) video.volume = vol;
      },
      toggleMute() {
        const video = this.$refs.videoRef;
        if (video) {
          video.muted = !this.isMuted;
          this.isMuted = !this.isMuted;
        }
      },
      handleRateChange(rate) {
        const video = this.$refs.videoRef;
        if (video) {
          video.playbackRate = rate;
          this.playbackRate = rate;
        }
        this.showRateMenu = false;
      },
      jumpToTime(time) {
        const video = this.$refs.videoRef;
        if (video) {
          video.currentTime = time;
          this.currentTime = time;
          if (!this.isPlaying) {
            video.play();
            this.isPlaying = true;
          }
        }
      },
      toggleFullscreen() {
        const video = this.$refs.videoRef;
        if (!video) return;
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          video.requestFullscreen();
        }
      },
      formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      },
      handleClickOutside(e) {
        const rateWrap = this.$el.querySelector('.rate-wrap');
        if (rateWrap && !rateWrap.contains(e.target)) {
          this.showRateMenu = false;
        }
      },
    },
  };
</script>

<style scoped>
  .course-detail {
    min-height: 100%;
    background: #f5f7fa;
  }

  .detail-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 16px 24px;
  }

  /* 返回按钮 */
  .back-bar {
    margin-bottom: 16px;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border: none;
    background: transparent;
    color: #666;
    font-size: 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    color: #1e88e5;
    background: white;
  }

  .back-btn .btn-icon {
    width: 16px;
    height: 16px;
  }

  /* 主内容区 - 左右分栏 */
  .detail-layout {
    display: flex;
    gap: 24px;
  }

  .detail-left {
    flex: 55;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .detail-right {
    flex: 45;
  }

  /* 视频播放器 */
  .video-player {
    background: black;
    border-radius: 12px;
    overflow: hidden;
  }

  .video-wrap {
    position: relative;
    aspect-ratio: 16 / 9;
  }

  .video-element {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .play-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
  }

  .play-btn {
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .play-btn:hover {
    background: white;
  }

  .play-btn svg {
    width: 28px;
    height: 28px;
    color: #1e88e5;
    margin-left: 4px;
  }

  /* 视频控制栏 */
  .video-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    padding: 24px 16px 12px;
  }

  .progress-bar {
    margin-bottom: 8px;
  }

  .progress-input {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    cursor: pointer;
    outline: none;
  }

  .progress-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: #1e88e5;
    border-radius: 50%;
    cursor: pointer;
  }

  .progress-input::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #1e88e5;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }

  .controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .controls-left,
  .controls-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ctrl-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: none;
    background: transparent;
    color: white;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .ctrl-btn:hover {
    color: #1e88e5;
  }

  .ctrl-icon {
    width: 20px;
    height: 20px;
  }

  .time-display {
    color: white;
    font-size: 12px;
    margin-left: 4px;
  }

  /* 音量 */
  .volume-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .volume-slider {
    width: 64px;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    cursor: pointer;
    outline: none;
  }

  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }

  .volume-slider::-moz-range-thumb {
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }

  /* 倍速 */
  .rate-wrap {
    position: relative;
  }

  .rate-btn {
    padding: 4px 8px;
    border: none;
    background: transparent;
    color: white;
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .rate-btn:hover {
    color: #1e88e5;
  }

  .rate-menu {
    position: absolute;
    bottom: calc(100% + 4px);
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 8px;
    overflow: hidden;
    min-width: 80px;
  }

  .rate-item {
    display: block;
    width: 100%;
    padding: 8px 16px;
    border: none;
    background: transparent;
    color: white;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .rate-item:hover,
  .rate-item.active {
    background: #1e88e5;
  }

  /* 视频占位 */
  .video-placeholder {
    background: #111827;
    border-radius: 12px;
    overflow: hidden;
  }

  .placeholder-inner {
    aspect-ratio: 16 / 9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .placeholder-icon {
    width: 80px;
    height: 80px;
    background: #1f2937;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .placeholder-icon svg {
    width: 36px;
    height: 36px;
    color: #6b7280;
  }

  .placeholder-title {
    color: #9ca3af;
    font-size: 14px;
    margin: 0 0 4px 0;
  }

  .placeholder-desc {
    color: #4b5563;
    font-size: 12px;
    margin: 0;
  }

  /* 信息卡片 */
  .info-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
  }

  .info-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }

  .info-title {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 0;
    flex: 1;
  }

  .parse-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .badge-parsing {
    background: #fff8e1;
    color: #f9a825;
    border-color: #ffecb3;
  }

  .badge-parsed {
    background: #e8f5e9;
    color: #43a047;
    border-color: #c8e6c9;
  }

  .badge-icon {
    width: 14px;
    height: 14px;
  }

  .badge-icon.spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .info-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
  }

  .info-meta .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #666;
  }

  .info-meta .meta-icon {
    width: 16px;
    height: 16px;
    color: #999;
  }

  .meta-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid;
  }

  .meta-tag .tag-icon {
    width: 12px;
    height: 12px;
  }

  .tag-blue {
    background: #e3f2fd;
    color: #1e88e5;
    border-color: #bbdefb;
  }

  .tag-green {
    background: #e8f5e9;
    color: #43a047;
    border-color: #c8e6c9;
  }

  .tag-orange {
    background: #fff3e0;
    color: #fb8c00;
    border-color: #ffe0b2;
  }

  .tag-gray {
    background: #f5f5f5;
    color: #666;
    border-color: #e0e0e0;
  }

  /* 课程简介 */
  .intro-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .intro-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .intro-icon {
    width: 18px;
    height: 18px;
    color: #1e88e5;
  }

  .expand-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border: none;
    background: transparent;
    color: #1e88e5;
    font-size: 13px;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .expand-btn:hover {
    color: #1976d2;
  }

  .expand-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }

  .expand-icon.rotated {
    transform: rotate(180deg);
  }

  .intro-text {
    font-size: 14px;
    color: #666;
    line-height: 1.7;
    margin: 0;
  }

  .intro-text.collapsed {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 右侧AI面板 */
  .ai-panel {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* 解析中状态 */
  .parsing-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
  }

  .parsing-icon {
    width: 64px;
    height: 64px;
    background: #fff8e1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .parsing-icon svg {
    width: 32px;
    height: 32px;
    color: #f9a825;
  }

  .parsing-icon .spin {
    animation: spin 1s linear infinite;
  }

  .parsing-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px 0;
  }

  .parsing-desc {
    font-size: 13px;
    color: #999;
    text-align: center;
    max-width: 280px;
    margin: 0;
    line-height: 1.6;
  }

  /* AI标签页 */
  .ai-tabs {
    display: flex;
    padding: 16px 16px 0;
    border-bottom: 1px solid #f0f0f0;
    gap: 4px;
  }

  .ai-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border: none;
    background: transparent;
    font-size: 14px;
    color: #888;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    white-space: nowrap;
  }

  .ai-tab:hover {
    color: #555;
  }

  .ai-tab.active {
    color: #1e88e5;
    font-weight: 500;
  }

  .tab-icon {
    width: 16px;
    height: 16px;
  }

  .tab-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #1e88e5;
  }

  /* 标签内容 */
  .tab-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }

  .content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .content-subtitle {
    font-size: 12px;
    color: #bbb;
    margin: 0;
  }

  .sort-hint {
    font-size: 12px;
    color: #ddd;
  }

  /* 知识点切片 */
  .slice-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .slice-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .slice-item:hover {
    background: #e3f2fd;
    border-color: rgba(30, 136, 229, 0.2);
  }

  .slice-item:hover .slice-jump {
    opacity: 1;
  }

  .slice-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .slice-num {
    width: 24px;
    height: 24px;
    background: #e3f2fd;
    color: #1e88e5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .slice-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin: 0 0 2px 0;
  }

  .slice-time {
    font-size: 12px;
    color: #bbb;
    margin: 0;
  }

  .slice-jump {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: none;
    background: transparent;
    color: #1e88e5;
    font-size: 12px;
    border-radius: 6px;
    cursor: pointer;
    opacity: 0;
    transition: all 0.2s ease;
  }

  .slice-jump:hover {
    background: #1e88e5;
    color: white;
  }

  .jump-icon {
    width: 12px;
    height: 12px;
  }

  /* 知识脑图 */
  .mindmap-wrap {
    text-align: center;
  }

  .mindmap-placeholder {
    width: 100%;
    height: 240px;
    background: #f8f8f8;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    border: 1px dashed #e0e0e0;
  }

  .mindmap-placeholder svg {
    width: 48px;
    height: 48px;
    color: #ddd;
    margin-bottom: 12px;
  }

  .mindmap-placeholder p {
    font-size: 14px;
    color: #bbb;
    margin: 0;
  }

  .mindmap-placeholder .sub {
    font-size: 12px;
    color: #ddd;
    margin-top: 4px;
  }

  .mindmap-structure {
    text-align: left;
  }

  .structure-title {
    font-size: 14px;
    color: #666;
    font-weight: 500;
    margin: 0 0 12px 0;
  }

  .structure-center {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
  }

  .center-node {
    padding: 8px 16px;
    background: #e3f2fd;
    color: #1e88e5;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
  }

  .structure-nodes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  .structure-node {
    padding: 5px 12px;
    background: #f8f8f8;
    color: #666;
    border-radius: 8px;
    font-size: 12px;
    border: 1px solid #f0f0f0;
  }

  /* AI笔记 */
  .notes-search {
    position: relative;
    margin-bottom: 12px;
  }

  .notes-search .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #bbb;
  }

  .notes-search .search-input {
    width: 100%;
    height: 36px;
    padding: 0 12px 0 36px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 13px;
    background: #f8f8f8;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .notes-search .search-input:focus {
    border-color: #1e88e5;
    box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
    background: white;
  }

  .notes-count {
    font-size: 12px;
    color: #bbb;
    margin: 0 0 12px 0;
  }

  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 420px;
    overflow-y: auto;
  }

  .note-item {
    background: #f8f8f8;
    border-radius: 8px;
    padding: 12px;
    transition: background 0.2s ease;
  }

  .note-item:hover {
    background: #e3f2fd;
  }

  .note-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .note-time {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: none;
    background: transparent;
    color: #1e88e5;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
  }

  .note-time:hover {
    color: #1976d2;
  }

  .note-time svg {
    width: 12px;
    height: 12px;
  }

  .note-speaker {
    font-size: 12px;
    color: #bbb;
  }

  .note-content {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    margin: 0;
  }

  /* 空内容 */
  .empty-content {
    text-align: center;
    padding: 32px 0;
    color: #bbb;
    font-size: 14px;
  }

  /* 面板底部 */
  .panel-footer {
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .footer-source {
    font-size: 12px;
    color: #ddd;
    margin: 0;
    white-space: nowrap;
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border: 1px solid #e0e0e0;
    background: white;
    color: #666;
    font-size: 13px;
    border-radius: 8px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .action-btn:hover {
    color: #1e88e5;
    border-color: #1e88e5;
    background: #e3f2fd;
  }

  .action-btn svg {
    width: 14px;
    height: 14px;
  }

  /* 响应式适配 */
  @media (max-width: 1200px) {
    .detail-layout {
      flex-direction: column;
    }

    .detail-left,
    .detail-right {
      flex: none;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .detail-container {
      padding: 12px 16px;
    }

    .info-header {
      flex-direction: column;
      gap: 8px;
    }

    .info-meta {
      gap: 10px;
    }

    .ai-tabs {
      overflow-x: auto;
      padding: 12px 12px 0;
    }

    .panel-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .footer-actions {
      width: 100%;
      flex-wrap: wrap;
    }

    .slice-jump {
      opacity: 1;
    }
  }
</style>
