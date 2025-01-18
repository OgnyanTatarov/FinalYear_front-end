import { createStore } from 'vuex';

const store = createStore({
  state: {
    // Define your application's state
    courses: [],
    deadlines: [],
    userInfo: {
      userId: null,
      name: "",
      username: "",
      email: "",
      role: "",
    },
  },
  mutations: {
    // Define mutation methods to update state
    setCourses(state, courses) {
      state.courses = courses;
    },
    setDeadlines(state, deadlines) {
      state.deadlines = deadlines;
    },
    setUserInfo(state, userInfo){
      // state.userInfo.userId = userInfo.userId;
      // state.userInfo.name = userInfo.name;
      // state.userInfo.username = userInfo.username;
      // state.userInfo.email = userInfo.email;
      // state.userInfo.role = userInfo.role;
      state.userInfo = userInfo;
    },
    clearUserId(state){
      state.userInfo = {
        userId: null,
        username: '',
        email: '',
        role: '',
      };
    },
  },
  actions: {
    // Define actions to perform asynchronous tasks
    fetchCourses({ commit }) {
    
    },
    fetchDeadlines({ commit }) {

    },

    login({ commit }, userInfo) {
      commit('setUserInfo', userInfo); // Save user info on login
    },
    logout({ commit }) {
      commit('clearUserInfo'); // Clear user info on logout
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
    getUserInfo(state) {
      return state.userInfo; // Return the full user info object
    },
    getUserId(state) {
      return state.userInfo.userId; // Return the user ID
    },
    getUserName(state) {
      return state.userInfo.username; // Return the user's name
    },
    getUserEmail(state) {
      return state.userInfo.email; // Return the user's email
    },
    getUserRole(state) {
      return state.userInfo.role; // Return the user's role
    },
  },
});

export default store;
