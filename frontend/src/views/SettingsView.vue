<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>Settings</h1>
      <p>Manage your account settings and preferences</p>
    </div>

    <div class="settings-content">
      <!-- Profile Section -->
      <div class="settings-section">
        <h2>Profile Information</h2>
        <div class="profile-image-container">
          <img :src="profileImage" alt="Profile" class="profile-image" />
          <button @click="triggerImageUpload" class="upload-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Change Photo
          </button>
          <input
            type="file"
            ref="imageInput"
            @change="handleImageUpload"
            accept="image/*"
            class="hidden-input"
          />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            :class="{ 'error': errors.username }"
          />
          <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            :class="{ 'error': errors.email }"
          />
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <button
          @click="saveProfileInfo"
          class="save-button"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Save Profile</span>
        </button>
      </div>

      <!-- Password Section -->
      <div class="settings-section">
        <h2>Password Management</h2>
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            v-model="passwordData.currentPassword"
            :class="{ 'error': errors.currentPassword }"
          />
          <span class="error-message" v-if="errors.currentPassword">{{ errors.currentPassword }}</span>
        </div>

        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            v-model="passwordData.newPassword"
            :class="{ 'error': errors.newPassword }"
          />
          <span class="error-message" v-if="errors.newPassword">{{ errors.newPassword }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="passwordData.confirmPassword"
            :class="{ 'error': errors.confirmPassword }"
          />
          <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
        </div>

        <button
          @click="updatePassword"
          class="save-button"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Update Password</span>
        </button>
      </div>

      <!-- Preferences Section -->
      <div class="settings-section">
        <h2>Preferences</h2>
        <div class="preference-item">
          <label class="toggle-switch">
            <input
              type="checkbox"
              v-model="preferences.emailNotifications"
            />
            <span class="toggle-slider"></span>
          </label>
          <span>Email Notifications</span>
        </div>

        <div class="preference-item">
          <label class="toggle-switch">
            <input
              type="checkbox"
              v-model="preferences.darkMode"
            />
            <span class="toggle-slider"></span>
          </label>
          <span>Dark Mode</span>
        </div>

        <button
          @click="savePreferences"
          class="save-button"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Save Preferences</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import { getUserSettings, updateUserSettings, uploadProfileImage } from '@/services/settings.service';

const store = useStore();
const toast = useToast();
const imageInput = ref(null);
const defaultProfileImage = '/default-profile.png';
const isLoading = ref(false);

const errors = reactive({
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const formData = reactive({
  username: '',
  email: ''
});

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const preferences = reactive({
  emailNotifications: false,
  theme: 'light'
});

const validateForm = () => {
  let isValid = true;
  errors.username = '';
  errors.email = '';

  if (!formData.username || formData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters long';
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }

  return isValid;
};

const validatePassword = () => {
  let isValid = true;
  errors.currentPassword = '';
  errors.newPassword = '';
  errors.confirmPassword = '';

  if (passwordData.newPassword || passwordData.confirmPassword || passwordData.currentPassword) {
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
  }

  return isValid;
};

const profileImage = computed(() => {
  const user = store.state.auth?.user;
  return user?.profile_image || defaultProfileImage;
});

const triggerImageUpload = () => {
  imageInput.value.click();
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      isLoading.value = true;
      const user = store.state.auth?.user;
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      await uploadProfileImage({ userId: user.id, imageFile: file });
      toast.success('Profile image updated successfully');
    } catch (error) {
      toast.error('Failed to upload profile image');
      console.error('Upload error:', error);
    } finally {
      isLoading.value = false;
    }
  }
};

const saveProfileInfo = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    const user = store.state.auth?.user;
    // if (!user?.id) {
    //   throw new Error('User not authenticated');
    // }
    await updateUserSettings({
      userId: user.id,
      username: formData.username,
      email: formData.email
    });
    
    store.commit('auth/updateUserInfo', {
      ...user,
      username: formData.username,
      email: formData.email
    });
    
    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error('Failed to update profile');
    console.error('Update error:', error);
  } finally {
    isLoading.value = false;
  }
};

const updatePassword = async () => {
  if (!validatePassword()) return;

  try {
    isLoading.value = true;
    const user = store.state.auth?.user;
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    await updateUserSettings({
      userId: user.id,
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });

    passwordData.currentPassword = '';
    passwordData.newPassword = '';
    passwordData.confirmPassword = '';
    
    toast.success('Password updated successfully');
  } catch (error) {
    toast.error('Failed to update password');
    console.error('Password update error:', error);
  } finally {
    isLoading.value = false;
  }
};

const savePreferences = async () => {
  try {
    isLoading.value = true;
    const user = store.state.userInfo;
    // if (!user?.id) {
    //   throw new Error('User not authenticated');
    // }
    await updateUserSettings({
      userId: user.userId,
      preferences
    });
    
    store.commit('auth/updatePreferences', preferences);
    
    toast.success('Preferences saved successfully');
  } catch (error) {
    toast.error('Failed to save preferences');
    console.error('Preferences update error:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const user = store.state.userInfo;
    // if (!user?.id) {
    //   throw new Error('User not authenticated');
    // }
    const settings = await getUserSettings(user.userId);
    
    if (settings) {
      formData.username = settings.username || '';
      formData.email = settings.email || '';
      preferences.emailNotifications = settings.preferences?.emailNotifications ?? false;
      preferences.darkMode = settings.preferences?.darkMode ?? false;
    }
  } catch (error) {
    toast.error('Failed to load settings');
    console.error('Settings load error:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  margin-bottom: 2rem;
  text-align: center;
}

.settings-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.settings-header p {
  color: #666;
}

.settings-content {
  display: grid;
  gap: 2rem;
}

.settings-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-section h2 {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.profile-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #e9ecef;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-button:hover {
  background: #e9ecef;
}

.hidden-input {
  display: none;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4dabf7;
}

.form-group input.error {
  border-color: #fa5252;
}

.error-message {
  color: #fa5252;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.save-button {
  width: 100%;
  padding: 0.75rem;
  background: #4dabf7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.save-button:hover {
  background: #339af0;
}

.save-button:disabled {
  background: #adb5bd;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.preference-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
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
  background-color: #dee2e6;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #4dabf7;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

@media (max-width: 768px) {
  .settings-container {
    padding: 1rem;
  }
  
  .settings-section {
    padding: 1rem;
  }
}
</style> 