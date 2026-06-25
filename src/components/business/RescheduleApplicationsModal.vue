<template>
  <div v-if="visible" class="applications-modal-overlay">
    <div class="applications-modal-mask"></div>
    <div class="applications-modal">
      <div class="modal-header">
        <div class="header-left">
          <div class="header-icon-wrapper">
            <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2"></path>
              <rect x="9" y="2" width="6" height="6" rx="1"></rect>
              <path d="M9 14h6"></path>
              <path d="M9 18h6"></path>
            </svg>
          </div>
          <div class="header-text">
            <h3 class="modal-title">我的调课申请</h3>
            <p class="modal-subtitle">查看您提交的所有调课申请及审批进度</p>
          </div>
        </div>
        <button class="close-btn" @click="handleClose" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="filter-card">
          <div class="filter-row">
            <div class="filter-tabs">
              <button
                v-for="tab in tabList"
                :key="tab.id"
                class="filter-tab"
                :class="{ active: statusFilter === tab.id }"
                @click="statusFilter = tab.id"
              >
                {{ tab.label }}
                <span class="tab-count" :class="{ active: statusFilter === tab.id }">
                  {{ counts[tab.id] }}
                </span>
              </button>
            </div>
            <div class="search-wrapper">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input v-model="keyword" class="search-input" placeholder="搜索课程名称 / 日期 / 原因" />
            </div>
          </div>
        </div>

        <div v-if="loading" class="state-card">
          <p class="state-text">加载中...</p>
        </div>

        <div v-else-if="filteredList.length === 0" class="state-card empty-card">
          <div class="empty-icon-wrapper">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <p class="empty-title">暂无调课申请记录</p>
          <p class="empty-desc">在课表页面为课程发起调课申请后将显示在这里</p>
        </div>

        <div v-else class="application-list">
          <div v-for="app in filteredList" :key="app.adjustmentId" class="application-card">
            <div class="card-header">
              <div class="card-header-left">
                <h4 class="course-name">{{ app.courseName }}</h4>
                <p class="application-no">申请编号：{{ app.applicationNo }}</p>
              </div>
              <span class="status-badge" :class="getStatusClass(app.approvalStatus)">
                <span
                  class="status-dot"
                  :class="[getStatusDotClass(app.approvalStatus), { pulsing: app.approvalStatus === 1 }]"
                ></span>
                {{ getStatusText(app) }}
              </span>
            </div>

            <div class="compare-grid">
              <div class="compare-item original">
                <p class="compare-title">
                  <span class="compare-bar gray"></span>
                  原课程信息
                </p>
                <div class="compare-info">
                  <div class="info-row">
                    <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{{ app.originalDate }}</span>
                  </div>
                  <div class="info-row">
                    <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{{ app.originalPeriodInfo }}</span>
                  </div>
                  <div class="info-row">
                    <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="truncate">{{ app.originalLocation }}</span>
                  </div>
                </div>
              </div>

              <div class="compare-item adjusted">
                <p class="compare-title primary">
                  <span class="compare-bar primary"></span>
                  期望调整
                </p>
                <div class="compare-info">
                  <div class="info-row">
                    <svg
                      class="info-icon primary"
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
                    <span>{{ app.adjustDate }}</span>
                  </div>
                  <div class="info-row">
                    <svg
                      class="info-icon primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{{ app.adjustPeriodInfo }}</span>
                  </div>
                  <div class="info-row">
                    <svg
                      class="info-icon primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <span>主讲：{{ app.adjustTeacherName }}</span>
                  </div>
                  <div v-if="app.location" class="info-row">
                    <svg
                      class="info-icon primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="truncate">{{ app.location }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="reason-block">
              <p class="reason-title">调课原因</p>
              <p class="reason-text">{{ app.adjustReason || '-' }}</p>
            </div>

            <div class="card-footer">
              <div class="apply-time">
                <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>申请时间：{{ app.applyTime }}</span>
              </div>

              <button
                v-if="app.approvalStatus === 1"
                class="withdraw-btn"
                :disabled="withdrawingId === app.adjustmentId"
                @click="handleWithdraw(app)"
              >
                <svg class="withdraw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                {{ withdrawingId === app.adjustmentId ? '撤回中...' : '撤回申请' }}
              </button>

              <span v-else-if="app.approvalStatus === 3 && app.approvalRemark" class="footer-remark rejected">
                审批意见：{{ app.approvalRemark }}
              </span>

              <span v-else-if="app.approvalStatus === 2" class="footer-remark approved">
                审批已通过，请按新时间授课
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import courseApi from '@/api/course';

  const STATUS_MAP = {
    0: { text: '已撤回', class: 'status-cancelled', dot: 'dot-cancelled' },
    1: { text: '调课审核中', class: 'status-pending', dot: 'dot-pending' },
    2: { text: '已通过', class: 'status-approved', dot: 'dot-approved' },
    3: { text: '已驳回', class: 'status-rejected', dot: 'dot-rejected' },
  };

  export default {
    name: 'RescheduleApplicationsModal',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        loading: false,
        applications: [],
        statusFilter: 'all',
        keyword: '',
        withdrawingId: null,
        tabList: [
          { id: 'all', label: '全部' },
          { id: 1, label: '审核中' },
          { id: 2, label: '已通过' },
          { id: 3, label: '已驳回' },
          { id: 0, label: '已撤回' },
        ],
      };
    },
    computed: {
      counts() {
        const result = { all: this.applications.length, 0: 0, 1: 0, 2: 0, 3: 0 };
        this.applications.forEach(app => {
          if (result[app.approvalStatus] != null) {
            result[app.approvalStatus]++;
          }
        });
        return result;
      },
      filteredList() {
        const k = this.keyword.trim().toLowerCase();
        return this.applications.filter(app => {
          if (this.statusFilter !== 'all' && app.approvalStatus !== this.statusFilter) {
            return false;
          }
          if (k) {
            const fields = [app.courseName, app.adjustDate, app.originalDate, app.adjustPeriodInfo, app.adjustReason];
            return fields.some(f => f && String(f).toLowerCase().includes(k));
          }
          return true;
        });
      },
    },
    watch: {
      visible(val) {
        if (val) {
          this.statusFilter = 'all';
          this.keyword = '';
          this.fetchList();
        }
      },
    },
    methods: {
      getStatusText(app) {
        if (app.approvalStatusName) return app.approvalStatusName;
        const s = STATUS_MAP[app.approvalStatus];
        return s ? s.text : '未知';
      },
      getStatusClass(status) {
        const s = STATUS_MAP[status];
        return s ? s.class : '';
      },
      getStatusDotClass(status) {
        const s = STATUS_MAP[status];
        return s ? s.dot : '';
      },
      async fetchList() {
        this.loading = true;
        try {
          const res = await courseApi.myList();
          this.applications = (res && res.data) || [];
        } catch (err) {
          console.error('获取调课申请失败:', err);
          this.applications = [];
          this.$message && this.$message.error('获取调课申请列表失败');
        } finally {
          this.loading = false;
        }
      },
      handleWithdraw(app) {
        if (this.withdrawingId) return;
        this.$confirm('确定要撤回该调课申请吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.withdrawingId = app.adjustmentId;
            try {
              const res = await courseApi.withdraw(app.adjustmentId);
              const isSuccess = res && (res.success === true || res.code === 200);
              if (isSuccess) {
                this.$message && this.$message.success('已撤回申请');
                this.$emit('withdraw-success', app.adjustmentId);
                await this.fetchList();
              } else {
                this.$message && this.$message.error((res && res.message) || '撤回失败');
              }
            } catch (err) {
              console.error('撤回调课申请失败:', err);
              this.$message && this.$message.error((err && err.message) || '撤回失败，请稍后重试');
            } finally {
              this.withdrawingId = null;
            }
          })
          .catch(() => {});
      },
      handleClose() {
        this.$emit('update:visible', false);
        this.$emit('close');
      },
    },
  };
</script>

<style scoped>
  .applications-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 2200;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .applications-modal-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .applications-modal {
    position: relative;
    background: #f5f7fa;
    border-radius: 16px;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-width: 1024px;
    margin: 0 16px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    flex-shrink: 0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-icon-wrapper {
    width: 36px;
    height: 36px;
    background: #e6f4ff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-icon {
    width: 20px;
    height: 20px;
    color: #1677ff;
  }

  .header-text {
    display: flex;
    flex-direction: column;
  }

  .modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .modal-subtitle {
    font-size: 12px;
    color: #6b7280;
    margin: 2px 0 0;
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

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px 24px;
    background: #f5f7fa;
  }

  .filter-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f3f4f6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    padding: 16px;
    margin-bottom: 16px;
  }

  .filter-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .filter-tabs {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-tab {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    background: #fff;
    color: #4b5563;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-tab:hover {
    border-color: #d1d5db;
  }

  .filter-tab.active {
    background: #1677ff;
    color: #fff;
    border-color: #1677ff;
  }

  .tab-count {
    margin-left: 4px;
    padding: 2px 6px;
    font-size: 12px;
    border-radius: 9999px;
    background: #f3f4f6;
    color: #6b7280;
  }

  .tab-count.active {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  .search-wrapper {
    position: relative;
    width: 256px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #9ca3af;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 8px 12px 8px 36px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #111827;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .search-input::placeholder {
    color: #9ca3af;
  }

  .search-input:focus {
    border-color: #1677ff;
    box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.1);
  }

  .state-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f3f4f6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    padding: 80px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .state-text {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }

  .empty-icon-wrapper {
    width: 96px;
    height: 96px;
    background: #f9fafb;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .empty-icon {
    width: 48px;
    height: 48px;
    color: #d1d5db;
  }

  .empty-title {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
  }

  .empty-desc {
    font-size: 13px;
    color: #9ca3af;
    margin: 4px 0 0;
  }

  .application-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .application-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f3f4f6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    padding: 20px;
    transition: box-shadow 0.2s ease;
  }

  .application-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .card-header-left {
    flex: 1;
    min-width: 0;
  }

  .course-name {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .application-no {
    font-size: 12px;
    color: #9ca3af;
    margin: 2px 0 0;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid;
    white-space: nowrap;
  }

  .status-pending {
    background: #fff7ed;
    color: #ea580c;
    border-color: #fed7aa;
  }

  .status-approved {
    background: #f0fdf4;
    color: #16a34a;
    border-color: #bbf7d0;
  }

  .status-rejected {
    background: #fef2f2;
    color: #dc2626;
    border-color: #fecaca;
  }

  .status-cancelled {
    background: #f9fafb;
    color: #6b7280;
    border-color: #e5e7eb;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
  }

  .dot-pending {
    background: #f97316;
  }

  .dot-approved {
    background: #22c55e;
  }

  .dot-rejected {
    background: #ef4444;
  }

  .dot-cancelled {
    background: #9ca3af;
  }

  .pulsing {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  .compare-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  @media (min-width: 768px) {
    .compare-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .compare-item {
    border-radius: 8px;
    padding: 14px;
  }

  .compare-item.original {
    background: #f9fafb;
  }

  .compare-item.adjusted {
    background: #e6f4ff;
    border: 1px solid #bae0ff;
  }

  .compare-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    margin: 0 0 10px;
  }

  .compare-title.primary {
    color: #1677ff;
  }

  .compare-bar {
    width: 4px;
    height: 12px;
    border-radius: 2px;
    background: #9ca3af;
  }

  .compare-bar.primary {
    background: #1677ff;
  }

  .compare-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    color: #374151;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .info-icon {
    width: 14px;
    height: 14px;
    color: #9ca3af;
    flex-shrink: 0;
  }

  .info-icon.primary {
    color: #1677ff;
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .reason-block {
    background: #f9fafb;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .reason-title {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    margin: 0 0 4px;
  }

  .reason-text {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
    flex-wrap: wrap;
  }

  .apply-time {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #9ca3af;
  }

  .withdraw-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    color: #4b5563;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .withdraw-btn:hover:not(:disabled) {
    background: #f9fafb;
    color: #111827;
  }

  .withdraw-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .withdraw-icon {
    width: 14px;
    height: 14px;
  }

  .footer-remark {
    font-size: 12px;
  }

  .footer-remark.rejected {
    color: #ef4444;
  }

  .footer-remark.approved {
    color: #16a34a;
  }

  @media (max-width: 768px) {
    .modal-header {
      padding: 12px 16px;
    }
    .modal-body {
      padding: 12px 16px 16px;
    }
    .search-wrapper {
      width: 100%;
    }
  }
</style>
