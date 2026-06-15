<template>
  <div class="interaction-panel">
    <top-nav title="计算机网络" :show-back="true" @back="handleBack">
      <template #right>
        <button class="end-class-button" @click="handleEndClass">下课</button>
      </template>
    </top-nav>

    <div class="main-content">
      <div class="sidebar">
        <!-- <button class="landscape-button" :class="{ active: isLandscape }" @click="handleToggleLandscape">
          <span>{{ isLandscape ? '竖屏' : '横屏' }}</span>
        </button> -->
        <div class="device-status-card">
          <div class="card-header">
            <h2 class="card-title">{{ mainClassroomName || '主讲教室保障箱' }}</h2>
            <button class="refresh-button" @click="fetchControlInfo">
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
            <!-- <div class="status-item">
              <span class="status-label">实时连接</span>
              <div :class="['status-value', sseConnected ? 'online' : 'offline']">
                <div class="status-dot"></div>
                <span class="status-text">{{ sseConnected ? '正常' : '断开' }}</span>
              </div>
            </div> -->
            <div class="status-item">
              <span class="status-label">网络质量</span>
              <div class="status-value">
                <div class="signal-bars">
                  <div
                    v-for="i in 5"
                    :key="i"
                    class="signal-bar"
                    :class="{
                      active: i <= netRate,
                      [`level-${netRate}`]: i <= netRate,
                    }"
                    :style="{ height: `${6 + (i - 1) * 4}px` }"
                  ></div>
                </div>
                <span class="status-text" :class="netRateClass">{{ netRateText }}</span>
              </div>
            </div>
            <div class="status-item">
              <span class="status-label">摄像头</span>
              <div :class="['status-value', videoEnabled ? 'online' : 'offline']">
                <div class="status-dot"></div>
                <span class="status-text">{{ videoEnabled ? '开启' : '关闭' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="global-controls-card">
          <h2 class="card-title">全局互动控制</h2>
          <div class="control-icons">
            <div class="control-icon-item" @click="handleMuteAll">
              <div class="icon-circle danger">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <span class="icon-label">全员禁麦</span>
            </div>
            <div class="control-icon-item" @click="handleEndAllInteractions">
              <div class="icon-circle secondary">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <span class="icon-label">结束所有互动</span>
            </div>
            <div class="control-icon-item" @click="handleInviteAbsentees">
              <div class="icon-circle yaoqing">
                <img :src="yaoqing2" alt="" />
              </div>
              <span class="icon-label">邀请入会</span>
            </div>
            <div class="control-icon-item" @click="playShareAndVideo">
              <div class="icon-circle yaoqing">
                <img :src="yaoqing2" alt="" />
              </div>
              <span class="icon-label">共享画面</span>
            </div>
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
          <!-- <div class="header-actions">
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
          </div> -->
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
  import homeApi from '@/api/home';
  import meetingControlApi from '@/api/meetingControl';
  import yaoqing2 from '@/assets/images/yaoqing2.png';
  export default {
    name: 'InteractionPanel',
    components: {
      TopNav,
      ClassroomCard,
    },
    data() {
      return {
        yaoqing2,
        classrooms: [],
        showEndClassDialog: false,
        scheduleId: null,
        mainClassroomPhone: null,
        mainClassroomName: null,
        subscriberInPics: [],
        isLandscape: false,
        netRate: 0,
        videoEnabled: false,
        isComponentDestroyed: false,
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
    async created() {
      this.scheduleId = this.$route.params.courseId;
      await this.fetchMainClassroomPhone();
      this.startControlInfoPolling();
      const savedSubscriberInPics = sessionStorage.getItem('subscriberInPics');
      if (savedSubscriberInPics) {
        try {
          this.subscriberInPics = JSON.parse(savedSubscriberInPics);
        } catch (error) {
          console.error('恢复subscriberInPics失败:', error);
        }
      }
    },
    beforeDestroy() {
      this.isComponentDestroyed = true;
      this.stopControlInfoPolling();
      if (this.subscriberInPics && this.subscriberInPics.length > 0) {
        sessionStorage.setItem('subscriberInPics', JSON.stringify(this.subscriberInPics));
      }
      if (this.isLandscape) {
        this.exitLandscapeMode();
      }
    },
    methods: {
      async handleInviteAbsentees() {
        const res = await meetingControlApi.inviteAbsentees(this.scheduleId);
      },
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
      // 播放主讲共享和视频画面
      async playShareAndVideo() {
        const res = await meetingControlApi.playShareAndVideo(this.scheduleId, {
          phone: this.mainClassroomPhone,
          name: this.mainClassroomName,
        });
        if (res.code == 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message || '播放失败');
        }
      },
      async fetchControlInfo() {
        if (this.isComponentDestroyed) return;
        try {
          const response = await meetingControlApi.controlInfo(this.scheduleId, { teachType: 1 });
          if (this.isComponentDestroyed) return;
          if (response.code === 200 && response.data) {
            const { currentTerminal, attendees, interactingPhones } = response.data;
            this.netRate = parseInt(currentTerminal.netRate) || 0;
            this.videoEnabled = currentTerminal.video === 1;
            if (currentTerminal.name) {
              this.mainClassroomName = currentTerminal.name;
            }
            if (currentTerminal.phone) {
              this.mainClassroomPhone = currentTerminal.phone;
            }
            if (attendees && Array.isArray(attendees)) {
              const mainPhone = currentTerminal.phone;
              const interactingPhoneList = Array.isArray(interactingPhones) ? interactingPhones : [];
              const assistantAttendees = attendees.filter(a => a.phone !== mainPhone);
              this.classrooms = assistantAttendees.map((attendee, index) => {
                return {
                  id: index + 1,
                  name: attendee.name,
                  teacher: attendee.name,
                  boxStatus: attendee.inMeeting ? '在线' : '离线',
                  clientStatus: attendee.inMeeting ? '已连接' : '断开',
                  micEnabled: attendee.mute === 0,
                  isInteracting: interactingPhoneList.includes(attendee.phone),
                  isRaisingHand: attendee.hand === 1,
                  phone: attendee.phone,
                  pid: attendee.pid,
                  mute: attendee.mute,
                  hand: attendee.hand,
                };
              });
            }
          }
        } catch (error) {
          console.error('获取会控信息失败:', error);
        }
      },
      async fetchMainClassroomPhone() {
        try {
          const response = await homeApi.getTodayCoures();
          if (response.code === 200 && response.data) {
            const todayCourses = response.data;
            const currentCourse = todayCourses.find(course => course.id === parseInt(this.scheduleId));
            if (currentCourse) {
              this.mainClassroomPhone = currentCourse.phone;
            }
          }
        } catch (error) {
          console.error('获取今日课程失败:', error);
        }
      },
      getImageType(count) {
        const imageTypes = {
          1: 'Single',
          2: 'Two',
          3: 'Three',
          4: 'Four',
          5: 'Five',
          6: 'Six',
          7: 'Seven',
          8: 'Eight',
          9: 'Nine',
        };
        return imageTypes[count] || 'Single';
      },
      handleBack() {
        this.$router.push('/main');
      },
      handleEndClass() {
        this.showEndClassDialog = true;
      },
      async confirmEndClass() {
        try {
          const response = await homeApi.exitClassroom(this.scheduleId);
          if (response.code === 200 && response.data) {
            this.subscriberInPics = [];
            sessionStorage.removeItem('subscriberInPics');
            this.$message.success('下课成功');
            this.showEndClassDialog = false;
            setTimeout(() => {
              this.$router.push('/main');
            }, 1000);
          } else {
            this.$message.error(response.message || '下课失败');
          }
        } catch (error) {
          console.error('下课操作失败:', error);
          this.$message.error('下课操作失败');
        }
      },
      async handleToggleMic(classroomId) {
        const classroom = this.classrooms.find(c => c.id === classroomId);
        if (this.isClassroomOffline(classroom)) {
          this.$message.error('设备离线，无法操作');
          return;
        }
        if (!classroom.pid) {
          this.$message.error('未找到与会人ID，无法操作');
          return;
        }
        try {
          const isMute = classroom.micEnabled ? 1 : 0;
          const response = await meetingControlApi.muteParticipant(this.scheduleId, classroom.pid, { isMute });
          if (response.success && response.data) {
            this.$set(classroom, 'micEnabled', !classroom.micEnabled);
            this.$set(classroom, 'mute', isMute);
            this.$message.success(classroom.micEnabled ? '已开麦' : '已禁麦');
          } else {
            this.$message.error(response.message || '操作失败');
          }
        } catch (error) {
          console.error('禁麦/开麦操作失败:', error);
          this.$message.error('操作失败');
        }
      },
      async handleToggleInteraction(classroomId) {
        const classroom = this.classrooms.find(c => c.id === classroomId);
        if (!classroom) {
          this.$message.error('未找到教室信息');
          return;
        }

        if (this.isClassroomOffline(classroom)) {
          this.$message.error('设备离线，无法操作');
          return;
        }

        if (classroom.isInteracting) {
          await this.handleEndInteraction(classroom);
        } else {
          await this.handleStartInteraction(classroom);
        }
      },
      async executeInteraction(classroom, actionType = 'start') {
        if (!classroom.pid) {
          this.$message.error('未找到与会人ID，无法操作');
          return false;
        }

        try {
          const { scheduleId, subscriberInPics, mainClassroomPhone } = this;

          if (classroom.isRaisingHand) {
            const setHandRaiseResponse = await meetingControlApi.setHandRaise(scheduleId, classroom.pid, {
              handsState: 0,
            });

            if (!setHandRaiseResponse.success || !setHandRaiseResponse.data) {
              throw new Error(setHandRaiseResponse.message || '设置举手状态失败');
            }
          }

          let newSubscriberInPics;
          if (subscriberInPics.length === 0) {
            newSubscriberInPics = [
              {
                index: 1,
                subscriber: [mainClassroomPhone],
                isAssistStream: 0,
              },
            ];

            newSubscriberInPics.push({
              index: 2,
              subscriber: [classroom.phone],
              isAssistStream: 0,
            });
          } else {
            newSubscriberInPics = [
              {
                index: 1,
                subscriber: [mainClassroomPhone],
                isAssistStream: 0,
              },
            ];

            let currentIndex = 2;
            subscriberInPics.forEach(item => {
              const phone = item.subscriber[0];
              if (phone !== mainClassroomPhone) {
                newSubscriberInPics.push({
                  index: currentIndex,
                  subscriber: [phone],
                  isAssistStream: 0,
                });
                currentIndex++;
              }
            });

            newSubscriberInPics.push({
              index: currentIndex,
              subscriber: [classroom.phone],
              isAssistStream: 0,
            });
          }

          const setCustomPictureResponse = await meetingControlApi.setCustomPicture(scheduleId, {
            manualSet: 1,
            multiPicSaveOnly: false,
            imageType: this.getImageType(newSubscriberInPics.length),
            subscriberInPics: newSubscriberInPics,
          });

          if (!setCustomPictureResponse.success || !setCustomPictureResponse.data) {
            throw new Error(setCustomPictureResponse.message || '设置自定义画面失败');
          }

          const muteParticipantResponse = await meetingControlApi.muteParticipant(scheduleId, classroom.pid, {
            isMute: 0,
          });

          if (!muteParticipantResponse.success || !muteParticipantResponse.data) {
            throw new Error(muteParticipantResponse.message || '禁麦操作失败');
          }

          this.subscriberInPics = newSubscriberInPics;
          this.$set(classroom, 'isInteracting', true);
          this.$set(classroom, 'isRaisingHand', false);
          this.$set(classroom, 'micEnabled', true);
          this.$set(classroom, 'mute', 0);

          return true;
        } catch (error) {
          console.error(`${actionType === 'start' ? '开始互动' : '同意互动'}失败:`, error);
          this.$message.error(error.message || `${actionType === 'start' ? '开始互动' : '同意互动'}失败`);
          return false;
        }
      },

      async handleStartInteraction(classroom) {
        if (this.isClassroomOffline(classroom)) {
          this.$message.error('设备离线，无法操作');
          return;
        }

        const success = await this.executeInteraction(classroom, 'start');
        if (success) {
          this.$message.success('已开始互动');
        }
      },
      async handleEndInteraction(classroom) {
        if (!classroom.pid) {
          this.$message.error('未找到与会人ID，无法操作');
          return;
        }

        const interactingClassrooms = this.classrooms.filter(c => c.isInteracting);
        const isOnlyInteracting = interactingClassrooms.length === 1 && interactingClassrooms[0].id === classroom.id;

        if (isOnlyInteracting) {
          try {
            const { scheduleId, mainClassroomPhone } = this;

            const response = await meetingControlApi.endAllInteractions(scheduleId);

            if (response.success && response.data) {
              this.subscriberInPics = [
                {
                  index: 1,
                  subscriber: [mainClassroomPhone],
                  isAssistStream: 0,
                },
              ];
              this.classrooms.forEach(c => {
                this.$set(c, 'isInteracting', false);
                this.$set(c, 'isRaisingHand', false);
              });
              this.$set(classroom, 'micEnabled', false);
              this.$set(classroom, 'mute', 1);
              this.$message.success('已结束互动');
            } else {
              throw new Error(response.message || '结束互动失败');
            }
          } catch (error) {
            console.error('结束互动失败:', error);
            this.$message.error(error.message || '结束互动失败');
          }
          return;
        }

        try {
          const { scheduleId, subscriberInPics, mainClassroomPhone } = this;

          const updatedSubscriberInPics = subscriberInPics.filter(item => item.subscriber[0] !== classroom.phone);

          let newSubscriberInPics;
          if (subscriberInPics.length === 0) {
            newSubscriberInPics = [
              {
                index: 1,
                subscriber: [mainClassroomPhone],
                isAssistStream: 0,
              },
            ];
          } else {
            newSubscriberInPics = [
              {
                index: 1,
                subscriber: [mainClassroomPhone],
                isAssistStream: 0,
              },
            ];

            let currentIndex = 2;
            updatedSubscriberInPics.forEach(item => {
              const phone = item.subscriber[0];
              if (phone !== mainClassroomPhone) {
                newSubscriberInPics.push({
                  index: currentIndex,
                  subscriber: [phone],
                  isAssistStream: 0,
                });
                currentIndex++;
              }
            });
          }

          const setCustomPictureResponse = await meetingControlApi.setCustomPicture(scheduleId, {
            manualSet: 1,
            multiPicSaveOnly: false,
            imageType: this.getImageType(newSubscriberInPics.length),
            subscriberInPics: newSubscriberInPics,
          });

          if (!setCustomPictureResponse.success || !setCustomPictureResponse.data) {
            throw new Error(setCustomPictureResponse.message || '设置自定义画面失败');
          }

          const muteParticipantResponse = await meetingControlApi.muteParticipant(scheduleId, classroom.pid, {
            isMute: 1,
          });

          if (!muteParticipantResponse.success || !muteParticipantResponse.data) {
            throw new Error(muteParticipantResponse.message || '禁麦操作失败');
          }

          this.subscriberInPics = newSubscriberInPics;
          this.$set(classroom, 'isInteracting', false);
          this.$set(classroom, 'isRaisingHand', false);
          this.$set(classroom, 'micEnabled', false);
          this.$set(classroom, 'mute', 1);

          this.$message.success('已结束互动');
        } catch (error) {
          console.error('结束互动失败:', error);
          this.$message.error(error.message || '结束互动失败');
        }
      },
      async handleApproveInteraction(classroomId) {
        const classroom = this.classrooms.find(c => c.id === classroomId);
        if (!classroom) {
          this.$message.error('未找到教室信息');
          return;
        }

        if (this.isClassroomOffline(classroom)) {
          this.$message.error('设备离线，无法操作');
          return;
        }

        const success = await this.executeInteraction(classroom, 'approve');
        if (success) {
          this.$message.success('已同意互动申请');
        }
      },
      async handleIgnoreRaiseHand(classroomId) {
        const classroom = this.classrooms.find(c => c.id === classroomId);
        if (!classroom) {
          this.$message.error('未找到教室信息');
          return;
        }

        if (this.isClassroomOffline(classroom)) {
          this.$message.error('设备离线，无法操作');
          return;
        }

        if (!classroom.pid) {
          this.$message.error('未找到与会人ID，无法操作');
          return;
        }

        try {
          const response = await meetingControlApi.setHandRaise(this.scheduleId, classroom.pid, { handsState: 0 });

          if (response.success && response.data) {
            this.$set(classroom, 'isRaisingHand', false);
            this.$message.info('已忽略举手申请');
          } else {
            throw new Error(response.message || '操作失败');
          }
        } catch (error) {
          console.error('忽略举手失败:', error);
          this.$message.error(error.message || '忽略举手失败');
        }
      },
      async handleMuteAll() {
        try {
          const response = await meetingControlApi.muteAll(this.scheduleId, {
            allowUnmuteByOneself: 0,
            isMute: 1,
          });
          if (response.success && response.data) {
            this.classrooms.forEach(classroom => {
              if (!this.isClassroomOffline(classroom)) {
                this.$set(classroom, 'micEnabled', false);
                this.$set(classroom, 'mute', 1);
              }
            });
            this.$message.success('已全员禁麦');
          } else {
            this.$message.error(response.message || '全员禁麦失败');
          }
        } catch (error) {
          console.error('全员禁麦失败:', error);
          this.$message.error('全员禁麦失败');
        }
      },
      async handleEndAllInteractions() {
        // if (this.subscriberInPics.length === 0) {
        //   return;
        // }

        try {
          const { scheduleId, mainClassroomPhone } = this;

          const response = await meetingControlApi.endAllInteractions(scheduleId);

          if (response.success && response.data) {
            this.subscriberInPics = [
              {
                index: 1,
                subscriber: [mainClassroomPhone],
                isAssistStream: 0,
              },
            ];
            this.classrooms.forEach(classroom => {
              this.$set(classroom, 'isInteracting', false);
              this.$set(classroom, 'isRaisingHand', false);
            });
            this.$message.success('已结束所有互动');
          } else {
            throw new Error(response.message || '结束所有互动失败');
          }
        } catch (error) {
          console.error('结束所有互动失败:', error);
          this.$message.error(error.message || '结束所有互动失败');
        }
      },
      handleSimulateRaiseHand() {
        const availableClassrooms = this.classrooms.filter(
          c => !c.isRaisingHand && !c.isInteracting && c.boxStatus !== '离线'
        );
        if (availableClassrooms.length > 0) {
          const randomClassroom = availableClassrooms[Math.floor(Math.random() * availableClassrooms.length)];
          this.$set(randomClassroom, 'isRaisingHand', true);
          this.$message.info(`${randomClassroom.name} 申请互动`);
        }
      },
      isClassroomOffline(classroom) {
        return classroom.boxStatus === '离线' || classroom.clientStatus === '断开';
      },
      handleToggleLandscape() {
        this.isLandscape = !this.isLandscape;

        if (this.isLandscape) {
          this.enterLandscapeMode();
        } else {
          this.exitLandscapeMode();
        }
      },
      async enterLandscapeMode() {
        try {
          if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape');
          }

          document.body.classList.add('landscape-mode');
          this.$message.success('已切换至横屏模式');
        } catch (error) {
          console.error('横屏切换失败:', error);

          if (error.name === 'NotSupportedError') {
            this.$message.warning('请允许全屏权限以使用横屏模式');
          } else {
            this.$message.warning('横屏切换失败，请手动旋转设备');
          }
        }
      },
      async exitLandscapeMode() {
        try {
          if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
          }

          document.body.classList.remove('landscape-mode');
          this.$message.success('已切换至竖屏模式');
        } catch (error) {
          console.error('竖屏切换失败:', error);
          document.body.classList.remove('landscape-mode');
          this.$message.success('已切换至竖屏模式');
        }
      },
    },
  };
</script>

<style scoped>
  .end-class-button {
    border: 1px solid white;
    /* border: 1px solid #F44336; */
    border-radius: 6px;
    color: #fff;
    /* color: #F44336; */
    /* background: white; */
    padding: 6px 16px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .end-class-button:hover {
    background: #f44336;
    color: white;
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
    /* width: 320px; */
    width: 240px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    background: #f5f7fa;
  }

  .device-status-card,
  .global-controls-card,
  .hint-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .refresh-button {
    color: #2979ff;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s ease;
  }

  .refresh-button:hover {
    color: #1e88e5;
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

  .status-value.offline .status-dot {
    background: #f44336;
  }

  .status-value.offline .status-text {
    color: #f44336;
    font-weight: 500;
  }

  .signal-bars {
    display: flex;
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

  .status-text.level-1 {
    color: #f44336;
    font-weight: 500;
  }

  .status-text.level-2 {
    color: #ff9800;
    font-weight: 500;
  }

  .status-text.level-3 {
    color: #ffc107;
    font-weight: 500;
  }

  .control-icons {
    display: flex;
    flex-direction: row;
    /* justify-content: space-between; */
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 32px;
    padding: 16px 0;
  }

  .control-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .control-icon-item:hover {
    transform: translateY(-2px);
  }

  .icon-circle {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .icon-circle.danger {
    background: #ff5722;
    box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
  }

  .icon-circle.danger:hover {
    background: #f4511e;
    box-shadow: 0 6px 16px rgba(255, 87, 34, 0.4);
  }

  .icon-circle.secondary {
    background: #2196f3;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  .icon-circle.secondary:hover {
    background: #1e88e5;
    box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
  }
  .icon-circle.yaoqing {
    background-image: url('@/assets/images/yaoqing1.png');
    img {
      max-width: 70%;
      height: auto;
    }
  }

  .icon {
    width: 28px;
    height: 28px;
    color: white;
  }

  .icon-label {
    font-size: 13px;
    font-weight: 500;
    color: #666;
  }

  .hint-card {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: #e3f2fd;
    border: 1px solid #bbdefb;
  }

  .hint-card svg {
    color: #1976d2;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .hint-card p {
    font-size: 12px;
    color: #1565c0;
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
    font-weight: 600;
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
    border: 2px dashed #e0e0e0;
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
    /* display: flex;
    flex-wrap: wrap;
    gap: 20px; */
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
    font-weight: 600;
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
    border: 1px solid #e0e0e0;
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
    background: #e53935;
  }

  .landscape-button {
    width: 100%;
    padding: 12px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    color: #666;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .landscape-button:hover {
    background: #f5f5f5;
    border-color: #2196f3;
    color: #2196f3;
  }

  .landscape-button.active {
    background: #2196f3;
    border-color: #2196f3;
    color: white;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }

  .landscape-button.active:hover {
    background: #1976d2;
    border-color: #1976d2;
  }
</style>

<style>
  body.landscape-mode .interaction-panel {
    height: 100vh;
    height: 100dvh;
  }

  body.landscape-mode .sidebar {
    width: 280px;
    padding: 12px;
    gap: 12px;
  }

  body.landscape-mode .content-area {
    padding: 12px;
  }

  body.landscape-mode .classrooms-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: 1024px) {
    body.landscape-mode .sidebar {
      width: 240px;
      padding: 8px;
      gap: 8px;
    }

    body.landscape-mode .classrooms-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }

  @media (max-width: 768px) {
    body.landscape-mode .sidebar {
      width: 200px;
      padding: 6px;
      gap: 6px;
    }

    body.landscape-mode .content-area {
      padding: 8px;
    }

    body.landscape-mode .classrooms-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
  }
</style>
