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
            <h2 class="card-title">{{ mainClassroomName || '主讲教室保障箱' }}</h2>
            <button class="refresh-button" @click="fetchRealtimeInfo">
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
              <span class="status-label">实时连接</span>
              <div :class="['status-value', sseConnected ? 'online' : 'offline']">
                <div class="status-dot"></div>
                <span class="status-text">{{ sseConnected ? '正常' : '断开' }}</span>
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
                    d="M5 12.55a11 11 0 0111.99 9.134A11 11 0 0112.55 12.55v0a11 11 0 01-11.99-9.134A11 11 0 015.45 12.55v0z"
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
            <!-- <button class="simulate-button" @click="handleSimulateRaiseHand">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 11l5-5m0 0l5 5m-5-5v12m0 0l5 5m-5-5v12m0 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              模拟举手
            </button> -->
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
  import homeApi from '@/api/home';
  import meetingControlApi from '@/api/meetingControl';

  export default {
    name: 'InteractionPanel',
    components: {
      TopNav,
      ClassroomCard,
    },
    data() {
      return {
        classrooms: [],
        showEndClassDialog: false,
        scheduleId: null,
        messages: [],
        mainClassroomPhone: null,
        mainClassroomName: null,
        subscriberInPics: [],
        sseEventHandlers: {},
      };
    },
    computed: {
      sseConnected() {
        return this.$store.getters['sse/isSseConnected'];
      },
    },
    async created() {
      this.scheduleId = this.$route.params.courseId;
      await this.fetchMainClassroomPhone();
      await this.fetchRealtimeInfo();
      const savedSubscriberInPics = sessionStorage.getItem('subscriberInPics');
      if (savedSubscriberInPics) {
        try {
          this.subscriberInPics = JSON.parse(savedSubscriberInPics);
        } catch (error) {
          console.error('恢复subscriberInPics失败:', error);
        }
      }
    },
    async mounted() {
      await this.initSSEConnection();
      this.setupSSEEventListeners();
    },
    beforeDestroy() {
      this.removeSSEEventListeners();
      if (this.subscriberInPics && this.subscriberInPics.length > 0) {
        sessionStorage.setItem('subscriberInPics', JSON.stringify(this.subscriberInPics));
      }
    },
    methods: {
      async initSSEConnection() {
        try {
          await this.$store.dispatch('sse/initSSE', this.scheduleId);
        } catch (error) {
          console.error('SSE连接初始化失败:', error);
        }
      },

      setupSSEEventListeners() {
        const sseClient = this.$store.getters['sse/getSseClient'];
        if (!sseClient) {
          console.error('SSE客户端未初始化');
          return;
        }

        sseClient.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.sseEventHandlers.participants = event => this.handleParticipants(event);
        this.sseEventHandlers.confDynamicInfo = event => {
          const data = JSON.parse(event.data);
          console.log('confDynamicInfo update===============:', data);
          if (data.state === 'Destroyed') {
            this.subscriberInPics = [];
            sessionStorage.removeItem('subscriberInPics');
            console.log('会议已销毁，已清空subscriberInPics');
          }
        };

        this.$store.dispatch('sse/addEventListener', {
          event: 'participants',
          handler: this.sseEventHandlers.participants,
        });

        this.$store.dispatch('sse/addEventListener', {
          event: 'confDynamicInfo',
          handler: this.sseEventHandlers.confDynamicInfo,
        });
      },

      removeSSEEventListeners() {
        this.$store.dispatch('sse/removeEventListener', {
          event: 'participants',
          handler: this.sseEventHandlers.participants,
        });

        this.$store.dispatch('sse/removeEventListener', {
          event: 'confDynamicInfo',
          handler: this.sseEventHandlers.confDynamicInfo,
        });

        this.sseEventHandlers = {};
      },

      handleMessage(event) {
        try {
          const data = JSON.parse(event.data);
          this.messages.push(data);
          console.log('message', data);
        } catch (error) {
          console.error('解析SSE消息失败:', error);
        }
      },

      handleParticipants(event) {
        try {
          const data = JSON.parse(event.data);
          console.log('participants update===============:', data);

          if (Array.isArray(data)) {
            data.forEach(participant => {
              const pid = participant.pid;
              const pinfoMap = participant.pinfoMap || {};
              const handState = pinfoMap.HAND;
              const tel = pinfoMap.TEL;
              const mode = participant.mode;

              if (tel) {
                const classroom = this.classrooms.find(c => c.phone === tel);
                if (classroom) {
                  if (handState === '1') {
                    if (classroom.isInteracting) {
                      meetingControlApi.setHandRaise(this.scheduleId, pid, { handsState: 0 }).catch(error => {
                        console.error('自动放下手失败:', error);
                      });
                    } else {
                      this.$set(classroom, 'isRaisingHand', true);
                      this.$set(classroom, 'pid', pid);
                    }
                  } else {
                    this.$set(classroom, 'isRaisingHand', false);
                  }
                }
              }

              if (mode === 0 || mode === 1) {
                this.fetchRealtimeInfo();
              }
            });
          }
        } catch (error) {
          console.error('解析参与者数据失败:', error);
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
      async fetchRealtimeInfo() {
        try {
          const response = await homeApi.realtimeInfo(this.scheduleId);
          console.log('realtimeInfo', response);
          if (response.code == 200 && response.data) {
            const attendees = response.data.attendees || [];
            const participants = response.data.participants || [];
            console.log('attendees:', attendees);
            console.log('participants:', participants);
            this.processClassrooms(attendees, participants);
          }
        } catch (error) {
          console.error('获取会议实时信息失败:', error);
          this.$message.error('获取会议实时信息失败');
        }
      },
      processClassrooms(attendees, participants) {
        const attendeeList = attendees || [];
        const participantList = participants || [];

        if (this.mainClassroomPhone) {
          const mainClassroom = attendeeList.find(attendee => attendee.phone === this.mainClassroomPhone);
          if (mainClassroom) {
            this.mainClassroomName = mainClassroom.name;
            console.log('主讲教室name:', this.mainClassroomName);
          }
        }

        const participantPhones = participantList.map(p => p.phone);

        const filteredAttendees = this.mainClassroomPhone
          ? attendeeList.filter(attendee => attendee.phone !== this.mainClassroomPhone)
          : attendeeList;

        const interactingPhones =
          this.subscriberInPics.length > 1 ? this.subscriberInPics.slice(1).map(item => item.subscriber[0]) : [];

        this.classrooms = filteredAttendees.map((attendee, index) => {
          const isOnline = participantPhones.includes(attendee.phone);
          const participant = participantList.find(p => p.phone === attendee.phone);
          const existingClassroom = this.classrooms.find(c => c.phone === attendee.phone);

          const isInteracting = existingClassroom ? existingClassroom.isInteracting : false;
          const hand = participant ? participant.hand : existingClassroom ? existingClassroom.hand : null;
          const mute = participant ? participant.mute : existingClassroom ? existingClassroom.mute : null;

          return {
            id: index + 1,
            name: attendee.name,
            teacher: attendee.name,
            boxStatus: isOnline ? '在线' : '离线',
            clientStatus: isOnline ? '已连接' : '断开',
            micEnabled: mute === 0 ? true : false,
            isInteracting: isInteracting,
            isRaisingHand: hand === 1 ? true : false,
            phone: attendee.phone,
            accountID: attendee.accountID,
            userUUID: attendee.userUUID,
            pid: participant ? participant.pid : existingClassroom ? existingClassroom.pid : null,
            mute: mute,
            hand: hand,
          };
        });

        participantList.forEach(participant => {
          const classroom = this.classrooms.find(c => c.phone === participant.phone);
          if (classroom) {
            this.$set(classroom, 'isInteracting', interactingPhones.includes(participant.phone));
            this.$set(classroom, 'isRaisingHand', participant.hand === 1);
            this.$set(classroom, 'hand', participant.hand);
            this.$set(classroom, 'mute', participant.mute);
            this.$set(classroom, 'micEnabled', participant.mute === 0);
          }
        });
        console.log('interactingPhones======', interactingPhones);
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
            this.$store.dispatch('sse/closeSSE');
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
        // 判断 subscriberInPics 的 length 是否为0，如果为0则 return
        if (this.subscriberInPics.length === 0) {
          return;
        }
        // 如果不为0，subscriberInPics 数组只保留第一项，删除其他项
        this.subscriberInPics = this.subscriberInPics.slice(0, 1);

        try {
          const { scheduleId, subscriberInPics, mainClassroomPhone } = this;

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
          }

          const response = await meetingControlApi.setCustomPicture(scheduleId, {
            manualSet: 1,
            multiPicSaveOnly: false,
            imageType: this.getImageType(newSubscriberInPics.length),
            subscriberInPics: newSubscriberInPics,
          });

          if (response.success && response.data) {
            this.subscriberInPics = newSubscriberInPics;
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

  .control-icons {
    display: flex;
    flex-direction: row;
    justify-content: center;
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
    /* display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px; */
    display: flex;
    flex-wrap: wrap;
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
</style>
