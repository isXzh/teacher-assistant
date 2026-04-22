<template>
  <div class="interaction-panel">
    <top-nav title="计算机网络" :show-back="true" @back="handleBack">
      <template #right>
        <button class="end-class-button" @click="handleEndClass">下课</button>
      </template>
    </top-nav>

    <div class="main-content">
      <div class="sidebar">
        <div class="device-status-card">
          <div class="card-header">
            <h2 class="card-title">主讲教室保障箱</h2>
            <button class="refresh-button">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5c.0 1.5.6 3 2 1h6a2 2 0 012 0v5a2 2 0 01-2 0H6a2 2 0 01-2-2v-5m0 5h6a2 2 0 012 0v-5a2 2 0 01-2 0H6a2 2 0 01-2-2z"
                ></path>
              </svg>
            </button>
          </div>
          <div class="status-list">
            <div class="status-item">
              <span class="status-label">连接状态</span>
              <div class="status-value online">
                <div class="status-dot"></div>
                <span class="status-text">在线</span>
              </div>
            </div>
            <div class="status-item">
              <span class="status-label">网络质量</span>
              <div class="status-value online">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 12.55a11 11 0 0111.99 9.134A11 11 0 0112.55 12.55v0a11 11 0 01-1.99-9.134A11 11 0 015.45 12.55v0z"
                  ></path>
                </svg>
                <span class="status-text">优秀</span>
              </div>
            </div>
            <div class="status-item">
              <span class="status-label">音视频设备</span>
              <div class="status-value online">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 1a3 3 0 013 3v7a3 3 0 01-3 3V4a3 3 0 01-3-3z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 4v5a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2z"
                  ></path>
                </svg>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                </svg>
                <span class="status-text">正常</span>
              </div>
            </div>
          </div>
        </div>

        <div class="global-controls-card">
          <h2 class="card-title">全局互动控制</h2>
          <div class="control-buttons">
            <button class="control-button danger" @click="handleMuteAll">全员禁麦</button>
            <button class="control-button secondary" @click="handleEndAllInteractions">结束所有互动</button>
          </div>
        </div>

        <div class="hint-card">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.215V8.007c0-1.558-1.963-2.502-3.502-2.502H4.836c-1.54 0-2.502 1.667-2.502 3.215v4.586c0 1.538 1.963 2.502 3.502 2.502h4.14V12h-4.14z"
            ></path>
          </svg>
          <p>点击辅讲教室卡片的"开始互动"即可与该教室实时互动</p>
        </div>
      </div>

      <div class="content-area">
        <div class="classrooms-header">
          <h3 class="section-title">辅讲教室（远程互动）</h3>
          <div class="header-actions">
            <button class="simulate-button" @click="handleSimulateRaiseHand">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 11l5-5m0 0l5 5m-5-5v12m0 0l5 5m-5-5v12m0 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              模拟举手
            </button>
            <button class="refresh-button">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5c.0 1.5.6 3 2 1h6a2 2 0 012 0v5a2 2 0 01-2 0H6a2 2 0 01-2-2v-5m0 5h6a2 2 0 012 0v-5a2 2 0 01-2 0H6a2 2 0 01-2-2z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="classrooms.length === 0" class="empty-state">
          <p>暂无辅讲教室</p>
        </div>

        <div v-else class="classrooms-grid">
          <classroom-card
            v-for="classroom in classrooms"
            :key="classroom.id"
            :classroom="classroom"
            :is-offline="isClassroomOffline(classroom)"
            @toggle-mic="handleToggleMic"
            @toggle-interaction="handleToggleInteraction"
            @approve-interaction="handleApproveInteraction"
            @ignore-raise-hand="handleIgnoreRaiseHand"
          ></classroom-card>
        </div>
      </div>
    </div>

    <div v-if="showEndClassDialog" class="dialog-overlay">
      <div class="dialog-content">
        <h3 class="dialog-title">确认下课</h3>
        <p class="dialog-message">确认结束当前课程吗？所有互动将被终止。</p>
        <div class="dialog-actions">
          <button class="dialog-button secondary" @click="showEndClassDialog = false">取消</button>
          <button class="dialog-button danger" @click="confirmEndClass">确认下课</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TopNav from '@/components/layout/TopNav.vue';
  import ClassroomCard from '@/components/business/ClassroomCard.vue';

  export default {
    name: 'InteractionPanel',
    components: {
      TopNav,
      ClassroomCard,
    },
    data() {
      return {
        classrooms: [
          {
            id: 1,
            name: '辅讲教室A',
            teacher: '李老师',
            boxStatus: '在线',
            clientStatus: '已连接',
            micEnabled: true,
            isInteracting: false,
            isRaisingHand: true,
          },
          {
            id: 2,
            name: '辅讲教室B',
            teacher: '王老师',
            boxStatus: '使用中',
            clientStatus: '已连接',
            micEnabled: false,
            isInteracting: false,
            isRaisingHand: false,
          },
          {
            id: 3,
            name: '辅讲教室C',
            teacher: '赵老师',
            boxStatus: '在线',
            clientStatus: '已连接',
            micEnabled: true,
            isInteracting: false,
            isRaisingHand: false,
          },
          {
            id: 4,
            name: '辅讲教室D',
            teacher: '刘老师',
            boxStatus: '离线',
            clientStatus: '断开',
            micEnabled: false,
            isInteracting: false,
            isRaisingHand: false,
          },
        ],
        showEndClassDialog: false,
      };
    },
    methods: {
      handleBack() {
        this.$router.push('/main');
      },
      handleEndClass() {
        this.showEndClassDialog = true;
      },
      confirmEndClass() {
        this.$message.success('下课成功');
        this.showEndClassDialog = false;
        setTimeout(() => {
          this.$router.push('/main');
        }, 1000);
      },
      handleToggleMic(classroomId) {
        const classroom = this.classrooms.find(c => c.id === classroomId);
        if (this.isClassroomOffline(classroom)) {
          this.$message.error('设备离线，无法操作');
          return;
        }
        classroom.micEnabled = !classroom.micEnabled;
        this.$message.success(classroom.micEnabled ? '已开麦' : '已禁麦');
      },
      handleToggleInteraction(classroomId) {
        const classroom = this.classrooms.find(c => c.id === classroomId);
        if (this.isClassroomOffline(classroom)) {
          this.$message.error('设备离线，无法操作');
          return;
        }
        classroom.isInteracting = !classroom.isInteracting;
        classroom.isRaisingHand = false;
        this.$message.success(classroom.isInteracting ? '已开始互动' : '已结束互动');
      },
      handleApproveInteraction(classroomId) {
        const classroom = this.classrooms.find(c => c.id === classroomId);
        classroom.isInteracting = true;
        classroom.isRaisingHand = false;
        this.$message.success('已同意互动申请');
      },
      handleIgnoreRaiseHand(classroomId) {
        const classroom = this.classrooms.find(c => c.id === classroomId);
        classroom.isRaisingHand = false;
        this.$message.info('已忽略举手申请');
      },
      handleMuteAll() {
        this.classrooms.forEach(classroom => {
          if (!this.isClassroomOffline(classroom)) {
            classroom.micEnabled = false;
          }
        });
        this.$message.success('已全员禁麦');
      },
      handleEndAllInteractions() {
        this.classrooms.forEach(classroom => {
          classroom.isInteracting = false;
          classroom.isRaisingHand = false;
        });
        this.$message.success('已结束所有互动');
      },
      handleSimulateRaiseHand() {
        const availableClassrooms = this.classrooms.filter(
          c => !c.isRaisingHand && !c.isInteracting && c.boxStatus !== '离线'
        );
        if (availableClassrooms.length > 0) {
          const randomClassroom = availableClassrooms[Math.floor(Math.random() * availableClassrooms.length)];
          randomClassroom.isRaisingHand = true;
          this.$message.info(`${randomClassroom.name} 申请互动`);
        }
      },
      isClassroomOffline(classroom) {
        return classroom.boxStatus === '离线' || classroom.clientStatus === '断开';
      },
    },
  };
</script>

<style scoped>
  .end-class-button {
    border: 1px solid red;
    /* width: 50px; */
    border-radius: 6px;
    color: red;
    padding: 5px 15px;
    text-align: center;
  }
  .interaction-panel {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f7fa;
  }

  .main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .sidebar {
    width: 30%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
  }

  .device-status-card,
  .global-controls-card,
  .hint-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .card-title {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin: 0;
  }

  .refresh-button {
    color: #1e88e5;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s ease;
  }

  .refresh-button:hover {
    color: #1976d2;
  }

  .status-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  .status-label {
    color: #666;
  }

  .status-value {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .status-value.online .status-dot {
    background: #4caf50;
  }

  .status-value.online .status-text {
    color: #4caf50;
    font-weight: 500;
  }

  .control-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .control-button {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .control-button.danger {
    border: 2px solid #f44336;
    color: #f44336;
    background: white;
  }

  .control-button.danger:hover {
    background: #fef2f2;
  }

  .control-button.secondary {
    border: 1px solid #d1d5db;
    color: #666;
    background: white;
  }

  .control-button.secondary:hover {
    background: #f5f5f5;
  }

  .hint-card {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
  }

  .hint-card svg {
    color: #1d4ed8;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .hint-card p {
    font-size: 12px;
    color: #1e40af;
    margin: 0;
  }

  .content-area {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background-color: white;
  }

  .classrooms-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .simulate-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #ff9800;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .simulate-button:hover {
    background: #f57c00;
  }

  .empty-state {
    height: 384px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
  }

  .empty-state p {
    font-size: 18px;
    color: #999;
  }

  .classrooms-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog-content {
    background: white;
    border-radius: 16px;
    padding: 24px;
    width: 384px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .dialog-title {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px 0;
  }

  .dialog-message {
    font-size: 14px;
    color: #666;
    margin: 0 0 24px 0;
  }

  .dialog-actions {
    display: flex;
    gap: 12px;
  }

  .dialog-button {
    flex: 1;
    height: 44px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dialog-button.secondary {
    border: 1px solid #d1d5db;
    color: #666;
    background: white;
  }

  .dialog-button.secondary:hover {
    background: #f5f5f5;
  }

  .dialog-button.danger {
    background: #f44336;
    color: white;
  }

  .dialog-button.danger:hover {
    background: #dc2626;
  }
</style>
