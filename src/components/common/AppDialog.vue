<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :before-close="handleBeforeClose"
    :center="center"
    :destroy-on-close="destroyOnClose"
    :lock-scroll="lockScroll"
    :custom-class="customClass"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <div class="dialog-content">
      <slot></slot>
    </div>
    
    <div v-if="showFooter" slot="footer" class="dialog-footer">
      <el-button
        v-if="showCancelButton"
        :size="buttonSize"
        @click="handleCancel"
      >
        {{ cancelText }}
      </el-button>
      <el-button
        v-if="showConfirmButton"
        type="primary"
        :size="buttonSize"
        :loading="confirmLoading"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </el-button>
      <slot name="footer"></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AppDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    width: {
      type: String,
      default: '50%'
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '15vh'
    },
    modal: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    center: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: true
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    confirmLoading: {
      type: Boolean,
      default: false
    },
    buttonSize: {
      type: String,
      default: 'medium'
    },
    beforeClose: {
      type: Function,
      default: null
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: this.visible
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal)
    }
  },
  methods: {
    handleOpen() {
      this.$emit('open')
    },
    handleOpened() {
      this.$emit('opened')
    },
    handleClose() {
      this.$emit('close')
    },
    handleClosed() {
      this.$emit('closed')
    },
    handleCancel() {
      this.$emit('cancel')
      this.dialogVisible = false
    },
    handleConfirm() {
      this.$emit('confirm')
    },
    handleBeforeClose() {
      if (this.beforeClose) {
        return this.beforeClose()
      }
      return true
    }
  }
}
</script>

<style scoped>
.dialog-content {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}
</style>
