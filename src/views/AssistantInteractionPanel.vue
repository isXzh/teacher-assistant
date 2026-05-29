<template>
  <div class="assistant-panel">
    <header class="panel-header">
      <button class="back-btn" @click="handleBack">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"></path>
        </svg>
        <span class="back-text">返回</span>
      </button>
      <div class="header-center">
        <span class="status-indicator" :class="courseStatus === '进行中' ? 'status-active' : 'status-inactive'">
          <span class="status-dot" :class="{ pulse: courseStatus === '进行中' }"></span>
          {{ courseStatus }}
        </span>
        <h1 class="course-title">{{ courseName }}</h1>
      </div>
    </header>

    <div class="panel-body">
      <aside class="sidebar">
        <div class="sidebar-inner">
          <div class="role-card">
            <div class="role-header">
              <span class="role-badge">辅讲</span>
              <span class="role-desc">{{ name }}</span>
            </div>
            <p class="role-tip">您正在以辅讲教师身份参与此课程</p>
          </div>

          <div class="info-section">
            <h2 class="section-title">{{ courseName }}</h2>
            <p>{{ courseDesc }}</p>
            <div class="detail-card">
              <h3 class="detail-title">课程详情</h3>
              <div class="detail-list">
                <div class="detail-item">
                  <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <div class="detail-content">
                    <span class="detail-label">主讲教师</span>
                    <span class="detail-value">{{ mainTeacher }}</span>
                  </div>
                </div>
                <div class="detail-item" v-if="subjectName">
                  <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <div class="detail-content">
                    <span class="detail-label">学科</span>
                    <span class="detail-value">{{ subjectName }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <div class="detail-content">
                    <span class="detail-label">时间</span>
                    <span class="detail-value">{{ courseTime }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <div class="detail-content">
                    <span class="detail-label">教室</span>
                    <span class="detail-value">{{ location }}</span>
                  </div>
                </div>
                <!-- <div class="detail-item" v-if="courseDesc">
                  <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <div class="detail-content">
                    <span class="detail-label">课程简介</span>
                    <span class="detail-value">{{ courseDesc }}</span>
                  </div>
                </div> -->
              </div>
            </div>

            <div class="device-card">
              <h3 class="detail-title">设备状态</h3>
              <div class="detail-list">
                <div class="detail-item">
                  <div class="detail-content-row">
                    <span class="device-label">
                      <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                      摄像头
                    </span>
                    <span class="device-status" :class="videoEnabled ? 'device-ok' : 'device-off'">
                      {{ videoEnabled ? '开启' : '关闭' }}
                    </span>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-content-row">
                    <span class="device-label">
                      <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </svg>
                      麦克风
                    </span>
                    <span class="device-status" :class="micEnabled ? 'device-ok' : 'device-off'">
                      {{ micEnabled ? '开启' : '关闭' }}
                    </span>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-content-row">
                    <span class="device-label">
                      <svg class="device-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                        <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                        <line x1="12" y1="20" x2="12.01" y2="20"></line>
                      </svg>
                      网络
                    </span>
                    <span class="device-status device-network">
                      <span class="signal-bars">
                        <span
                          v-for="i in 5"
                          :key="i"
                          class="signal-bar"
                          :class="{
                            active: i <= netRate,
                            [`level-${netRate}`]: i <= netRate,
                          }"
                          :style="{ height: `${6 + (i - 1) * 4}px` }"
                        ></span>
                      </span>
                      <span :class="netRateClass">{{ netRateText }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="main-area">
        <div class="main-inner">
          <div class="video-area">
            <div class="video-gradient"></div>
            <div v-if="!isJoined" class="video-placeholder">
              <svg class="video-off-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <p class="video-placeholder-text">尚未加入课堂</p>
              <button class="join-btn" @click="handleJoinClass">
                <svg class="join-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                加入课堂
              </button>
            </div>
            <div v-else class="video-live">
              <div class="live-avatar">
                <svg class="avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <p class="live-text">正在观看直播...</p>
              <p class="live-teacher">主讲教师：{{ mainTeacher }}</p>
            </div>
          </div>

          <div v-if="isJoined" class="controls-area">
            <button class="control-btn" :class="micEnabled ? 'control-mic-on' : 'control-mic-off'">
              <svg
                v-if="micEnabled"
                class="control-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
              <svg v-else class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.36 2.18"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>

            <button
              class="control-btn"
              :class="isRaisingHand ? 'control-hand-active' : 'control-hand'"
              @click="handleRaiseHand"
            >
              <svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v0"></path>
                <path d="M14 6V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"></path>
                <path d="M10 6.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"></path>
                <path
                  d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"
                ></path>
              </svg>
            </button>
          </div>

          <div class="status-info">
            <p class="mic-status">
              麦克风：<span :class="micEnabled ? 'text-green' : 'text-red'">{{
                micEnabled ? '已开启' : '已关闭'
              }}</span>
            </p>
            <p v-if="isRaisingHand" class="hand-status">已举手，等待主讲教师邀请发言...</p>
          </div>
        </div>
      </main>
    </div>

    <div class="mobile-controls">
      <button
        class="mobile-btn"
        :class="!isJoined ? 'mobile-disabled' : micEnabled ? 'control-mic-on' : 'control-mic-off'"
        :disabled="!isJoined"
      >
        <svg
          v-if="micEnabled"
          class="mobile-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
        <svg v-else class="mobile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.36 2.18"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </button>

      <button
        class="mobile-btn"
        :class="!isJoined ? 'mobile-disabled' : isRaisingHand ? 'control-hand-active' : 'control-hand'"
        :disabled="!isJoined"
        @click="handleRaiseHand"
      >
        <svg class="mobile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v0"></path>
          <path d="M14 6V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"></path>
          <path d="M10 6.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"></path>
          <path
            d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"
          ></path>
        </svg>
      </button>

      <button v-if="!isJoined" class="mobile-join-btn" @click="handleJoinClass">加入课堂</button>
    </div>

    <div v-if="showLeaveDialog" class="dialog-overlay">
      <div class="dialog-content">
        <h3 class="dialog-title">确认退出</h3>
        <p class="dialog-message">确认退出当前辅讲课堂吗？</p>
        <div class="dialog-actions">
          <button class="dialog-btn btn-cancel" @click="showLeaveDialog = false">取消</button>
          <button class="dialog-btn btn-confirm" @click="confirmLeaveClass">确认退出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import homeApi from '@/api/home';
  import meetingControlApi from '@/api/meetingControl';

  export default {
    name: 'AssistantInteractionPanel',
    data() {
      return {
        scheduleId: null,
        courseName: '',
        mainTeacher: '',
        subjectName: '',
        courseDesc: '',
        courseTime: '',
        classroom: '',
        name: '',
        location: '',
        courseStatus: '进行中',
        micEnabled: false,
        videoEnabled: false,
        isRaisingHand: false,
        isJoined: true,
        showLeaveDialog: false,
        isComponentDestroyed: false,
        participantId: null,
        netRate: 0,
        controlInfoTimer: null,
      };
    },
    computed: {
      netRateText() {
        const map = { 0: '未知', 1: '极差', 2: '较差', 3: '一般', 4: '良好', 5: '优秀' };
        return map[this.netRate] || '未知';
      },
      netRateClass() {
        const map = { 0: 'offline', 1: 'level-1', 2: 'level-2', 3: 'level-3', 4: 'online', 5: 'online' };
        return map[this.netRate] || 'offline';
      },
    },
    created() {
      this.scheduleId = this.$route.params.courseId;
      this.courseName = this.$route.query.courseName || '辅讲课堂';
      this.mainTeacher = this.$route.query.teacher || '';
      this.subjectName = this.$route.query.subjectName || '';
      this.courseDesc = this.$route.query.courseDesc || '';
      this.courseTime = this.$route.query.time || '';
      this.classroom = this.$route.query.classroom || '';
      this.location = this.$route.query.location || '';
      this.startControlInfoPolling();
    },
    beforeDestroy() {
      this.isComponentDestroyed = true;
      this.stopControlInfoPolling();
    },
    methods: {
      startControlInfoPolling() {
        this.fetchControlInfo();
        this.controlInfoTimer = setInterval(() => {
          this.fetchControlInfo();
        }, 1000);
      },
      stopControlInfoPolling() {
        if (this.controlInfoTimer) {
          clearInterval(this.controlInfoTimer);
          this.controlInfoTimer = null;
        }
      },
      async fetchControlInfo() {
        if (this.isComponentDestroyed) return;
        try {
          const response = await meetingControlApi.controlInfo(this.scheduleId, { teachType: 2 });
          if (this.isComponentDestroyed) return;
          if (response.code === 200 && response.data) {
            const { currentTerminal } = response.data;
            this.netRate = parseInt(currentTerminal.netRate) || 0;
            this.videoEnabled = currentTerminal.video === 1;
            this.micEnabled = currentTerminal.mute === 0;
            this.isRaisingHand = currentTerminal.hand === 1;
            this.participantId = currentTerminal.pid;
            this.name = currentTerminal.name;
            if (currentTerminal.inMeeting !== undefined) {
              this.isJoined = currentTerminal.inMeeting;
            }
          }
        } catch (error) {
          console.error('获取会控信息失败:', error);
        }
      },
      handleBack() {
        this.$router.push('/main');
      },
      handleLeaveClass() {
        this.showLeaveDialog = true;
      },
      async confirmLeaveClass() {
        try {
          if (this.isRaisingHand && this.participantId) {
            await meetingControlApi.setHandRaise(this.scheduleId, this.participantId, { handsState: 0 });
          }
          const response = await homeApi.exitClassroom(this.scheduleId);
          if (response.code === 200 && response.data) {
            this.$message.success('已退出课堂');
            this.showLeaveDialog = false;
            setTimeout(() => {
              this.$router.push('/main');
            }, 500);
          } else {
            this.$message.error(response.message || '退出失败');
          }
        } catch (error) {
          console.error('退出课堂失败:', error);
          this.$message.error('退出课堂失败');
        }
      },
      async handleJoinClass() {
        let params = {
          teachType: 2,
        };
        const res = await meetingControlApi.invitePersonal(this.scheduleId, params);
        if (res.code == 200) {
          // this.$message.success('已成功加入课堂');
          // this.isJoined = true;
        }
      },
      async handleToggleMic() {
        if (!this.isJoined || !this.participantId) {
          this.$message.warning('未找到与会人ID，无法操作');
          return;
        }
        try {
          const isMute = this.micEnabled ? 1 : 0;
          const response = await meetingControlApi.muteParticipant(this.scheduleId, this.participantId, { isMute });
          if (response.success && response.data) {
            this.micEnabled = !this.micEnabled;
            this.$message.success(this.micEnabled ? '已开麦' : '已禁麦');
          } else {
            this.$message.error(response.message || '操作失败');
          }
        } catch (error) {
          console.error('禁麦/开麦操作失败:', error);
          this.$message.error('操作失败');
        }
      },
      async handleRaiseHand() {
        if (!this.isJoined || !this.participantId) {
          this.$message.warning('未找到与会人ID，无法操作');
          return;
        }
        try {
          const handsState = this.isRaisingHand ? 0 : 1;
          const response = await meetingControlApi.setHandRaise(this.scheduleId, this.participantId, { handsState });
          if (response.success && response.data) {
            this.isRaisingHand = !this.isRaisingHand;
            this.$message.success(this.isRaisingHand ? '已举手，等待主讲教师响应...' : '已取消举手');
          } else {
            this.$message.error(response.message || '操作失败');
          }
        } catch (error) {
          console.error('举手操作失败:', error);
          this.$message.error('操作失败');
        }
      },
    },
  };
</script>

<style scoped>
  .assistant-panel {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f7fa;
  }

  .panel-header {
    height: 56px;
    background: white;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
    background: transparent;
    border: none;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    color: #333;
    background: #f5f5f5;
  }

  .back-btn .icon {
    width: 20px;
    height: 20px;
  }

  .header-center {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: center;
    overflow: hidden;
  }

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .status-indicator.status-active {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .status-indicator.status-inactive {
    background: #f5f5f5;
    color: #757575;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4caf50;
  }

  .status-dot.pulse {
    animation: pulse 1.5s ease-in-out infinite;
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

  .status-indicator.status-inactive .status-dot {
    background: #9e9e9e;
  }

  .course-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
  }

  .exit-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .exit-btn:hover {
    background: #e53935;
  }

  .exit-btn .icon {
    width: 16px;
    height: 16px;
  }

  .exit-text {
    display: inline;
  }

  .panel-body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .sidebar {
    width: 320px;
    background: white;
    border-right: 1px solid #e8e8e8;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .sidebar-inner {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .role-card {
    background: #fff3e0;
    border: 1px solid #ffe0b2;
    border-radius: 12px;
    padding: 16px;
  }

  .role-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .role-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 12px;
    background: #ffe0b2;
    color: #e65100;
  }

  .role-desc {
    font-size: 13px;
    color: #e65100;
  }

  .role-tip {
    font-size: 12px;
    color: #fb8c00;
    margin: 0;
  }

  .info-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 0;
    line-height: 1.4;
  }

  .detail-card {
    background: #f5f7fa;
    border-radius: 12px;
    padding: 16px;
  }

  .detail-title {
    font-size: 14px;
    font-weight: 700;
    color: #333;
    margin: 0 0 12px 0;
  }

  .detail-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .detail-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
  }

  .detail-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .detail-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .detail-label {
    color: #999;
    font-size: 12px;
  }

  .detail-value {
    color: #333;
    font-weight: 500;
  }

  .detail-content-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .device-label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
    font-size: 14px;
  }

  .device-icon {
    width: 16px;
    height: 16px;
  }

  .device-status {
    font-weight: 500;
    font-size: 13px;
  }

  .device-ok {
    color: #4caf50;
  }

  .device-off {
    color: #f44336;
  }

  .device-network {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    font-size: 13px;
  }

  .signal-bars {
    display: inline-flex;
    align-items: flex-end;
    gap: 2px;
    height: 22px;
  }

  .signal-bar {
    width: 4px;
    border-radius: 1px;
    background: #e0e0e0;
    transition: background 0.3s ease;
  }

  .signal-bar.active.level-1 {
    background: #f44336;
  }

  .signal-bar.active.level-2 {
    background: #ff9800;
  }

  .signal-bar.active.level-3 {
    background: #ffc107;
  }

  .signal-bar.active.level-4 {
    background: #8bc34a;
  }

  .signal-bar.active.level-5 {
    background: #4caf50;
  }

  .offline {
    color: #999;
    font-weight: 500;
  }

  .level-1 {
    color: #f44336;
    font-weight: 500;
  }

  .level-2 {
    color: #ff9800;
    font-weight: 500;
  }

  .level-3 {
    color: #ffc107;
    font-weight: 500;
  }

  .online {
    color: #4caf50;
    font-weight: 500;
  }

  .device-card {
    background: #e8f5e9;
    border: 1px solid #c8e6c9;
    border-radius: 12px;
    padding: 16px;
  }

  .main-area {
    flex: 1;
    display: none;
    overflow: hidden;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8eef4 100%);
  }

  .main-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
  }

  .video-area {
    width: 100%;
    max-width: 640px;
    aspect-ratio: 16 / 9;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .video-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(30, 136, 229, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%);
  }

  .video-placeholder {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
  }

  .video-off-icon {
    width: 64px;
    height: 64px;
    color: rgba(255, 255, 255, 0.3);
  }

  .video-placeholder-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    margin: 0;
  }

  .join-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background: #1e88e5;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
    transition: background 0.2s ease;
  }

  .join-btn:hover {
    background: #1976d2;
  }

  .join-icon {
    width: 20px;
    height: 20px;
  }

  .video-live {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 12px;
  }

  .live-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e88e5, #1565c0);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(30, 136, 229, 0.3);
  }

  .avatar-icon {
    width: 40px;
    height: 40px;
    color: white;
  }

  .live-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .live-teacher {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    margin: 0;
  }

  .controls-area {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .control-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .control-btn:active {
    transform: scale(0.95);
  }

  .control-icon {
    width: 28px;
    height: 28px;
  }

  .control-mic-on {
    background: #4caf50;
    color: white;
  }

  .control-mic-on:hover {
    background: #43a047;
  }

  .control-mic-off {
    background: #f44336;
    color: white;
  }

  .control-mic-off:hover {
    background: #e53935;
  }

  .control-hand {
    background: white;
    color: #666;
    border: 2px solid #e0e0e0;
  }

  .control-hand:hover {
    background: #f5f5f5;
  }

  .control-hand-active {
    background: #ff9800;
    color: white;
    animation: handPulse 1.5s ease-in-out infinite;
  }

  .control-hand-active:hover {
    background: #fb8c00;
  }

  @keyframes handPulse {
    0%,
    100% {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    50% {
      box-shadow: 0 4px 20px rgba(255, 152, 0, 0.4);
    }
  }

  .status-info {
    margin-top: 20px;
    text-align: center;
  }

  .mic-status {
    font-size: 14px;
    color: #999;
    margin: 0 0 4px 0;
  }

  .text-green {
    color: #4caf50;
    font-weight: 500;
  }

  .text-red {
    color: #f44336;
    font-weight: 500;
  }

  .hand-status {
    font-size: 14px;
    color: #ff9800;
    font-weight: 500;
    animation: handPulse 1.5s ease-in-out infinite;
    margin: 0;
  }

  .mobile-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 16px;
    background: white;
    border-top: 1px solid #e8e8e8;
  }

  .mobile-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .mobile-btn:active {
    transform: scale(0.95);
  }

  .mobile-icon {
    width: 24px;
    height: 24px;
  }

  .mobile-disabled {
    background: #e0e0e0;
    color: #bdbdbd;
    cursor: not-allowed;
    box-shadow: none;
  }

  .mobile-join-btn {
    margin-top: 12px;
    width: 100%;
    padding: 14px;
    background: #1e88e5;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .mobile-join-btn:hover {
    background: #1976d2;
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
    width: 360px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .dialog-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px 0;
  }

  .dialog-message {
    font-size: 14px;
    color: #666;
    margin: 0 0 20px 0;
  }

  .dialog-actions {
    display: flex;
    gap: 12px;
  }

  .dialog-btn {
    flex: 1;
    height: 44px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-cancel {
    border: 1px solid #e0e0e0;
    color: #666;
    background: white;
  }

  .btn-cancel:hover {
    background: #f5f5f5;
  }

  .btn-confirm {
    background: #f44336;
    color: white;
  }

  .btn-confirm:hover {
    background: #e53935;
  }

  @media (min-width: 768px) {
    .mobile-controls {
      display: none;
    }

    .main-area {
      display: flex;
    }
  }

  @media (max-width: 767px) {
    .back-text {
      display: none;
    }

    .exit-text {
      display: none;
    }

    .sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #e8e8e8;
    }

    .course-title {
      max-width: 160px;
      font-size: 14px;
    }
  }
</style>
