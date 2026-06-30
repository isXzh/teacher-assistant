import http from '@/utils/http.js';
// 教师端-通知消息
export default {
  // 排课预告：查询当前教师明日课程并生成预告消息
  async schedulePreview() {
    return await http.post2('/api/teacher/notice/schedule-preview');
  },
  // 标记单条消息为已读
  async markRead(id) {
    return await http.post2(`/api/teacher/notice/read/${id}`);
  },
  // 标记本人全部消息为已读
  async markAllRead() {
    return await http.post2('/api/teacher/notice/read-all');
  },
  // 分页查询本人通知消息
  async page(data) {
    return await http.post('/api/teacher/notice/page', data);
  },
  // 获取消息详情
  async getById(id) {
    return await http.get(`/api/teacher/notice/${id}`);
  },
  // 统计本人未读消息数量
  async unreadCount() {
    return await http.get('/api/teacher/notice/unread-count');
  },
  async deleteByIds(ids) {
    return await http.delete2('/api/teacher/notice/batch', ids);
  },
};
