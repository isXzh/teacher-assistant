import http from "@/utils/http.js";
// 教师端-我的
export default {
  // 修改密码
  async updatePassword(data) {
    return await http.post("/api/teacher/profile/password", data);
  },
};
