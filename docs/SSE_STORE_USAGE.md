# SSE Store 使用说明

## 概述

SSE (Server-Sent Events) 模块已经封装在 Vuex store 中，提供了全局的 SSE 连接管理和事件监听功能。

## 基本使用

### 1. 初始化 SSE 连接

在需要建立 SSE 连接的页面（如课堂页面）中初始化：

```javascript
async mounted() {
  const scheduleId = this.$route.params.courseId;
  try {
    await this.$store.dispatch('sse/initSSE', scheduleId);
    console.log('SSE连接已初始化');
  } catch (error) {
    console.error('SSE连接初始化失败:', error);
  }
}
```

### 2. 监听 SSE 事件

在组件中添加事件监听器：

```javascript
mounted() {
  const eventHandler = (event) => {
    console.log('收到事件:', event);
    const data = JSON.parse(event.data);
  };

  this.$store.dispatch('sse/addEventListener', {
    event: 'eventName',
    handler: eventHandler
  });
}
```

### 3. 移除事件监听器

在组件销毁时移除监听器：

```javascript
beforeDestroy() {
  const eventHandler = (event) => {
    console.log('收到事件:', event);
  };

  this.$store.dispatch('sse/removeEventListener', {
    event: 'eventName',
    handler: eventHandler
  });
}
```

### 4. 监听通用消息

```javascript
mounted() {
  const sseClient = this.$store.getters['sse/getSseClient'];
  if (sseClient) {
    sseClient.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('收到通用消息:', data);
    };
  }
}
```

### 5. 关闭 SSE 连接

在退出课堂或需要关闭连接时：

```javascript
methods: {
  handleEndClass() {
    this.$store.dispatch('sse/closeSSE');
  }
}
```

## Store 状态

可以通过以下方式获取 SSE 状态：

```javascript
computed: {
  isSseConnected() {
    return this.$store.getters['sse/isSseConnected'];
  },
  sseClient() {
    return this.$store.getters['sse/getSseClient'];
  }
}
```

## 常用事件类型

- `participants`: 参与者更新事件
- `confDynamicInfo`: 会议动态信息更新事件
- 其他自定义事件类型

## 注意事项

1. SSE 连接需要 `scheduleId` 参数，通常在进入课堂页面时从路由参数中获取
2. 组件销毁时应该移除事件监听器，但不需要关闭 SSE 连接（除非是下课）
3. SSE 连接由 store 统一管理，支持自动重连机制
4. 在任何页面都可以通过 store 访问 SSE 客户端并监听事件

## 示例：完整的监听器管理

```javascript
export default {
  data() {
    return {
      sseEventHandlers: {}
    };
  },
  async mounted() {
    const scheduleId = this.$route.params.courseId;
    await this.$store.dispatch('sse/initSSE', scheduleId);
    this.setupSSEEventListeners();
  },
  beforeDestroy() {
    this.removeSSEEventListeners();
  },
  methods: {
    setupSSEEventListeners() {
      this.sseEventHandlers.participants = (event) => {
        const data = JSON.parse(event.data);
        console.log('参与者更新:', data);
      };

      this.$store.dispatch('sse/addEventListener', {
        event: 'participants',
        handler: this.sseEventHandlers.participants
      });
    },
    removeSSEEventListeners() {
      this.$store.dispatch('sse/removeEventListener', {
        event: 'participants',
        handler: this.sseEventHandlers.participants
      });
      this.sseEventHandlers = {};
    }
  }
}
```