<template>
  <div v-if="visible" class="reschedule-modal-overlay">
    <div class="reschedule-modal-mask" @click="handleClose"></div>
    <div class="reschedule-modal">
      <div class="modal-header">
        <h3 class="modal-title">申请调课</h3>
        <button class="close-btn" @click="handleClose" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div v-if="errorMessage" class="error-banner">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span class="error-text">{{ errorMessage }}</span>
      </div>

      <div class="modal-body">
        <div class="form-item">
          <label class="form-label">课程名称</label>
          <div class="readonly-input">{{ course && course.courseName }}</div>
        </div>

        <div class="form-item">
          <label class="form-label"> 上课日期 <span class="required">*</span> </label>
          <div class="input-wrapper">
            <input
              ref="dateInput"
              type="date"
              :min="todayStr"
              v-model="form.adjustDate"
              @blur="touched.adjustDate = true"
              @click="openDatePicker"
              class="form-input form-input-date"
              :class="{ 'has-error': touched.adjustDate && !form.adjustDate }"
            />
            <svg
              class="input-icon input-icon-clickable"
              @click="openDatePicker"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <p v-if="touched.adjustDate && !form.adjustDate" class="error-tip">请选择上课日期</p>
        </div>

        <div class="form-item">
          <label class="form-label"> 主讲教师 <span class="required">*</span> </label>
          <div class="input-wrapper">
            <select
              v-model="form.adjustTeacherId"
              @change="handleTeacherChange"
              @blur="touched.adjustTeacherId = true"
              class="form-input form-select"
              :class="{ 'has-error': touched.adjustTeacherId && !form.adjustTeacherId }"
              :disabled="teacherLoading"
            >
              <option :value="''">{{ teacherLoading ? '加载中...' : '请选择主讲教师' }}</option>
              <option v-for="t in teacherOptions" :key="t.id" :value="t.id">
                {{ t.teacherName }}
              </option>
            </select>
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <p v-if="touched.adjustTeacherId && !form.adjustTeacherId" class="error-tip">请选择主讲教师</p>
        </div>

        <div class="form-item">
          <label class="form-label"> 上课节次 <span class="required">*</span> </label>
          <div class="input-wrapper">
            <select
              v-model="form.periodId"
              @blur="touched.periodId = true"
              class="form-input form-select"
              :class="{ 'has-error': touched.periodId && !form.periodId }"
              :disabled="!form.adjustTeacherId || periodLoading"
            >
              <option :value="''">{{ periodPlaceholder }}</option>
              <option v-for="p in periodOptions" :key="p.id" :value="p.id">
                {{ formatPeriodLabel(p) }}
              </option>
            </select>
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <p v-if="touched.periodId && !form.periodId" class="error-tip">请选择上课节次</p>
        </div>

        <div class="form-item">
          <label class="form-label"> 上课地点 <span class="required">*</span> </label>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="form.location"
              placeholder="请填写上课教室，如 教学楼A-301"
              @blur="touched.location = true"
              class="form-input"
              :class="{ 'has-error': touched.location && !form.location.trim() }"
            />
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <p v-if="touched.location && !form.location.trim()" class="error-tip">请填写上课地点</p>
        </div>

        <div class="form-item">
          <label class="form-label"> 调课原因 <span class="optional">（选填）</span> </label>
          <textarea v-model="form.adjustReason" placeholder="请说明调课原因" rows="3" class="form-textarea"></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-cancel" @click="handleClose" :disabled="submitting">取消</button>
        <button class="btn btn-submit" @click="handleSubmit" :disabled="submitting">
          {{ submitting ? '提交中...' : '提交申请' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import courseApi from '@/api/course';

  export default {
    name: 'RescheduleModal',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      course: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        form: {
          adjustDate: '',
          adjustTeacherId: '',
          periodId: '',
          location: '',
          adjustReason: '',
        },
        touched: {
          adjustDate: false,
          adjustTeacherId: false,
          periodId: false,
          location: false,
        },
        teacherOptions: [],
        periodOptions: [],
        teacherLoading: false,
        periodLoading: false,
        submitting: false,
        errorMessage: '',
        todayStr: this.getTodayStr(),
      };
    },
    computed: {
      periodPlaceholder() {
        if (!this.form.adjustTeacherId) return '请先选择主讲教师';
        if (this.periodLoading) return '加载中...';
        if (!this.periodOptions.length) return '暂无可选节次';
        return '请选择节次';
      },
    },
    watch: {
      visible(val) {
        if (val) {
          this.resetForm();
          this.fetchTeachers();
        }
      },
    },
    methods: {
      getTodayStr() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      },
      resetForm() {
        this.form = {
          adjustDate: this.course && this.course.lessonDate ? this.course.lessonDate : '',
          adjustTeacherId: '',
          periodId: '',
          location: this.course && this.course.location ? this.course.location : '',
          adjustReason: '',
        };
        this.touched = {
          adjustDate: false,
          adjustTeacherId: false,
          periodId: false,
          location: false,
        };
        this.teacherOptions = [];
        this.periodOptions = [];
        this.errorMessage = '';
        this.submitting = false;
        this.todayStr = this.getTodayStr();
      },
      openDatePicker() {
        const input = this.$refs.dateInput;
        if (!input) return;
        if (typeof input.showPicker === 'function') {
          try {
            input.showPicker();
            return;
          } catch (e) {
            // ignore and fallback to focus
          }
        }
        input.focus();
      },
      async fetchTeachers() {
        this.teacherLoading = true;
        try {
          const res = await courseApi.listTeachers();
          this.teacherOptions = (res && res.data) || [];
        } catch (err) {
          console.error('获取教师列表失败:', err);
          this.teacherOptions = [];
          this.$message && this.$message.error('获取教师列表失败');
        } finally {
          this.teacherLoading = false;
        }
      },
      async fetchPeriods(stageId) {
        if (!stageId) {
          this.periodOptions = [];
          return;
        }
        this.periodLoading = true;
        try {
          const res = await courseApi.listPeriods(stageId);
          this.periodOptions = (res && res.data) || [];
        } catch (err) {
          console.error('获取课时列表失败:', err);
          this.periodOptions = [];
          this.$message && this.$message.error('获取上课节次失败');
        } finally {
          this.periodLoading = false;
        }
      },
      handleTeacherChange() {
        this.form.periodId = '';
        this.periodOptions = [];
        const teacher = this.teacherOptions.find(t => t.id === this.form.adjustTeacherId);
        if (teacher && teacher.stageId) {
          this.fetchPeriods(teacher.stageId);
        }
      },
      formatPeriodLabel(p) {
        const start = this.formatTime(p.startTime);
        const end = this.formatTime(p.endTime);
        const range = start && end ? ` ${start}-${end}` : '';
        return `${p.periodName || ''}${range}`;
      },
      formatTime(t) {
        if (!t) return '';
        if (typeof t === 'string') {
          const parts = t.split(':');
          if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
          return t;
        }
        if (typeof t === 'object') {
          const h = String(t.hour != null ? t.hour : 0).padStart(2, '0');
          const m = String(t.minute != null ? t.minute : 0).padStart(2, '0');
          return `${h}:${m}`;
        }
        return '';
      },
      validate() {
        this.touched.adjustDate = true;
        this.touched.adjustTeacherId = true;
        this.touched.periodId = true;
        this.touched.location = true;
        if (!this.form.adjustDate) return false;
        if (!this.form.adjustTeacherId) return false;
        if (!this.form.periodId) return false;
        if (!this.form.location.trim()) return false;
        return true;
      },
      async handleSubmit() {
        this.errorMessage = '';
        if (!this.validate()) return;
        if (!this.course || !this.course.scheduleId) {
          this.errorMessage = '排课信息缺失，无法提交';
          return;
        }
        const payload = {
          scheduleId: this.course.scheduleId,
          adjustDate: this.form.adjustDate,
          periodId: this.form.periodId,
          adjustTeacherId: this.form.adjustTeacherId,
          location: this.form.location.trim(),
          adjustReason: this.form.adjustReason ? this.form.adjustReason.trim() : '',
        };
        this.submitting = true;
        try {
          const res = await courseApi.applyCourseAdjustment(payload);
          const isSuccess = res && (res.success === true || res.code === 200);
          if (isSuccess) {
            this.$message && this.$message.success('调课申请已提交');
            this.$emit('success', res.data);
            this.submitting = false;
            this.$emit('update:visible', false);
            this.$emit('close');
          } else {
            this.errorMessage = (res && res.message) || '提交调课申请失败';
            this.submitting = false;
          }
        } catch (err) {
          console.error('提交调课申请失败:', err);
          this.errorMessage = (err && err.message) || '提交调课申请失败，请稍后重试';
          this.submitting = false;
        }
      },
      handleClose() {
        if (this.submitting) return;
        this.$emit('update:visible', false);
        this.$emit('close');
      },
    },
  };
</script>

<style scoped>
  .reschedule-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 2100;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .reschedule-modal-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  .reschedule-modal {
    position: relative;
    width: 100%;
    max-width: 520px;
    margin: 0 16px;
    background: #fff;
    border-radius: 12px;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid #f3f4f6;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #9ca3af;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: #f3f4f6;
    color: #4b5563;
  }

  .close-btn svg {
    width: 20px;
    height: 20px;
  }

  .error-banner {
    margin: 16px 24px 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
  }

  .error-icon {
    width: 16px;
    height: 16px;
    color: #ef4444;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .error-text {
    font-size: 13px;
    color: #dc2626;
    line-height: 1.5;
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
  }

  .required {
    color: #ef4444;
    margin-left: 2px;
  }

  .optional {
    color: #9ca3af;
    font-size: 12px;
    font-weight: normal;
    margin-left: 4px;
  }

  .readonly-input {
    padding: 10px 12px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #6b7280;
    cursor: not-allowed;
  }

  .input-wrapper {
    position: relative;
  }

  .form-input {
    width: 100%;
    padding: 10px 36px 10px 12px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #111827;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
    font-family: inherit;
  }

  .form-input:focus {
    border-color: #1677ff;
    box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.1);
  }

  .form-input.has-error {
    border-color: #fca5a5;
  }

  .form-input.has-error:focus {
    border-color: #f87171;
    box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
  }

  .form-input:disabled {
    background: #f9fafb;
    cursor: not-allowed;
    color: #9ca3af;
  }

  .form-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
  }

  .form-select:disabled {
    cursor: not-allowed;
  }

  .form-input-date {
    cursor: pointer;
  }

  .form-input-date::-webkit-calendar-picker-indicator {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
    color: transparent;
    cursor: pointer;
    opacity: 0;
  }

  .input-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #9ca3af;
    pointer-events: none;
  }

  .input-icon-clickable {
    pointer-events: auto;
    cursor: pointer;
  }

  .form-textarea {
    width: 100%;
    padding: 10px 12px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #111827;
    outline: none;
    resize: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
    font-family: inherit;
  }

  .form-textarea:focus {
    border-color: #1677ff;
    box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.1);
  }

  .form-textarea::placeholder,
  .form-input::placeholder {
    color: #9ca3af;
  }

  .error-tip {
    margin: 4px 0 0;
    font-size: 12px;
    color: #ef4444;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #f3f4f6;
    background: rgba(249, 250, 251, 0.5);
  }

  .btn {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-cancel {
    background: #fff;
    color: #4b5563;
    border-color: #e5e7eb;
  }

  .btn-cancel:hover:not(:disabled) {
    background: #f9fafb;
  }

  .btn-submit {
    background: #1677ff;
    color: #fff;
  }

  .btn-submit:hover:not(:disabled) {
    background: #4096ff;
  }

  .btn-submit:active:not(:disabled) {
    background: #0958d9;
  }

  @media (max-width: 768px) {
    .modal-header,
    .modal-body,
    .modal-footer {
      padding-left: 16px;
      padding-right: 16px;
    }
    .error-banner {
      margin-left: 16px;
      margin-right: 16px;
    }
  }
</style>
