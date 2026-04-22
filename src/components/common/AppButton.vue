<template>
  <el-button
    :type="buttonType"
    :size="size"
    :loading="loading"
    :disabled="disabled || loading"
    :plain="plain"
    :round="round"
    :circle="circle"
    :icon="icon"
    :class="buttonClass"
    @click="handleClick"
  >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    type: {
      type: String,
      default: 'default',
      validator: value => ['default', 'primary', 'success', 'warning', 'danger', 'info', 'text'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['medium', 'small', 'mini', 'large'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    buttonType() {
      const typeMap = {
        primary: 'primary',
        success: 'success',
        warning: 'warning',
        danger: 'danger',
        info: 'info',
        text: 'text',
        default: 'default'
      }
      return typeMap[this.type] || 'default'
    },
    buttonClass() {
      const classes = []
      if (this.customClass) {
        classes.push(this.customClass)
      }
      return classes.join(' ')
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style scoped>
</style>
