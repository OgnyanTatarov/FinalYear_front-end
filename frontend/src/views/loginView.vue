<template>
    <div>
        <LoginCard
        @loginSumbited="handleLogin"
        :isLoading="isLoading"
        :errors="errors"
        />
    </div>
</template>

<script setup>
import LoginCard from '../components/loginCard.vue';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { loginUser } from '../services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const store = useStore();
const router = useRouter();
const isLoading = ref(false);
const errors = reactive({});

const handleLogin = async (loginData) => {
    try {
        isLoading.value = true;
        const response = await loginUser(loginData);
        const userInfo = {
            userId: response.user_id,
            username: response.username,
            email: response.email,
            role: response.role,
        };
        store.dispatch('login', userInfo);
        router.push('/courses')
    } catch (error) {
        console.log(error);
        toast.error(Array.isArray(error.response.data) ? error.response.data.join(', ') : error.response.data);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style>


</style>