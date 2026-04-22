<template>
  <div
    class="classroom-card"
    :class="getCardClass()"
    :style="getCardStyle()"
  >
    <div v-if="!isOffline && classroom.isInteracting" class="interaction-animation">
      <div class="animation-blob blob-1"></div>
      <div class="animation-blob blob-2"></div>
    </div>
    
    <div v-if="!isOffline && classroom.isRaisingHand" class="raising-animation">
      <div class="animation-blob blob-1"></div>
      <div class="animation-blob blob-2"></div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <div class="classroom-info">
          <div>
<h4 class="classroom-name" :class="getNameClass()">{{ classroom.name }}</h4>
          <p class="teacher-name">{{ classroom.teacher }}</p>
          </div>
          <div v-if="classroom.isRaisingHand && !isOffline" class="raising-badge">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
          </svg>
          <span>举手中</span>
        </div>
        </div>
        
        
        
        <button
          class="mic-button"
          :class="getMicButtonClass()"
          :disabled="isOffline"
          @click="handleToggleMic"
        >
         <!-- 麦克风图标 - 线性风格 -->
    <!-- <microphone theme="outline" v-if="classroom.micEnabled"  size="24" fill="#333"/> -->
    <!-- 麦克风静音图标 -->
    <!-- <microphone-off theme="outline" v-else size="24" fill="#ff4d4f"/> -->
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="classroom.micEnabled"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 0114 0m0 0a7 7 0 01-14 0m-9 9v10m3-10l-3 10"
            ></path>
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 0114 0m0 0a7 7 0 01-14 0M12 8v4m0 4l-3-3m3 3l3-3"
            ></path>
          </svg>
        </button>
      </div>
      
      <div class="status-section">
        <div v-if="isOffline" class="offline-warning">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.215V8.007c0-1.558-1.963-2.502-3.502-2.502H4.836c-1.54 0-2.502 1.667-2.502 3.215v4.586c0 1.538 1.963 2.502 3.502 2.502h4.14V12h-4.14z"
            ></path>
          </svg>
          <span>设备离线</span>
        </div>
        
        <div class="status-item">
          <span class="status-label">移动保障箱</span>
          <div class="status-value">
            <svg
              v-if="classroom.boxStatus === '离线'"
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172l5.656 5.656m0-5.656l-5.656-5.656M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 0a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <svg
              v-else
              class="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12.55a11 11 0 0111.99 9.134A11 11 0 0112.55 12.55v0a11 11 0 01-11.99-9.134A11 11 0 015.45 12.55v0z"
              ></path>
            </svg>
            <span :class="getBoxStatusClass()">{{ classroom.boxStatus }}</span>
          </div>
        </div>
        
        <div class="status-item">
          <span class="status-label">会控客户端</span>
          <div class="status-value">
            <div
              class="status-dot"
              :class="classroom.clientStatus === '已连接' ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <span :class="getClientStatusClass()">{{ classroom.clientStatus }}</span>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button
          class="action-button mic-action"
          :class="getMicActionClass()"
          :disabled="isOffline"
          @click="handleToggleMic"
        >
          {{ classroom.micEnabled ? '禁麦' : '开麦' }}
        </button>
        
        <template v-if="classroom.isRaisingHand && !isOffline">
          <button
            class="action-button approve-action"
            @click="handleApproveInteraction"
          >
            同意互动
          </button>
          <button
            class="action-button ignore-action"
            @click="handleIgnoreRaiseHand"
          >
            忽略
          </button>
        </template>
        
        <button
          v-else
          class="action-button interaction-action"
          :class="getInteractionActionClass()"
          :disabled="isOffline"
          @click="handleToggleInteraction"
        >
          {{ classroom.isInteracting ? '结束互动' : '开始互动' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Microphone, MicrophoneOff } from '@icon-park/vue';
export default {
  name: 'ClassroomCard',
   components: { Microphone, MicrophoneOff },
  props: {
    classroom: {
      type: Object,
      required: true,
      default: () => ({})
    },
    isOffline: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isDeviceOffline() {
      return this.classroom.boxStatus === '离线' || this.classroom.clientStatus === '断开'
    }
  },
  methods: {
    getCardClass() {
      const classes = []
      if (this.isOffline) {
        classes.push('offline')
      } else if (this.classroom.isInteracting) {
        classes.push('interacting')
      } else if (this.classroom.isRaisingHand) {
        classes.push('raising')
      }
      return classes.join(' ')
    },
    getCardStyle() {
      if (this.isOffline) {
        return { background: '#F5F5F5' }
      } else if (this.classroom.isInteracting) {
        return { background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }
      } else if (this.classroom.isRaisingHand) {
        return { background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' }
      } else {
        return { background: '#FFFFFF' }
      }
    },
    getNameClass() {
      if (this.isOffline) {
        return 'text-gray-500'
      } else if (this.classroom.isInteracting) {
        return 'text-blue-700'
      } else if (this.classroom.isRaisingHand) {
        return 'text-orange-700'
      } else {
        return 'text-gray-800'
      }
    },
    getMicButtonClass() {
      const classes = []
      if (this.isOffline) {
        classes.push('bg-gray-300', 'text-gray-500', 'cursor-not-allowed')
      } else if (this.classroom.micEnabled) {
        classes.push('bg-green-500', 'text-white', 'hover:bg-green-600')
      } else {
        classes.push('bg-red-500', 'text-white', 'hover:bg-red-600')
      }
      return classes.join(' ')
    },
    getBoxStatusClass() {
      if (this.classroom.boxStatus === '离线') {
        return 'text-gray-400'
      } else if (this.classroom.boxStatus === '在线') {
        return 'text-green-600'
      } else {
        return 'text-primary'
      }
    },
    getClientStatusClass() {
      return this.classroom.clientStatus === '已连接' ? 'text-green-600' : 'text-red-600'
    },
    getMicActionClass() {
      const classes = []
      if (this.isOffline) {
        classes.push('bg-gray-300', 'text-gray-500', 'cursor-not-allowed')
      } else if (this.classroom.micEnabled) {
        classes.push('bg-red-500', 'text-white', 'hover:bg-red-600', 'active:bg-red-700')
      } else {
        classes.push('bg-green-500', 'text-white', 'hover:bg-green-600', 'active:bg-green-700')
      }
      return classes.join(' ')
    },
    getInteractionActionClass() {
      const classes = []
      if (this.isOffline) {
        classes.push('bg-gray-300', 'text-gray-500', 'cursor-not-allowed')
      } else if (this.classroom.isInteracting) {
        classes.push('bg-gray-400', 'text-white', 'hover:bg-gray-500', 'active:bg-gray-600')
      } else {
        classes.push('bg-orange-500', 'text-white', 'hover:bg-orange-600', 'active:bg-orange-700')
      }
      return classes.join(' ')
    },
    handleToggleMic() {
      if (!this.isOffline) {
        this.$emit('toggle-mic', this.classroom.id)
      }
    },
    handleToggleInteraction() {
      if (!this.isOffline) {
        this.$emit('toggle-interaction', this.classroom.id)
      }
    },
    handleApproveInteraction() {
      this.$emit('approve-interaction', this.classroom.id)
    },
    handleIgnoreRaiseHand() {
      this.$emit('ignore-raise-hand', this.classroom.id)
    }
  }
}
</script>

<style scoped>
.classroom-card {
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.classroom-card.offline {
  opacity: 0.6;
}

.classroom-card.interacting {
  border: 2px solid #1E88E5;
  box-shadow: 0 4px 16px 0 rgba(30, 136, 229, 0.2);
}

.classroom-card.raising {
  border: 2px solid #FF6B35;
  box-shadow: 0 4px 16px 0 rgba(255, 107, 53, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.interaction-animation,
.raising-animation {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.animation-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: blob-pulse 2s infinite;
}

.blob-1 {
  top: 0;
  right: 0;
  width: 128px;
  height: 128px;
  background: rgba(30, 136, 229, 0.1);
}

.blob-2 {
  bottom: 0;
  left: 0;
  width: 160px;
  height: 160px;
  background: rgba(66, 165, 245, 0.1);
  animation-delay: 1s;
}

.raising-animation .blob-1 {
  background: rgba(255, 107, 53, 0.1);
}

.raising-animation .blob-2 {
  background: rgba(255, 183, 77, 0.1);
  animation-delay: 0.5s;
}

@keyframes blob-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.card-content {
  position: relative;
  z-index: 10;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.classroom-info {
  /* flex: 1; */
  display: flex;
    align-items: center;
    gap: 15px;
}

.classroom-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.teacher-name {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.raising-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #FF6B35;
  color: white;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.mic-button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

.mic-button:disabled {
  cursor: not-allowed;
}

.status-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.offline-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #dc2626;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-label {
  font-size: 14px;
  color: #666;
}

.status-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-button {
  flex: 1;
  height: 44px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
}

.action-button:disabled {
  cursor: not-allowed;
}

.approve-action {
  background: #4CAF50;
  color: white;
}

.approve-action:hover {
  background: #45A049;
}

.approve-action:active {
  background: #3D8B40;
}

.ignore-action {
  background: #d1d5db;
  color: #6b7280;
  padding: 0 16px;
}

.ignore-action:hover {
  background: #e5e7eb;
}

.ignore-action:active {
  background: #d4d4d8;
}
</style>
