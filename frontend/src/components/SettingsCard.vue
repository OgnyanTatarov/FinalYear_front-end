<template>
  <div class="settings-card">
    <div class="settings-header">
      <div class="user-profile">
        <div class="avatar-container">
          <div class="avatar">
            <svg v-if="!userImage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <img v-else :src="userImage" alt="Profile" @error="handleImageError" />
          </div>
          <button class="upload-btn" @click="triggerFileUpload">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload Photo
          </button>
          <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="hidden" />
        </div>
        <div class="user-info">
          <h2>{{ userInfo.username }}</h2>
          <p>{{ userInfo.email }}</p>
          <span class="up-number">{{ userInfo.up_number }}</span>
        </div>
      </div>
    </div>

    <div class="settings-sections">
      <!-- Account Settings -->
      <div class="settings-section">
        <h3>Account Settings</h3>
        <div class="settings-form">
          <div class="form-group">
            <label>Username</label>
            <input type="text" v-model="formData.username" placeholder="Enter username" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="formData.email" placeholder="Enter email" />
          </div>
          <div class="form-group">
            <label>UP Number</label>
            <input type="text" v-model="formData.up_number" placeholder="Enter UP number" disabled />
          </div>
        </div>
      </div>

      <!-- Preferences -->
      <div class="settings-section">
        <h3>Preferences</h3>
        <div class="preferences-list">
          <div class="preference-item">
            <div class="preference-info">
              <span class="preference-label">Email Notifications</span>
              <span class="preference-description">Receive email notifications for deadlines</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="preferences.emailNotifications">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="preference-item">
            <div class="preference-info">
              <span class="preference-label">Dark Mode</span>
              <span class="preference-description">Switch between light and dark theme</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="preferences.darkMode">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Security -->
      <div class="settings-section">
        <h3>Security</h3>
        <div class="settings-form">
          <div class="form-group">
            <label>Current Password</label>
            <input type="password" v-model="formData.currentPassword" placeholder="Enter current password" />
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" v-model="formData.newPassword" placeholder="Enter new password" />
          </div>
          <div class="form-group">
            <label>Confirm New Password</label>
            <input type="password" v-model="formData.confirmPassword" placeholder="Confirm new password" />
          </div>
        </div>
      </div>
    </div>

    <div class="settings-actions">
      <button class="save-btn" @click="saveSettings" :disabled="isLoading">
        <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        <span class="loading-spinner" v-else></span>
        {{ isLoading ? 'Saving...' : 'Save Changes' }}
      </button>
      <button class="cancel-btn" @click="resetForm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        Reset Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save-settings']);
const store = useStore();
const toast = useToast();
const fileInput = ref(null);
const userImage = ref(null);

const userInfo = computed(() => store.getters.getUserInfo);

const formData = reactive({
  username: userInfo.value.username || '',
  email: userInfo.value.email || '',
  up_number: userInfo.value.up_number || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const preferences = reactive({
  emailNotifications: true,
  darkMode: false
});

const handleImageError = () => {
  userImage.value = null;
};

const triggerFileUpload = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      userImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const saveSettings = async () => {
  try {
    // Validate password change
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      if (!formData.currentPassword) {
        toast.error('Current password is required to change password');
        return;
      }
    }

    // Emit settings data
    emit('save-settings', {
      ...formData,
      preferences,
      profileImage: userImage.value
    });
  } catch (error) {
    toast.error('Failed to save settings');
    console.error('Settings save error:', error);
  }
};

const resetForm = () => {
  // Reset form to initial values
  formData.username = userInfo.value.username || '';
  formData.email = userInfo.value.email || '';
  formData.currentPassword = '';
  formData.newPassword = '';
  formData.confirmPassword = '';
  userImage.value = null;
  preferences.emailNotifications = true;
  preferences.darkMode = false;
};
</script>

<style scoped>
.settings-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.settings-header {
  margin-bottom: 2rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar svg {
  width: 60px;
  height: 60px;
  color: #64748b;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.upload-btn svg {
  width: 16px;
  height: 16px;
}

.hidden {
  display: none;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.user-info p {
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.up-number {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f1f5f9;
  border-radius: 999px;
  font-size: 0.875rem;
  color: #64748b;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
}

.settings-section h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.preferences-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.preference-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preference-label {
  font-weight: 500;
  color: #1e293b;
}

.preference-description {
  font-size: 0.875rem;
  color: #64748b;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: #3b82f6;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.settings-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.save-btn, .cancel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn {
  background: #3b82f6;
  color: white;
  flex: 1;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
}

.cancel-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.save-btn svg, .cancel-btn svg {
  width: 18px;
  height: 18px;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .settings-card {
    padding: 1.5rem;
  }

  .user-profile {
    flex-direction: column;
    text-align: center;
  }

  .settings-actions {
    flex-direction: column;
  }

  .save-btn, .cancel-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 