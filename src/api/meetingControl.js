import http from "@/utils/http.js";
// 教师端-会控
export default {
  // 单与会人禁麦/解除
  async muteParticipant(scheduleId, participantId, data) {
    return await http.put2(`/api/teacher/meeting/control/${scheduleId}/mute/${participantId}`, data);
  },
  // 设置与会人举手-放下手状态
  async setHandRaise(scheduleId, participantId, data) {
    return await http.put2(`/api/teacher/meeting/control/${scheduleId}/hands/${participantId}`, data);
  },
  // 全员禁麦/解除
  async muteAll(scheduleId, data) {
    return await http.put2(`/api/teacher/meeting/control/${scheduleId}/mute-all`, data);
  },
  // 设置自定义画面
  async setCustomPicture(scheduleId, data) {
    return await http.put2(`/api/teacher/meeting/control/${scheduleId}/custom-picture`, data);
  },
  // 断开WebSocket连接
  async disconnectWebSocket(scheduleId) {
    return await http.post(`/api/teacher/meeting/control/${scheduleId}/disconnect`);
  },
  // 建立WebSocket连接
  async connectWebSocket(scheduleId, hostPwd) {
    return await http.post(`/api/teacher/meeting/control/${scheduleId}/connect`, null, { params: { hostPwd } });
  },
  // 获取会议实时信息
  async getRealTimeInfo(scheduleId) {
    return await http.get(`/api/teacher/meeting/control/${scheduleId}/realtime-info`);
  },
  // 检查WebSocket连接状态
  async getConnectionStatus(scheduleId) {
    return await http.get(`/api/teacher/meeting/control/${scheduleId}/connection-status`);
  },
  // 获取辅讲教室信息及在线状态
  async getAuxClassrooms(scheduleId) {
    return await http.get(`/api/teacher/meeting/control/${scheduleId}/aux-classrooms`);
  },
};
