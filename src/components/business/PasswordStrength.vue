<template>
  <div class="password-strength">
    <div v-if="showText" class="strength-header">
      <span class="strength-label">密码强度：</span>
      <span class="strength-text" :class="strengthColorClass">{{ strengthText }}</span>
    </div>
    <div class="strength-indicator">
      <div
        v-for="level in 5"
        :key="level"
        class="strength-bar"
        :class="getBarClass(level)"
      ></div>
    </div>
  </div>
</template>

<script>
import { calculatePasswordStrength, getPasswordStrengthText } from '@/utils/validate'

export default {
  name: 'PasswordStrength',
  props: {
    password: {
      type: String,
      default: ''
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    strength() {
      return calculatePasswordStrength(this.password)
    },
    strengthInfo() {
      return getPasswordStrengthText(this.strength)
    },
    strengthText() {
      return this.strengthInfo.text
    },
    strengthColorClass() {
      return this.strengthInfo.color
    }
  },
  methods: {
    getBarClass(level) {
      if (level <= this.strength) {
        if (this.strength <= 2) {
          return 'bg-red-500'
        } else if (this.strength <= 3) {
          return 'bg-orange-500'
        } else {
          return 'bg-green-500'
        }
      }
      return 'bg-gray-200'
    }
  }
}
</script>

<style scoped>
.password-strength {
  width: 100%;
}

.strength-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.strength-label {
  font-size: 12px;
  color: #666;
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
}

.strength-indicator {
  display: flex;
  gap: 4px;
}

.strength-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  transition: background-color 0.3s ease;
}
</style>
