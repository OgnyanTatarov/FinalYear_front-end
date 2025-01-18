import { createStore } from 'vuex';

const store = createStore({
  state: {
    // Define your application's state
    courses: [],
    deadlines: [],
  },
  mutations: {
    // Define mutation methods to update state
    setCourses(state, courses) {
      state.courses = courses;
    },
    setDeadlines(state, deadlines) {
      state.deadlines = deadlines;
    },
  },
  actions: {
    // Define actions to perform asynchronous tasks
    fetchCourses({ commit }) {
      // Example API call to fetch courses
      const sampleCourses = [
        { id: 1, name: 'Course 1', admin: 'Admin 1' },
        { id: 2, name: 'Course 2', admin: 'Admin 2' },
      ];
      commit('setCourses', sampleCourses);
    },
    fetchDeadlines({ commit }) {
      // Example API call to fetch deadlines
      const sampleDeadlines = [
        { id: 1, title: 'Assignment 1', due: '2025-01-15' },
        { id: 2, title: 'Assignment 2', due: '2025-01-20' },
      ];
      commit('setDeadlines', sampleDeadlines);
    },
  },
  getters: {
    // Define getters to access state
    getCourses(state) {
      return state.courses;
    },
    getDeadlines(state) {
      return state.deadlines;
    },
  },
});

export default store;
