<template>
  <div class="app-input">
    <el-input
      :type="inputType"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :clearable="clearable"
      :disabled="disabled"
      :readonly="readonly"
      :show-password="showPassword"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :size="size"
      :class="inputClass"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @clear="handleClear"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-if="$slots.suffix" #suffix>
        <slot name="suffix"></slot>
      </template>
    </el-input>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppInput',
  props: {
    type: {
      type: String,
      default: 'text',
      validator: value => ['text', 'password', 'number', 'textarea', 'url', 'email'].includes(value)
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    suffixIcon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['medium', 'small', 'mini', 'large'].includes(value)
    },
    error: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localValue: this.value
    }
  },
  computed: {
    inputType() {
      return this.type
    },
    inputClass() {
      const classes = []
      if (this.customClass) {
        classes.push(this.customClass)
      }
      if (this.error) {
        classes.push('has-error')
      }
      return classes.join(' ')
    },
    errorMessage() {
      return this.error
    }
  },
  watch: {
    value(newVal) {
      this.localValue = newVal
    }
  },
  methods: {
    handleInput(value) {
      this.localValue = value
      this.$emit('input', value)
      this.$emit('update:value', value)
    },
    handleChange(value) {
      this.$emit('change', value)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.$emit('blur', event)
    },
    handleClear() {
      this.$emit('clear')
    }
  }
}
</script>

<style scoped>
.app-input {
  width: 100%;
}

.app-input.has-error :deep(.el-input__inner) {
  border-color: #f44336;
}

.error-message {
  margin-top: 4px;
  font-size: 12px;
  color: #f44336;
  line-height: 1.4;
}
</style>
