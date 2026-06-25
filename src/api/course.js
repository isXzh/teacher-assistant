import http from '@/utils/http.js';
// 调课
export default {
  // 申请调课
  async applyCourseAdjustment(data) {
    return await http.post('/api/teacher/course-adjustment/apply', data);
  },
  // 根据学段查询全部课时
  async listPeriods(stageId) {
    return await http.get('/api/base/period/list', { stageId });
  },
  // 查询所有教师
  async listTeachers() {
    return await http.get('/api/base/teacher/list');
  },
  // 我的调课申请
  async myList() {
    return await http.get2('/api/teacher/course-adjustment/my-list');
  },
  // 撤回调课申请
  async withdraw(adjustmentId) {
    return await http.post2(`/api/teacher/course-adjustment/withdraw/${adjustmentId}`);
  },
};
