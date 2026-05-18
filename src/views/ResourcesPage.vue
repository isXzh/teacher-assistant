<template>
  <div class="resources-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">资源库</h2>
          <p class="page-subtitle">管理和分享您的教学资源</p>
        </div>
        <div class="header-right">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="搜索资源..."
            />
          </div>
          <!-- 视图切换 -->
          <div class="view-toggle">
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="page-body">
      <!-- 分类筛选 -->
      <div class="category-bar">
        <button
          v-for="category in categories"
          :key="category"
          class="category-btn"
          :class="{ active: activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <!-- 资源列表 -->
      <div v-if="filteredResources.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <p class="empty-text">暂无资源</p>
      </div>

      <!-- 列表视图 -->
      <div v-else-if="viewMode === 'list'" class="list-view">
        <div class="list-header">
          <div class="col-name">资源名称</div>
          <div class="col-category">分类</div>
          <div class="col-size">大小</div>
          <div class="col-time">更新时间</div>
          <div class="col-action">操作</div>
        </div>
        <div
          v-for="resource in filteredResources"
          :key="resource.id"
          class="list-row"
        >
          <div class="col-name">
            <div class="resource-icon" :class="getResourceConfig(resource.type).color">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="resource.type === 'document'" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <path v-if="resource.type === 'document'" d="M14 2v6h6"></path>
                <polygon v-if="resource.type === 'video'" points="23 7 16 12 23 17 23 7"></polygon>
                <rect v-if="resource.type === 'video'" x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                <rect v-if="resource.type === 'image'" x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle v-if="resource.type === 'image'" cx="8.5" cy="8.5" r="1.5"></circle>
                <path v-if="resource.type === 'image'" d="M21 15l-5-5L5 21"></path>
                <path v-if="resource.type === 'audio'" d="M9 18V5l12-3v13"></path>
                <circle v-if="resource.type === 'audio'" cx="6" cy="18" r="3"></circle>
                <circle v-if="resource.type === 'audio'" cx="18" cy="16" r="3"></circle>
                <path v-if="resource.type === 'other'" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline v-if="resource.type === 'other'" points="7 10 12 15 17 10"></polyline>
                <line v-if="resource.type === 'other'" x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <span class="resource-name">{{ resource.name }}</span>
          </div>
          <div class="col-category">
            <span class="category-tag">{{ resource.category }}</span>
          </div>
          <div class="col-size">{{ resource.size }}</div>
          <div class="col-time">{{ resource.updateTime }}</div>
          <div class="col-action">
            <button class="action-icon-btn preview" title="预览">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="action-icon-btn download" title="下载">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
            <button class="action-icon-btn more" title="更多">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 网格视图 -->
      <div v-else class="grid-view">
        <div
          v-for="resource in filteredResources"
          :key="resource.id"
          class="grid-card"
        >
          <div class="grid-card-header">
            <div class="resource-icon" :class="getResourceConfig(resource.type).color">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="resource.type === 'document'" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <path v-if="resource.type === 'document'" d="M14 2v6h6"></path>
                <polygon v-if="resource.type === 'video'" points="23 7 16 12 23 17 23 7"></polygon>
                <rect v-if="resource.type === 'video'" x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                <rect v-if="resource.type === 'image'" x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle v-if="resource.type === 'image'" cx="8.5" cy="8.5" r="1.5"></circle>
                <path v-if="resource.type === 'image'" d="M21 15l-5-5L5 21"></path>
                <path v-if="resource.type === 'audio'" d="M9 18V5l12-3v13"></path>
                <circle v-if="resource.type === 'audio'" cx="6" cy="18" r="3"></circle>
                <circle v-if="resource.type === 'audio'" cx="18" cy="16" r="3"></circle>
                <path v-if="resource.type === 'other'" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline v-if="resource.type === 'other'" points="7 10 12 15 17 10"></polyline>
                <line v-if="resource.type === 'other'" x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <button class="more-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
          <h4 class="grid-resource-name">{{ resource.name }}</h4>
          <p class="grid-resource-category">{{ resource.category }}</p>
          <div class="grid-resource-meta">
            <span>{{ resource.size }}</span>
            <span>{{ resource.updateTime }}</span>
          </div>
          <div class="grid-resource-actions">
            <button class="grid-action-btn preview">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              预览
            </button>
            <button class="grid-action-btn download">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              下载
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourcesPage',
  data() {
    return {
      viewMode: 'list',
      searchQuery: '',
      activeCategory: '全部',
      categories: ['全部', '教学文档', '视频资源', '图片素材', '音频资源', '压缩文件'],
      resources: [
        { id: 1, name: '2026年春季学期教学计划.docx', type: 'document', size: '2.5MB', updateTime: '2026-03-01', category: '教学文档', views: 128, downloads: 45 },
        { id: 2, name: '长征精神精品课录制视频.mp4', type: 'video', size: '856MB', updateTime: '2026-02-28', category: '视频资源', views: 342, downloads: 89 },
        { id: 3, name: '数据结构思维导图.png', type: 'image', size: '4.2MB', updateTime: '2026-02-25', category: '图片素材', views: 215, downloads: 67 },
        { id: 4, name: '马克思主义基本原理课件.pptx', type: 'document', size: '18.6MB', updateTime: '2026-02-20', category: '教学文档', views: 189, downloads: 56 },
        { id: 5, name: '英语听力训练音频.mp3', type: 'audio', size: '12.3MB', updateTime: '2026-02-18', category: '音频资源', views: 98, downloads: 34 },
        { id: 6, name: '教学资源汇总.zip', type: 'other', size: '156MB', updateTime: '2026-02-15', category: '压缩文件', views: 76, downloads: 23 },
      ],
    }
  },
  computed: {
    filteredResources() {
      return this.resources.filter((resource) => {
        const matchesSearch = resource.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = this.activeCategory === '全部' || resource.category === this.activeCategory
        return matchesSearch && matchesCategory
      })
    },
  },
  methods: {
    getResourceConfig(type) {
      const config = {
        document: { color: 'blue' },
        video: { color: 'red' },
        image: { color: 'green' },
        audio: { color: 'purple' },
        other: { color: 'gray' },
      }
      return config[type] || config.other
    },
  },
}
</script>

<style scoped>
.resources-page {
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

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
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
  width: 200px;
  height: 36px;
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

.view-toggle {
  display: flex;
  align-items: center;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 3px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  background: transparent;
  color: #888;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn svg {
  width: 16px;
  height: 16px;
}

.toggle-btn.active {
  background: white;
  color: #1E88E5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 页面主体 */
.page-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
}

/* 分类筛选 */
.category-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-btn {
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

.category-btn:hover {
  border-color: #c0c0c0;
}

.category-btn.active {
  background: #1E88E5;
  color: white;
  border-color: #1E88E5;
}

/* 列表视图 */
.list-view {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 120px;
  gap: 12px;
  padding: 12px 20px;
  background: #f8f8f8;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.list-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 120px;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid #f5f5f5;
  align-items: center;
  transition: background 0.2s ease;
}

.list-row:hover {
  background: #fafafa;
}

.col-name {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.resource-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.resource-icon svg {
  width: 18px;
  height: 18px;
}

.resource-icon.blue {
  background: #E3F2FD;
  color: #1E88E5;
}

.resource-icon.red {
  background: #FFEBEE;
  color: #E53935;
}

.resource-icon.green {
  background: #E8F5E9;
  color: #43A047;
}

.resource-icon.purple {
  background: #F3E5F5;
  color: #8E24AA;
}

.resource-icon.gray {
  background: #f5f5f5;
  color: #757575;
}

.resource-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-category,
.col-size,
.col-time {
  font-size: 13px;
  color: #666;
}

.category-tag {
  display: inline-block;
  padding: 2px 10px;
  background: #f0f0f0;
  color: #666;
  border-radius: 12px;
  font-size: 12px;
}

.col-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
}

.action-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  background: transparent;
  color: #999;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-icon-btn svg {
  width: 16px;
  height: 16px;
}

.action-icon-btn.preview:hover {
  color: #1E88E5;
  background: #E3F2FD;
}

.action-icon-btn.download:hover {
  color: #43A047;
  background: #E8F5E9;
}

.action-icon-btn.more:hover {
  color: #666;
  background: #f0f0f0;
}

/* 网格视图 */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.grid-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.grid-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.grid-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.grid-card-header .resource-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
}

.grid-card-header .resource-icon svg {
  width: 22px;
  height: 22px;
}

.more-btn {
  display: flex;
  padding: 4px;
  border: none;
  background: transparent;
  color: #999;
  border-radius: 6px;
  cursor: pointer;
}

.more-btn svg {
  width: 16px;
  height: 16px;
}

.grid-resource-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.grid-resource-category {
  font-size: 12px;
  color: #999;
  margin: 0 0 10px 0;
}

.grid-resource-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #aaa;
  margin-bottom: 12px;
}

.grid-resource-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.grid-action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 7px 0;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.grid-action-btn svg {
  width: 14px;
  height: 14px;
}

.grid-action-btn.preview {
  background: #E3F2FD;
  color: #1E88E5;
}

.grid-action-btn.preview:hover {
  background: #BBDEFB;
}

.grid-action-btn.download {
  background: #E8F5E9;
  color: #43A047;
}

.grid-action-btn.download:hover {
  background: #C8E6C9;
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

  .search-input {
    width: 160px;
  }

  .page-body {
    padding: 12px 16px;
  }

  .list-header {
    display: none;
  }

  .list-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .col-category,
  .col-size,
  .col-time {
    display: none;
  }

  .col-action {
    justify-content: flex-start;
    margin-top: 8px;
  }
}
</style>
