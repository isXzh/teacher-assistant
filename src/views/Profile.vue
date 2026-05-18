<template>
  <div class="profile-page">
    <!-- 用户头部 -->
    <div class="user-header">
      <div class="header-content">
        <div class="user-avatar-large">{{ userNameFirstChar }}</div>
        <div class="user-info">
          <h2 class="user-name">{{ userProfile.name }}</h2>
          <p class="user-detail">{{ userProfile.jobNumber }} · {{ userProfile.school }} · {{ userProfile.organization }}</p>
        </div>
      </div>
    </div>

    <div class="page-body">
      <!-- 标签页 -->
      <div class="profile-tabs">
        <div class="tabs-header">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-item"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="tab.id === 'basic'" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle v-if="tab.id === 'basic'" cx="12" cy="7" r="4"></circle>
              <path v-if="tab.id === 'security'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path v-if="tab.id === 'notification'" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path v-if="tab.id === 'notification'" d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              <circle v-if="tab.id === 'about'" cx="12" cy="12" r="10"></circle>
              <line v-if="tab.id === 'about'" x1="12" y1="16" x2="12" y2="12"></line>
              <line v-if="tab.id === 'about'" x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>{{ tab.name }}</span>
            <div v-if="activeTab === tab.id" class="tab-indicator"></div>
          </button>
        </div>

        <div class="tabs-content">
          <!-- 基本资料 -->
          <div v-if="activeTab === 'basic'" class="tab-panel">
            <div class="section">
              <h3 class="section-title">基本信息</h3>
              <div class="form-grid">
                <div class="form-field">
                  <label class="field-label">姓名</label>
                  <input type="text" :value="userProfile.name" class="field-input readonly" readonly />
                </div>
                <div class="form-field">
                  <label class="field-label">工号</label>
                  <input type="text" :value="userProfile.jobNumber" class="field-input readonly" readonly />
                </div>
              </div>
            </div>

            <div class="section">
              <h3 class="section-title">教学信息</h3>
              <div class="form-grid">
                <div class="form-field">
                  <label class="field-label">学校</label>
                  <input type="text" :value="userProfile.school" class="field-input info" readonly />
                </div>
                <div class="form-field">
                  <label class="field-label">学段</label>
                  <input type="text" :value="userProfile.schoolLevel" class="field-input info" readonly />
                </div>
                <div class="form-field">
                  <label class="field-label">学科</label>
                  <input type="text" :value="userProfile.subject" class="field-input info" readonly />
                </div>
                <div class="form-field">
                  <label class="field-label">班级</label>
                  <input type="text" :value="userProfile.classes.join('、')" class="field-input info" readonly />
                </div>
              </div>
            </div>

            <div class="section">
              <h3 class="section-title">联系方式</h3>
              <div class="form-grid">
                <div class="form-field">
                  <label class="field-label">手机号</label>
                  <input type="text" :value="userProfile.phone" class="field-input readonly" readonly />
                </div>
                <div class="form-field">
                  <label class="field-label">邮箱</label>
                  <input type="text" :value="userProfile.email" class="field-input readonly" readonly />
                </div>
              </div>
            </div>
          </div>

          <!-- 安全设置 -->
          <div v-if="activeTab === 'security'" class="tab-panel">
            <div class="security-card">
              <h3 class="section-title">修改密码</h3>
              <p class="section-desc">定期修改密码可以保护账号安全</p>
              <div class="form-stack">
                <div class="form-field">
                  <label class="field-label">原密码</label>
                  <input v-model="passwordForm.oldPassword" type="password" class="field-input" placeholder="请输入原密码" />
                </div>
                <div class="form-field">
                  <label class="field-label">新密码</label>
                  <input v-model="passwordForm.newPassword" type="password" class="field-input" placeholder="请输入新密码（至少8位）" />
                </div>
                <div class="form-field">
                  <label class="field-label">确认新密码</label>
                  <input v-model="passwordForm.confirmPassword" type="password" class="field-input" placeholder="请再次输入新密码" />
                </div>
                <button class="submit-btn" @click="handleSavePassword">确认修改</button>
              </div>
            </div>
            <div class="hint-card">
              <svg class="hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <div>
                <p class="hint-title">安全提示</p>
                <p class="hint-text">退出登录功能已移至右上角用户菜单，点击您的姓名即可访问</p>
              </div>
            </div>
          </div>

          <!-- 通知设置 -->
          <div v-if="activeTab === 'notification'" class="tab-panel">
            <div class="notification-list">
              <div
                v-for="item in notificationItems"
                :key="item.key"
                class="notification-item"
              >
                <div class="notification-content">
                  <div class="notification-title">{{ item.label }}</div>
                  <div class="notification-desc">{{ item.desc }}</div>
                </div>
                <div
                  class="toggle-switch"
                  :class="{ active: notifications[item.key] }"
                  @click="toggleNotification(item.key)"
                >
                  <div class="toggle-slider"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 关于 -->
          <div v-if="activeTab === 'about'" class="tab-panel about-panel">
            <div class="about-content">
              <div class="about-logo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 class="about-name">兴图教学助手</h3>
              <p class="about-desc">智慧教育云平台</p>
              <p class="about-version">版本 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import auth from '@/api/auth';
  import profile from '@/api/profile';

  export default {
    name: 'Profile',
    data() {
      return {
        activeTab: 'basic',
        tabs: [
          { id: 'basic', name: '基本资料' },
          { id: 'security', name: '安全设置' },
          { id: 'notification', name: '通知设置' },
          { id: 'about', name: '关于' },
        ],
        userProfile: {
          name: '张老师',
          jobNumber: 'T20240001',
          phone: '138****8888',
          email: 'zhang.teacher@example.com',
          school: '兴图中学',
          schoolLevel: '高中',
          subject: '计算机科学',
          classes: ['高一1班', '高一2班', '高二3班'],
          organization: '计算机教研组',
        },
        passwordForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
        notifications: {
          classReminder: true,
          interactionNotice: true,
          systemNotice: false,
          deviceAlert: true,
        },
        notificationItems: [
          { key: 'classReminder', label: '课程提醒', desc: '上课前15分钟提醒' },
          { key: 'interactionNotice', label: '互动通知', desc: '学生互动消息通知' },
          { key: 'systemNotice', label: '系统通知', desc: '系统更新和维护通知' },
          { key: 'deviceAlert', label: '设备告警', desc: '设备异常状态提醒' },
        ],
      };
    },
    computed: {
      userNameFirstChar() {
        return this.userProfile.name.charAt(0);
      },
    },
    mounted() {
      this.fetchProfileInfo();
    },
    methods: {
      async fetchProfileInfo() {
        try {
          const res = await profile.getProfileInfo();
          if (res && res.data) {
            const data = res.data;
            this.userProfile = {
              ...this.userProfile,
              name: data.teacherName || this.userProfile.name,
              jobNumber: data.teacherCode || this.userProfile.jobNumber,
              phone: data.phone || this.userProfile.phone,
              email: data.email || this.userProfile.email,
              schoolLevel: data.stageName || this.userProfile.schoolLevel,
              organization: data.orgName || this.userProfile.organization,
            };
          }
        } catch (error) {
          console.error('获取个人资料失败:', error);
        }
      },
      async handleSavePassword() {
        if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
          this.$message.error('两次输入的密码不一致');
          return;
        }
        try {
          await this.$confirm('是否确定修改密码?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          });
          const res = await profile.updatePassword({
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword,
            confirmPassword: this.passwordForm.confirmPassword,
          });
          this.$message.success('修改成功');
          this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
        } catch (error) {
          if (error !== 'cancel') {
            console.error('修改密码失败:', error);
            this.$message.error(error.message || '修改密码失败，请重试');
          }
        }
      },
      toggleNotification(key) {
        this.notifications[key] = !this.notifications[key];
      },
    },
  };
</script>

<style scoped>
  .profile-page {
    min-height: 100%;
    background: #F5F7FA;
    padding-bottom: 40px;
  }

  /* 用户头部 */
  .user-header {
    background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
    padding: 32px 24px;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .user-avatar-large {
    width: 72px;
    height: 72px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .user-name {
    font-size: 22px;
    font-weight: 700;
    color: white;
    margin: 0 0 6px 0;
  }

  .user-detail {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  /* 页面主体 */
  .page-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 24px;
  }

  /* 标签页 */
  .profile-tabs {
    background: white;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    overflow: hidden;
  }

  .tabs-header {
    display: flex;
    border-bottom: 1px solid #f0f0f0;
    overflow-x: auto;
  }

  .tab-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 20px;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    color: #888;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tab-item:hover {
    color: #555;
  }

  .tab-item.active {
    color: #1E88E5;
  }

  .tab-icon {
    width: 16px;
    height: 16px;
  }

  .tab-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #1E88E5;
  }

  .tabs-content {
    padding: 24px;
  }

  /* 内容面板 */
  .tab-panel {
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .section {
    margin-bottom: 28px;
  }

  .section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
  }

  .section-desc {
    font-size: 13px;
    color: #888;
    margin: -8px 0 16px 0;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 24px;
  }

  .form-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-size: 13px;
    font-weight: 500;
    color: #555;
  }

  .field-input {
    width: 100%;
    height: 42px;
    padding: 0 14px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    color: #333;
    background: white;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .field-input:focus {
    border-color: #1E88E5;
    box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
  }

  .field-input.readonly {
    background: #f8f8f8;
    color: #888;
  }

  .field-input.info {
    background: rgba(30, 136, 229, 0.04);
    color: #666;
    border-color: #e8e8e8;
  }

  .submit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 24px;
    background: #1E88E5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-start;
  }

  .submit-btn:hover {
    background: #1565C0;
  }

  /* 安全设置卡片 */
  .security-card {
    background: #F8FAFC;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 16px;
  }

  .hint-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: #FFF8E1;
    border-radius: 12px;
    border: 1px solid #FFECB3;
  }

  .hint-card .hint-icon {
    width: 20px;
    height: 20px;
    color: #F9A825;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .hint-title {
    font-size: 13px;
    font-weight: 600;
    color: #F57F17;
    margin: 0 0 4px 0;
  }

  .hint-text {
    font-size: 12px;
    color: #F9A825;
    margin: 0;
  }

  /* 通知设置 */
  .notification-list {
    display: flex;
    flex-direction: column;
  }

  .notification-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid #f5f5f5;
  }

  .notification-item:last-child {
    border-bottom: none;
  }

  .notification-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }

  .notification-desc {
    font-size: 13px;
    color: #999;
  }

  .toggle-switch {
    width: 44px;
    height: 24px;
    background: #ddd;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s ease;
    flex-shrink: 0;
  }

  .toggle-switch.active {
    background: #1E88E5;
  }

  .toggle-slider {
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }

  .toggle-switch.active .toggle-slider {
    transform: translateX(20px);
  }

  /* 关于页面 */
  .about-panel {
    text-align: center;
    padding: 40px 20px;
  }

  .about-logo {
    width: 64px;
    height: 64px;
    background: #1E88E5;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: white;
  }

  .about-logo svg {
    width: 32px;
    height: 32px;
  }

  .about-name {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 0 0 6px 0;
  }

  .about-desc {
    font-size: 14px;
    color: #888;
    margin: 0 0 4px 0;
  }

  .about-version {
    font-size: 13px;
    color: #bbb;
    margin: 0;
  }

  /* 响应式适配 */
  @media (max-width: 768px) {
    .user-header {
      padding: 24px 16px;
    }

    .header-content {
      flex-direction: column;
      text-align: center;
      gap: 16px;
    }

    .page-body {
      padding: 12px 16px;
    }

    .tabs-content {
      padding: 16px;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .tab-item {
      padding: 12px 14px;
      font-size: 13px;
    }
  }
</style>
