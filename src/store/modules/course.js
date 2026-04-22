import homeApi from '@/api/home'

export default {
  namespaced: true,
  state: {
    todayCourses: [],
    currentCourse: null,
    courseLoading: false
  },
  mutations: {
    SET_TODAY_COURSES(state, courses) {
      state.todayCourses = courses
    },
    SET_CURRENT_COURSE(state, course) {
      state.currentCourse = course
    },
    SET_COURSE_LOADING(state, loading) {
      state.courseLoading = loading
    },
    UPDATE_COURSE_STATUS(state, { courseId, status }) {
      const course = state.todayCourses.find(c => c.id === courseId)
      if (course) {
        course.status = status
      }
    }
  },
  actions: {
    async fetchTodayCourses({ commit }) {
      commit('SET_COURSE_LOADING', true)
      try {
        const response = await homeApi.getTodayCoures()
        const courses = response.data
          .filter(course => course.controlStatus !== 0)
          .map(course => {
            return {
              id: course.id,
              name: course.courseName,
              time: course.periodTimeRange,
              period: course.periodName,
              classroom: course.classroomName,
              teacher: course.teacherName,
              status: course.controlStatusName || '未开始',
              canEnterEarly: course.controlStatus === 2
            }
          })
        commit('SET_TODAY_COURSES', courses)
        return courses
      } catch (error) {
        console.error('获取今日课程失败:', error)
        throw error
      } finally {
        commit('SET_COURSE_LOADING', false)
      }
    },
    setCurrentCourse({ commit }, course) {
      commit('SET_CURRENT_COURSE', course)
    }
  },
  getters: {
    getTodayCourses: state => state.todayCourses,
    getCurrentCourse: state => state.currentCourse,
    getCourseLoading: state => state.courseLoading,
    getInProgressCourses: state => state.todayCourses.filter(c => c.status === '进行中'),
    getUpcomingCourses: state => state.todayCourses.filter(c => c.status === '可提前入会' || c.status === '未到上课时间')
  }
}
