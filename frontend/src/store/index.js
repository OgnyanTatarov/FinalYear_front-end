import { createStore } from 'vuex';
import { fetchCourses } from '../services/api';

// Helper functions for localStorage
const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const loadState = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

const store = createStore({
  state: {
    // Define your application's state
    courses: loadState('courses') || [],
    deadlines: loadState('deadlines') || [],
    userInfo: loadState('userInfo') || {
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
      saveState('courses', courses);
    },
    setDeadlines(state, deadlines) {
      state.deadlines = deadlines;
      saveState('deadlines', deadlines);
    },
    setUserInfo(state, userInfo){
      state.userInfo = userInfo;
      saveState('userInfo', userInfo);
    },
    clearUserInfo(state){
      state.userInfo = {
        userId: null,
        name: "",
        username: "",
        email: "",
        role: "",
      };
      // Clear all stored data
      localStorage.removeItem('userInfo');
      localStorage.removeItem('courses');
      localStorage.removeItem('deadlines');
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
      // Clear all user-related state
      commit('clearUserInfo');
      // You could also clear other state if needed
      commit('setCourses', []);
      commit('setDeadlines', []);
    },
    async refreshCourses({ commit }, { userId, page }) {
      try {
        const coursesData = await fetchCourses(userId, page);
        commit('setCourses', coursesData);
        return coursesData;
      } catch (error) {
        console.error('Error refreshing courses:', error);
        throw error;
      }
    }
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
