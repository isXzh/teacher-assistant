<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
          <div class="logo-icon">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C7.867 6.253 7 7.168 7 8.25v13c0-1.083.867-1.997 2-1.997h10c1.133 0 2-.914 2-1.997V8.25c0-1.082-.867-1.997-2-1.997z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.5 12a7.5 7.5 0 017.5 0 7.5 7.5 0 01-7.5 0m0 0a9 9 0 119 0 9 9 0 01-9 0"
              ></path>
            </svg>
          </div>
          <h1 class="app-title">兴图教学助手</h1>
          <p class="app-subtitle">教师助手登录</p>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label class="form-label">账号</label>
            <div class="input-wrapper">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                ></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input v-model="username" type="text" class="form-input" placeholder="请输入教师工号/手机号" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </svg>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请输入密码"
                @keydown.enter="handleLogin"
              />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm4 8a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C7.022 7.022 7.022 12 2.458 12z"
                  ></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11 8z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <button class="login-button" :disabled="loading" @click="handleLogin">
            <div v-if="loading" class="loading-spinner"></div>
            <span v-else>登录</span>
          </button>

          <div class="forgot-password">
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>
        </div>
      </div>

      <div class="copyright">© 2026 兴图新科 版权所有</div>
    </div>
  </div>
</template>

<script>
  import auth from '@/api/auth';

  export default {
    name: 'Login',
    data() {
      return {
        username: '',
        password: '',
        showPassword: false,
        loading: false,
      };
    },
    methods: {
      handleLogin() {
        // this.$router.push("/");
        this.loading = true;
        // console.log(
        //   "==========",
        //   auth.login({
        //     username: this.loginForm.username,
        //     password: this.loginForm.password,
        //   })
        // );

        auth
          .login({
            username: this.username,
            password: this.password,
            userType: 'teacher',
          })
          .then(response => {
            this.loading = false;
            if (response.code == 200) {
              sessionStorage.setItem('accessToken', response.data.accessToken);
              sessionStorage.setItem('refreshToken', response.data.refreshToken);

              this.$message.success('登录成功');
              this.$router.push({ path: '/main' });
            } else {
              this.$message.error(response.message || '登录失败');
            }
          })
          .catch(error => {
            this.loading = false;
            this.$message.error(error.message || '登录失败');
          });
      },
    },
  };
</script>

<style scoped>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
  }

  .login-container {
    width: 100%;
    max-width: 1280px;
    height: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .login-card {
    background: white;
    border-radius: 24px;
    width: 400px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
  }

  .logo-icon {
    width: 64px;
    height: 64px;
    background: #1e88e5;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .logo-icon svg {
    color: white;
  }

  .app-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e88e5;
    margin: 0 0 8px 0;
  }

  .app-subtitle {
    font-size: 16px;
    color: #9ca3af;
    margin: 0;
  }

  .form-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 12px;
    width: 20px;
    height: 20px;
    color: #9ca3af;
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    height: 44px;
    padding: 0 44px 0 44px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s ease;
    outline: none;
  }

  .form-input:focus {
    border-color: #1e88e5;
    box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
  }

  .form-input::placeholder {
    color: #9ca3af;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s ease;
  }

  .password-toggle:hover {
    color: #6b7280;
  }

  .login-button {
    width: 100%;
    height: 44px;
    background: #1e88e5;
    color: white;
    border: none;
    border-radius: 9999px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-button:hover:not(:disabled) {
    background: #1976d2;
  }

  .login-button:active:not(:disabled) {
    background: #1565c0;
  }

  .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .forgot-password {
    text-align: center;
  }

  .forgot-link {
    font-size: 14px;
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .forgot-link:hover {
    color: #1e88e5;
  }

  .copyright {
    position: absolute;
    bottom: 32px;
    font-size: 12px;
    color: #9ca3af;
  }
</style>
