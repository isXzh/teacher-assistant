<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="formRules"
    :label-position="labelPosition"
    :label-width="labelWidth"
    :label-suffix="labelSuffix"
    :inline="inline"
    :disabled="disabled"
    :size="size"
    :status-icon="statusIcon"
    :validate-on-rule-change="validateOnRuleChange"
    :hide-required-asterisk="hideRequiredAsterisk"
    :show-message="showMessage"
    :inline-message="inlineMessage"
    @submit.native.prevent="handleSubmit"
    @validate="handleValidate"
  >
    <slot></slot>
  </el-form>
</template>

<script>
export default {
  name: 'AppForm',
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    labelPosition: {
      type: String,
      default: 'right',
      validator: value => ['left', 'right', 'top'].includes(value)
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    labelSuffix: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['medium', 'small', 'mini', 'large'].includes(value)
    },
    statusIcon: {
      type: Boolean,
      default: true
    },
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    inlineMessage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formRef: null
    }
  },
  computed: {
    formModel() {
      return this.model
    },
    formRules() {
      return this.rules
    }
  },
  methods: {
    validate(callback) {
      return this.$refs.formRef.validate(callback)
    },
    validateField(props, callback) {
      return this.$refs.formRef.validateField(props, callback)
    },
    resetFields() {
      this.$refs.formRef.resetFields()
    },
    clearValidate() {
      this.$refs.formRef.clearValidate()
    },
    clearValidate(props) {
      this.$refs.formRef.clearValidate(props)
    },
    handleSubmit() {
      this.validate(valid => {
        if (valid) {
          this.$emit('submit', this.formModel)
        } else {
          this.$emit('validate-fail')
        }
        this.$emit('validate', valid)
      })
    },
    handleValidate(prop, isValid, errorMessage) {
      this.$emit('validate', prop, isValid, errorMessage)
    }
  }
}
</script>

<style scoped>
</style>
