import http from '@/utils/http.js';
// 今日课堂
export default {
  // 获取今日课程列表
  async getTodayCoures() {
    return await http.get('/api/teacher/home/today-courses');
  },
  // 进入课堂
  async enterClassroom(scheduleId) {
    return await http.post2(`/api/teacher/home/enter-classroom/${scheduleId}`);
  },
  // 下课
  async exitClassroom(scheduleId) {
    return await http.post2(`/api/teacher/home/exit-classroom/${scheduleId}`);
  },
  // 获取会议实时信息
  async realtimeInfo(scheduleId) {
    return await http.get(`/api/teacher/meeting/control/${scheduleId}/realtime-info`);
  },
};
