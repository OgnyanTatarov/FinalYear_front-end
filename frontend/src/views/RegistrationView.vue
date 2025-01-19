<template>
  <div class="registration-page">
    <div class="registration-container">
      <RegistrationCard
        @submit="handleRegistration"
        :isLoading="isLoading"
        :errors="validationErrors"
      />
    </div>
  </div>
</template>

<script setup>
import RegistrationCard from '../components/RegistrationCard.vue';
import { ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { registerUser } from '../services/api';

const toast = useToast();
const router = useRouter();
const isLoading = ref(false);

// Validation state
const validationErrors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  upNumber: '',
  captcha: ''
});

const validateForm = (data) => {
  let isValid = true;
  // Reset errors
  Object.keys(validationErrors).forEach(key => validationErrors[key] = '');

  // Username validation
  if (!data.username || data.username.length < 3) {
    validationErrors.username = 'Username must be at least 3 characters long';
    isValid = false;
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    validationErrors.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Password validation
  if (data.password.length < 8) {
    validationErrors.password = 'Password must be at least 8 characters long';
    isValid = false;
  }

  if (!/[A-Z]/.test(data.password)) {
    validationErrors.password = 'Password must contain at least one uppercase letter';
    isValid = false;
  }

  if (!/[0-9]/.test(data.password)) {
    validationErrors.password = 'Password must contain at least one number';
    isValid = false;
  }

  // Password confirmation
  if (data.password !== data.confirmPassword) {
    validationErrors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  // UP Number validation
  const upPattern = /^up\d{7}$/i;
  if (!upPattern.test(data.up_number)) {
    validationErrors.upNumber = 'Please enter a valid UP number (e.g., UP1234567)';
    isValid = false;
  }

  // CAPTCHA validation
  if (!data.captchaToken) {
    validationErrors.captcha = 'Please complete the CAPTCHA';
    isValid = false;
  }

  return isValid;
};

const handleRegistration = async (formData) => {
  try {
    isLoading.value = true;

    // Validate form before submission
    if (!validateForm(formData)) {
      toast.error('Please fix the validation errors');
      return;
    }

    await registerUser(formData);
    
    toast.success('Registration successful! Please log in.');
    
    setTimeout(() => {
      router.push('/');
    }, 1500);

  } catch (error) {
    const errorMessage = error.response?.data || 'Registration failed. Please try again.';
    toast.error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.registration-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.registration-container {
  width: 100%;
  max-width: 480px;
}

@media (max-width: 576px) {
  .registration-container {
    margin: 1rem;
  }
}
</style>