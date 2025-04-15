<template>
  <div class="priority-card">
    <div class="card-header">
      <h2>Set Priority</h2>
      <p class="course-name">{{ course.course_name }}</p>
    </div>

    <div class="course-info">
      <div class="info-item">
        <span class="info-label">Course Name</span>
        <span class="info-value">{{ course.course_name }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Current Priority</span>
        <span class="info-value" :class="'priority-' + course.priority">
          {{ getPriorityLabel(course.priority) }}
        </span>
      </div>
    </div>

    <div class="priority-selector">
      <h3>Select New Priority</h3>
      <div class="priority-options">
        <button 
          class="priority-btn low" 
          :class="{ active: selectedPriority === 1 }"
          @click="selectPriority(1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20V10"></path>
            <path d="M18 20V4"></path>
            <path d="M6 20v-4"></path>
          </svg>
          Low
        </button>
        <button 
          class="priority-btn medium" 
          :class="{ active: selectedPriority === 2 }"
          @click="selectPriority(2)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20V6"></path>
            <path d="M18 20V4"></path>
            <path d="M6 20v-8"></path>
          </svg>
          Medium
        </button>
        <button 
          class="priority-btn high" 
          :class="{ active: selectedPriority === 3 }"
          @click="selectPriority(3)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20V4"></path>
            <path d="M18 20V4"></path>
            <path d="M6 20V4"></path>
          </svg>
          High
        </button>
      </div>
    </div>

    <div class="actions">
      <button class="save-btn" @click="savePriority" :disabled="isLoading">
        <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        <span class="loading-spinner" v-else></span>
        {{ isLoading ? 'Saving...' : 'Save Priority' }}
      </button>
      <button class="cancel-btn" @click="cancel">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['save-priority']);
const router = useRouter();
const selectedPriority = ref(props.course.priority || 0);

const getPriorityLabel = (priority) => {
  const labels = {
    1: 'Low',
    2: 'Medium',
    3: 'High'
  };
  return labels[priority] || 'Not Set';
};

const selectPriority = (priority) => {
  selectedPriority.value = priority;
};

const savePriority = () => {
  emit('save-priority', selectedPriority.value);
};

const cancel = () => {
  router.push('/courses');
};
</script>

<style scoped>
.priority-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 600px;
  margin: 0 auto;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.course-name {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0.5rem 0 0 0;
}

.course-info {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.info-label {
  color: #64748b;
  font-weight: 500;
}

.info-value {
  font-weight: 600;
  color: #1e293b;
}

.info-value.priority-1 { color: #22c55e; }
.info-value.priority-2 { color: #eab308; }
.info-value.priority-3 { color: #ef4444; }

.priority-selector {
  margin: 2rem 0;
}

.priority-selector h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 1rem;
  text-align: center;
}

.priority-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.priority-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  color: white;
}

.priority-btn svg {
  transition: transform 0.3s ease;
}

.priority-btn:hover svg {
  transform: translateY(-2px);
}

.priority-btn.low {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.priority-btn.medium {
  background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
}

.priority-btn.high {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.priority-btn.active {
  transform: scale(1.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.save-btn, .cancel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.save-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
  color: white;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
  color: #475569;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .priority-card {
    margin: 1rem;
    padding: 1.5rem;
  }

  .card-header h2 {
    font-size: 1.75rem;
  }

  .priority-options {
    flex-direction: column;
  }

  .priority-btn {
    width: 100%;
    justify-content: center;
  }

  .actions {
    flex-direction: column;
  }

  .save-btn, .cancel-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 