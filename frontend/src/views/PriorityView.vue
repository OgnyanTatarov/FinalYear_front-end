<template>
  <div class="priority-page">
    <div class="priority-container">
      <PriorityCard
        v-if="courseObject"
        :course="courseObject"
        :isLoading="isLoading"
        @save-priority="handlePrioritySave"
      />
      <div v-else class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        No course information available
      </div>

      <Pagination
        v-if="courseObject"
        :totalPages="total"
        :current-page="currentPage"
        @page-changed="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import PriorityCard from '../components/PriorityCard.vue';
import Pagination from '../components/Pagination.vue';
import { updatePriority } from '../services/api';
import { useStore } from 'vuex';

const props = defineProps({
  courseData: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const toast = useToast();
const store = useStore();
const isLoading = ref(false);
const currentPage = ref(1);
const total = ref(1); // You might want to update this based on your data

// Simplified computed property since we're now getting a proper object
const courseObject = computed(() => {
  if (!props.courseData) {
    toast.error('Invalid course data');
    router.push('/courses');
    return null;
  }
  return props.courseData;
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handlePrioritySave = async (priority) => {
  if (!courseObject.value) {
    toast.error('Course information not found');
    return;
  }

  try {
    isLoading.value = true;
    await updatePriority(
      courseObject.value.course_id, 
      store.getters.getUserInfo.userId, 
      priority,
      currentPage.value
    );
    
    // Dispatch action to refresh courses
    await store.dispatch('refreshCourses', {
      userId: store.getters.getUserInfo.userId,
      page: currentPage.value
    });
    
    toast.success('Priority updated successfully');
    router.push('/courses');
  } catch (error) {
    toast.error('Failed to update priority');
    console.error('Priority update error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.priority-page {
  min-height: calc(100vh - 72px);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem;
}

.priority-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.error-message {
  text-align: center;
  color: #ef4444;
  font-size: 1.2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-message svg {
  width: 48px;
  height: 48px;
  color: #ef4444;
}

@media (max-width: 600px) {
  .priority-page {
    padding: 1rem;
  }
}
</style> 