<template>
  <div class="profile-page">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-avatar-large">{{ userInfo.name ? userInfo.name.charAt(0) : '张' }}</div>
      <div class="user-info">
        <div class="user-name">{{ userInfo.name || '张老师' }}</div>
        <div class="user-detail">{{ userInfo.jobNumber || 'T20240001' }} · {{ userInfo.organization || '兴图中学·计算机教研组' }}</div>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="tabs-wrapper">
      <div class="tabs-header">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </div>

      <!-- 基本资料 -->
      <div v-if="activeTab === 'basic'" class="tab-panel1">
        <div class="form-group1">
          <label class="form-label">姓名 <span class="required">*</span></label>
          <input v-model="userProfile.name" type="text" class="form-input" placeholder="请输入姓名" />
        </div>
        <div class="form-group1">
          <label class="form-label">工号 <span class="required">*</span></label>
          <input v-model="userProfile.jobNumber" type="text" class="form-input" placeholder="请输入工号" />
        </div>
        <div class="form-group1">
          <label class="form-label">手机号 <span class="required">*</span></label>
          <input v-model="userProfile.phone" type="tel" class="form-input" placeholder="请输入手机号" />
        </div>
        <div class="form-group1">
          <label class="form-label">邮箱</label>
          <input v-model="userProfile.email" type="email" class="form-input" placeholder="请输入邮箱" />
        </div>
        <div class="form-group1">
          <label class="form-label">所属学段</label>
          <div class="form-select-wrapper">
            <select v-model="userProfile.schoolLevel" class="form-select">
              <option value="">请选择</option>
              <option value="小学">小学</option>
              <option value="初中">初中</option>
              <option value="高中">高中</option>
              <option value="职业教育">职业教育</option>
            </select>
          </div>
        </div>
        <div class="form-group1">
          <label class="form-label">所属组织</label>
          <input v-model="userProfile.organization" type="text" class="form-input" placeholder="请输入所属组织" />
        </div>
        <button class="save-btn" @click="handleSaveProfile">保存修改</button>
      </div>

      <!-- 安全设置 -->
      <div v-if="activeTab === 'security'" class="tab-panel">
        <div class="security-hint">
          <span class="security-hint-title">密码安全建议：</span>
          <span class="security-hint-text">密码长度至少8位，建议包含大小写字母、数字和特殊字符</span>
        </div>
        <div class="form-group">
          <label class="form-label">原密码 <span class="required">*</span></label>
          <input v-model="passwordForm.oldPassword" type="password" class="form-input" placeholder="请输入原密码" />
        </div>
        <div class="form-group">
          <label class="form-label">新密码 <span class="required">*</span></label>
          <input v-model="passwordForm.newPassword" type="password" class="form-input" placeholder="请输入新密码" @input="handleNewPasswordChange" />
        </div>
        <div class="form-group">
          <label class="form-label">确认新密码 <span class="required">*</span></label>
          <input v-model="passwordForm.confirmPassword" type="password" class="form-input" placeholder="请再次输入新密码" />
        </div>
        <button class="save-btn" @click="handleSavePassword">修改密码</button>
      </div>

      <!-- 通知设置 -->
      <div v-if="activeTab === 'notification'" class="tab-panel notification-panel">
        <div class="notification-list">
          <div class="notification-item">
            <div class="notification-content">
              <div class="notification-title">上课提醒</div>
              <div class="notification-desc">在课程开始前10分钟发送提醒通知</div>
            </div>
            <div class="toggle-switch" :class="{ active: notifications.classReminder }" @click="toggleNotification('classReminder')">
              <div class="toggle-slider"></div>
            </div>
          </div>
          <div class="notification-item">
            <div class="notification-content">
              <div class="notification-title">互动通知</div>
              <div class="notification-desc">听讲教室举手申请互动时发送通知</div>
            </div>
            <div class="toggle-switch" :class="{ active: notifications.interactionNotice }" @click="toggleNotification('interactionNotice')">
              <div class="toggle-slider"></div>
            </div>
          </div>
          <div class="notification-item">
            <div class="notification-content">
              <div class="notification-title">系统通知</div>
              <div class="notification-desc">接收系统维护、更新等重要通知</div>
            </div>
            <div class="toggle-switch" :class="{ active: notifications.systemNotice }" @click="toggleNotification('systemNotice')">
              <div class="toggle-slider"></div>
            </div>
          </div>
          <div class="notification-item">
            <div class="notification-content">
              <div class="notification-title">设备告警</div>
              <div class="notification-desc">保障箱离线或设备异常时发送告警通知</div>
            </div>
            <div class="toggle-switch" :class="{ active: notifications.deviceAlert }" @click="toggleNotification('deviceAlert')">
              <div class="toggle-slider"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 关于 -->
      <div v-if="activeTab === 'about'" class="tab-panel about-panel">
        <div class="about-list">
          <div class="about-item">
            <span class="about-label">版本号</span>
            <span class="about-value">v1.0.0</span>
          </div>
          <div class="about-item about-link" @click="showUserAgreement">
            <span class="about-label">用户协议</span>
            <span class="about-arrow">></span>
          </div>
          <div class="about-item about-link" @click="showPrivacyPolicy">
            <span class="about-label">隐私政策</span>
            <span class="about-arrow">></span>
          </div>
          <button class="check-update-btn" @click="checkUpdate">检查更新</button>
        </div>
      </div>
    </div>

    <!-- 退出登录按钮 -->
    <button class="logout-btn" @click="handleLogout">退出登录</button>

    <!-- 成功提示 -->
    <div v-if="showSuccessToast" class="success-toast">
      <span class="success-icon">✓</span>
      <span>{{ successMessage }}</span>
    </div>
  </div>
</template>

<script>
import auth from '@/api/auth'

export default {
  name: 'Profile',
  data() {
    return {
      activeTab: 'basic',
      showSuccessToast: false,
      successMessage: '',
      tabs: [
        { id: 'basic', name: '基本资料' },
        { id: 'security', name: '安全设置' },
        { id: 'notification', name: '通知设置' },
        { id: 'about', name: '关于' }
      ],
      userProfile: {
        name: '张老师',
        jobNumber: 'T20240001',
        phone: '138****8888',
        email: 'zhang.teacher@example.com',
        schoolLevel: '高中',
        organization: '兴图中学·计算机教研组'
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      notifications: {
        classReminder: true,
        interactionNotice: true,
        systemNotice: false,
        deviceAlert: true
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store?.getters?.['user/getUserInfo'] || {
        name: '张老师',
        jobNumber: 'T20240001',
        organization: '兴图中学·计算机教研组'
      }
    }
  },
  methods: {
    showSuccess(message) {
      this.successMessage = message
      this.showSuccessToast = true
      setTimeout(() => {
        this.showSuccessToast = false
      }, 2000)
    },
    handleSaveProfile() {
      this.showSuccess('保存成功')
    },
    handleSavePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      if (this.passwordForm.newPassword.length < 8) {
        alert('密码长度至少8位')
        return
      }
      this.showSuccess('修改成功')
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    toggleNotification(key) {
      this.notifications[key] = !this.notifications[key]
    },
    handleNewPasswordChange() {
      // 可以在这里添加密码强度检查逻辑
    },
    showUserAgreement() {
      alert('用户协议功能待开发')
    },
    showPrivacyPolicy() {
      alert('隐私政策功能待开发')
    },
    checkUpdate() {
      alert('当前已是最新版本')
    },
    async handleLogout() {
      if (confirm('确定要退出登录吗？')) {
        try {
          await auth.logout()
          this.$store.dispatch('user/logout')
          this.$router?.push('/login')
        } catch (error) {
          console.error('退出登录失败:', error)
        }
      }
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 16px 650px;
  padding-bottom: 100px;
  
}

/* 用户信息卡片 */
.user-card {
  background: linear-gradient(135deg, #4a7bff 0%, #5a8cff 100%);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
  margin-bottom: 16px;
}

.user-avatar-large {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 500;
  flex-shrink: 0;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-detail {
  font-size: 14px;
  opacity: 0.9;
}

/* 标签页容器 */
.tabs-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

/* 标签头部 */
.tabs-header {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  flex: 1;
  padding: 16px 8px;
  text-align: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tab-item.active {
  color: #4a7bff;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: #4a7bff;
}

/* 标签内容面板 */
.tab-panel1 {
  padding: 20px;
      display: flex;
    flex-wrap: wrap;
    /* gap: 20px; */
    justify-content: space-between;
}
.tab-panel {
padding: 20px;
}
/* 表单样式 */
.form-group {
  margin-bottom: 16px;

}
.form-group1 {
  margin-bottom: 16px;
  width: 48%;

}
.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.required {
  color: #f44336;
}

.form-input,
.form-select {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background: white;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  border-color: #4a7bff;
}

.form-select-wrapper {
  position: relative;
}

.form-select-wrapper::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #999;
  pointer-events: none;
}

.form-select {
  appearance: none;
  padding-right: 30px;
}

/* 保存按钮 */
.save-btn {
  width: 100%;
  height: 44px;
  background: #4a7bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

.save-btn:active {
  background: #3a6bef;
}

/* 安全设置 */
.security-hint {
  background: #f0f5ff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 13px;
}

.security-hint-title {
  color: #4a7bff;
  font-weight: 500;
}

.security-hint-text {
  color: #666;
}

/* 通知设置 */
.notification-panel {
  padding: 0;
}

.notification-list {
  padding: 8px 0;
}

.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 13px;
  color: #999;
}

/* 切换开关 */
.toggle-switch {
  width: 48px;
  height: 28px;
  background: #ddd;
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-switch.active {
  background: #4a7bff;
}

.toggle-slider {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.toggle-switch.active .toggle-slider {
  transform: translateX(20px);
}

/* 关于页面 */
.about-panel {
  padding: 0;
}

.about-list {
  padding: 8px 0;
}

.about-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
}

.about-item:last-of-type {
  border-bottom: none;
}

.about-label {
  font-size: 14px;
  color: #333;
}

.about-value {
  font-size: 14px;
  color: #999;
}

.about-arrow {
  font-size: 14px;
  color: #ccc;
}

.about-link {
  cursor: pointer;
}

.check-update-btn {
  width: calc(100% - 40px);
  margin: 16px 20px;
  height: 44px;
  background: white;
  color: #4a7bff;
  border: 1px solid #4a7bff;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.check-update-btn:active {
  background: #f0f5ff;
}

/* 退出登录按钮 */
.logout-btn {
  width: calc(100% - 32px);
  margin: 16px;
  height: 44px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:active {
  background: #ff7875;
}

/* 成功提示 */
.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
}

.success-icon {
  width: 20px;
  height: 20px;
  background: #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
</style>