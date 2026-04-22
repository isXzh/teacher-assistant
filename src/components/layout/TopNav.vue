<template>
  <div class="top-nav">
    <div class="nav-left">
      <button v-if="showBack" class="back-button" @click="handleBack">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
        <span>{{ backText }}</span>
      </button>
    </div>

    <div class="nav-center">
      <h1 class="nav-title">{{ title }}</h1>
    </div>

    <div class="nav-right">
      <slot name="right"></slot>
      <el-button round :loading="loading" @click="handleRefresh"> 刷新 </el-button>
      <button v-if="showLogout" class="logout-button" @click="handleLogout" title="退出登录">
        退出登录
        <!-- <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4 4m4-4h12m-2 0v6m-2 0h-2"></path>
        </svg> -->
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TopNav',
    props: {
      title: {
        type: String,
        default: '',
      },
      showBack: {
        type: Boolean,
        default: false,
      },
      backText: {
        type: String,
        default: '返回',
      },
      showLogout: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      handleBack() {
        this.$emit('back');
      },
      handleLogout() {
        this.$emit('logout');
      },
      handleRefresh() {
        this.$emit('refresh');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .top-nav {
    height: 56px;
    background: #1a237e;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .nav-left {
    display: flex;
    align-items: center;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: color 0.2s ease;
  }

  .back-button:hover {
    color: rgba(255, 255, 255, 0.8);
  }

  .nav-center {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .nav-title {
    font-size: 18px;
    font-weight: 500;
    color: white;
    margin: 0;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .logout-button {
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
    background-image: url('@/assets/logout.png');
    background-size: cover;
    background-position: center;
  }

  .logout-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
