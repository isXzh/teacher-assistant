<template>
  <div class="status-badge" :class="badgeClass">
    <div class="status-dot" :class="dotClass"></div>
    <span class="status-text">{{ statusText }}</span>
  </div>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true
    },
    statusMap: {
      type: Object,
      default: () => ({
        '进行中': {
          dotColor: 'bg-primary',
          textColor: 'text-primary',
          text: '进行中'
        },
        '已结束': {
          dotColor: 'bg-success',
          textColor: 'text-success',
          text: '已结束'
        },
        '已取消': {
          dotColor: 'bg-danger',
          textColor: 'text-danger',
          text: '已取消'
        },
        '未开始': {
          dotColor: 'bg-gray-400',
          textColor: 'text-gray-600',
          text: '未开始'
        }
      })
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    statusConfig() {
      return this.statusMap[this.status] || {
        dotColor: 'bg-gray-400',
        textColor: 'text-gray-600',
        text: this.status
      }
    },
    dotClass() {
      return this.statusConfig.dotColor
    },
    badgeClass() {
      const classes = []
      if (this.customClass) {
        classes.push(this.customClass)
      }
      return classes.join(' ')
    },
    statusText() {
      return this.statusConfig.text
    }
  }
}
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-text {
  line-height: 1;
}
</style>
