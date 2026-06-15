import http from '@/utils/http.js';
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
  // 查询会场网络质量
  async getNetworkQuality(scheduleId) {
    return await http.get(`/api/teacher/meeting/control/${scheduleId}/network-quality`);
  },
  // 查询当前会场会控信息
  async controlInfo(scheduleId, params) {
    return await http.get(`/api/teacher/meeting/control/${scheduleId}/control-info`, params);
  },
  // 邀请所有未入会者
  async inviteAbsentees(scheduleId) {
    return await http.post(`/api/teacher/meeting/control/${scheduleId}/invite-absentees`);
  },
  // 邀请个人会场终端入会
  async invitePersonal(scheduleId, params) {
    return await http.post2(`/api/teacher/meeting/control/${scheduleId}/invite-personal`, params);
  },
  // 结束所有互动
  async endAllInteractions(scheduleId) {
    return await http.post(`/api/teacher/meeting/control/${scheduleId}/end-interaction`);
  },
  // 辅讲端退出课堂
  async assistantExit(scheduleId, params) {
    return await http.post2(`/api/teacher/meeting/control/${scheduleId}/assistant-exit`, params);
  },
  // 播放主讲共享和视频画面
  async playShareAndVideo(scheduleId, params) {
    return await http.post2(`/api/teacher/meeting/control/${scheduleId}/play-share-and-video`, params);
  },
};
