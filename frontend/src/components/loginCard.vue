<template>
<div class="login-container">
    <h1>Login</h1>
    <form action="#" method="POST" class="login-form" @submit.prevent="onSubmit" :class="{ 'loading': isLoading }">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" v-model="formData.email" placeholder="Enter your email" :class="{ 'error': errors?.email }" required>
        <span class="error-message" v-if="errors?.email">{{ errors.email }}</span>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" v-model="formData.password" placeholder="Enter your password" :class="{ 'error': errors?.password }" required>
        <span class="error-message" v-if="errors?.password">{{ errors.password }}</span>
      </div>
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
      <button type="submit" class="login-btn" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p class="register-link">
      Don't have an account? <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {useToast} from 'vue-toastification';

const email = ref('');
const password = ref('');

const emit = defineEmits(['loginSumbited']);
const props = defineProps({
    isLoading: Boolean,
    errors: {
        type: Object,
        default: () => ({})
    }
});

const toast = useToast();

const recaptchaElement = ref(null);
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const captchaToken = ref('');

const formData = reactive({
  email: '',
  password: ''
});

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
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
  script.async = true;
  script.defer = true;
  
  window.onRecaptchaLoad = () => {
    initRecaptcha();
  };

  document.head.appendChild(script);

  return () => {
    document.head.removeChild(script);
    delete window.onRecaptchaLoad;
  };
});

const onSubmit = () => {
    // Local validation
    if(!formData.email || !formData.password){
        toast.error("Both fields are required in order to login!");
        return;
    }
    
    if(!captchaToken.value) {
        toast.error("Please complete the CAPTCHA verification");
        return;
    }

    const loginData = {
        email: formData.email,
        password: formData.password,
        captchaToken: captchaToken.value
    };

    emit('loginSumbited', loginData);
};

</script>

<style scoped>
/* Reset some default styles */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  background-color: #f3f4f6; /* Light gray background */
}

/* Center the login container */
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Login header */
.login-container h1 {
  margin-bottom: 20px;
  color: #333;
  font-size: 2rem;
}

/* Form styling */
.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #3f51b5;
  outline: none;
}

/* Login button styling */
.login-btn {
  width: 100%;
  padding: 10px 15px;
  background-color: #3f51b5;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.login-btn:hover {
  background-color: #2c3e9a;
}

.login-btn:active {
  transform: scale(0.98);
}

/* Responsive design */
@media (max-width: 500px) {
  .login-container {
    padding: 15px;
  }
}

.register-link {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #555;
}

.register-link a {
  color: #3f51b5;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.register-link a:hover {
  color: #2c3e9a;
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