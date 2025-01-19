<template>
  <div class="registration-container">
    <h1>Register</h1>
    <form class="registration-form" @submit.prevent="onSubmit" :class="{ 'loading': isLoading }">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          v-model="formData.username" 
          placeholder="Enter your username"
          :class="{ 'error': errors?.username }"
          required
        >
        <span class="error-message" v-if="errors?.username">{{ errors.username }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          placeholder="Enter your email"
          :class="{ 'error': errors?.email }"
          required
        >
        <span class="error-message" v-if="errors?.email">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="formData.password"
          placeholder="Enter your password"
          :class="{ 'error': errors?.password }"
          required
        >
        <span class="error-message" v-if="errors?.password">{{ errors.password }}</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="formData.confirmPassword"
          placeholder="Confirm your password"
          :class="{ 'error': errors?.confirmPassword }"
          required
        >
        <span class="error-message" v-if="errors?.confirmPassword">
          {{ errors.confirmPassword }}
        </span>
      </div>

      <div class="form-group">
        <label for="up_number">UP Number</label>
        <input 
          type="text" 
          id="up_number" 
          v-model="formData.up_number"
          placeholder="Enter your UP number"
          :class="{ 'error': errors?.upNumber }"
          required
        >
        <span class="error-message" v-if="errors?.upNumber">{{ errors.upNumber }}</span>
      </div>

      <!-- Update reCAPTCHA section -->
      <div class="captcha-wrapper">
        <div id="recaptcha-container">
          <div
            ref="recaptchaElement"
            class="g-recaptcha"
            :data-sitekey="recaptchaSiteKey"
          ></div>
        </div>
        <span class="error-message" v-if="errors?.captcha">
          {{ errors?.captcha }}
        </span>
      </div>

      <button 
        type="submit" 
        class="register-btn"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';

// Props
defineProps({
  isLoading: Boolean,
  errors: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['submit']);
const recaptchaElement = ref(null);
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const captchaToken = ref('');

// Form data
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  up_number: ''
});

// Initialize reCAPTCHA
const initRecaptcha = () => {
  if (window.grecaptcha && recaptchaElement.value) {
    window.grecaptcha.render(recaptchaElement.value, {
      sitekey: recaptchaSiteKey,
      callback: (token) => {
        captchaToken.value = token;
      },
      'expired-callback': () => {
        captchaToken.value = '';
      }
    });
  }
};

onMounted(() => {
  // Load reCAPTCHA script
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
  script.async = true;
  script.defer = true;
  
  // Define global callback
  window.onRecaptchaLoad = () => {
    initRecaptcha();
  };

  document.head.appendChild(script);

  // Cleanup
  return () => {
    document.head.removeChild(script);
    delete window.onRecaptchaLoad;
  };
});

const onSubmit = () => {
  emit('submit', { 
    ...formData,
    captchaToken: captchaToken.value 
  });
};
</script>

<style scoped>
/* Reset styles */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
  background-color: #f3f4f6; /* Light gray background */
}

/* Center the registration container */
.registration-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Header */
.registration-container h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

/* Form styling */
.registration-form {
  width: 100%;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #3f51b5;
  outline: none;
}

/* Register button styling */
.register-btn {
  width: 100%;
  padding: 10px 15px;
  font-size: 1rem;
  background-color: #3f51b5;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease;
}

.register-btn:hover {
  background-color: #2c3e9a;
}

.register-btn:active {
  transform: scale(0.98);
}

/* Responsive design */
@media (max-width: 500px) {
  .registration-container {
    padding: 15px;
  }
}

/* Error message styling */
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Loading state styling */
.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Add reCAPTCHA specific styles */
.captcha-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0;
}

#recaptcha-container {
  min-height: 78px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Add this to ensure reCAPTCHA is visible */
.g-recaptcha {
  display: inline-block;
}

/* Add this if reCAPTCHA is too large for mobile */
@media (max-width: 400px) {
  #recaptcha-container {
    transform: scale(0.9);
    transform-origin: center;
  }
}
</style>