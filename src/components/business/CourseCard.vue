<template>
  <div class="course-card">
    <div class="card-header">
      <h3 class="course-name">{{ course.name }}</h3>
      <status-badge :status="course.status"></status-badge>
    </div>
    
    <div class="card-body">
      <div class="info-item">
        <span class="info-label">上课时间：</span>
        <span class="info-value">{{ course.time }}</span>
      </div>
      <div class="info-item">
        <span class="info-value">{{ course.classroom }} · {{ course.teacher }}</span>
      </div>
    </div>
    
    <div v-if="showActions" class="card-footer">
      <app-button
        v-if="course.status === '进行中'"
        type="primary"
        custom-class="w-full"
        @click="handleEnterClass"
      >
        进入课堂
        <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </app-button>
      
      <app-button
        v-else-if="course.status === '未开始'"
        :disabled="!course.canEnterEarly"
        :custom-class="getButtonClass()"
        @click="handleEarlyEnter"
      >
        {{ course.canEnterEarly ? '提前进入' : '未到上课时间' }}
        <svg v-if="course.canEnterEarly" class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </app-button>
    </div>
  </div>
</template>

<script>
import StatusBadge from './StatusBadge.vue'
import AppButton from '@/components/common/AppButton.vue'

export default {
  name: 'CourseCard',
  components: {
    StatusBadge,
    AppButton
  },
  props: {
    course: {
      type: Object,
      required: true,
      default: () => ({})
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleEnterClass() {
      this.$emit('enter-class', this.course.id)
    },
    handleEarlyEnter() {
      if (this.course.canEnterEarly) {
        this.$emit('early-enter', this.course.id)
      }
    },
    getButtonClass() {
      if (this.course.canEnterEarly) {
        return 'w-full bg-white border border-[#e58600] text-[#e58600] hover:bg-[#fff8ed] active:bg-[#ffecd9]'
      } else {
        return 'w-full bg-gray-100 text-gray-400 cursor-not-allowed'
      }
    }
  }
}
</script>

<style scoped>
.course-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.course-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.course-name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.info-label {
  color: #666;
}

.info-value {
  color: #666;
}

.card-footer {
  margin-top: auto;
}
</style>
