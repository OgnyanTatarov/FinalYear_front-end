
<template>
<div class="login-container">
    <h1>Login</h1>
    <form action="#" method="POST" class="login-form" @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="email" id="email" name="email" v-model="email" placeholder="Enter your username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" v-model="password" placeholder="Enter your password" required>
      </div>
      <button type="submit" class="login-btn">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {useToast} from 'vue-toastification';

const email = ref('');
const password = ref('');

const emit = defineEmits(['loginSumbited']);

const toast = useToast();

const onSubmit = () => {
    if(!email.value || !password.value){
        toast.error("Both fields are required in order to login!");
    };
    const loginData = {
        email: email.value,
        password: password.value
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

</style>