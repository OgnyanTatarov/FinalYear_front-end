import {
  getUserSettings,
  updateUserSettings,
  uploadProfileImage
} from '@/services/settings.service';

const state = {
  settings: null,
  loading: false,
  error: null
};

const getters = {
  userSettings: state => state.settings,
  isLoading: state => state.loading,
  hasError: state => !!state.error,
  errorMessage: state => state.error
};

const actions = {
  async fetchUserSettings({ commit }, userId) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      const settings = await getUserSettings(userId);
      commit('SET_SETTINGS', settings);
    } catch (error) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateSettings({ commit }, payload) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      const updatedSettings = await updateUserSettings(payload);
      commit('SET_SETTINGS', updatedSettings);
      return true;
    } catch (error) {
      commit('SET_ERROR', error.message);
      return false;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async uploadProfileImage({ commit }, { userId, imageFile }) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      const response = await uploadProfileImage(userId, imageFile);
      commit('UPDATE_PROFILE_IMAGE', response.imageUrl);
      return response.imageUrl;
    } catch (error) {
      commit('SET_ERROR', error.message);
      return null;
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const mutations = {
  SET_SETTINGS(state, settings) {
    state.settings = settings;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  UPDATE_PROFILE_IMAGE(state, imageUrl) {
    if (state.settings) {
      state.settings.profileImage = imageUrl;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 