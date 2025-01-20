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
        No course information available
      </div>

      <!-- Add Pagination -->
      <Pagination
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
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
}

.priority-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 600px) {
  .priority-page {
    padding: 1rem;
  }
}

.error-message {
  text-align: center;
  color: #dc3545;
  font-size: 1.2rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style> 