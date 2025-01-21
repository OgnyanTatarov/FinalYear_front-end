<template>
  <div class="priority-card">
    <h2>Set Priority for {{ course.course_name }}</h2>
    <div class="course-info">
      <p><strong>Course name:</strong> {{ course.course_name }}</p>
      <p><strong>Current Priority:</strong> {{ getPriorityLabel(course.priority) }}</p>
    </div>

    <div class="priority-selector">
      <h3>Select New Priority:</h3>
      <div class="priority-options">
        <button 
          class="priority-btn low" 
          :class="{ active: selectedPriority === 1 }"
          @click="selectPriority(1)"
        >
          Low
        </button>
        <button 
          class="priority-btn medium" 
          :class="{ active: selectedPriority === 2 }"
          @click="selectPriority(2)"
        >
          Medium
        </button>
        <button 
          class="priority-btn high" 
          :class="{ active: selectedPriority === 3 }"
          @click="selectPriority(3)"
        >
          High
        </button>
      </div>
    </div>

    <div class="actions">
      <button class="save-btn" @click="savePriority" :disabled="isLoading">
        {{ isLoading ? 'Saving...' : 'Save Priority' }}
      </button>
      <button class="cancel-btn" @click="cancel">Cancel</button>
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
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.course-info {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.priority-selector {
  margin: 2rem 0;
}

.priority-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.priority-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.priority-btn.low {
  background: #4CAF50;
  color: white;
}

.priority-btn.medium {
  background: #FFC107;
  color: black;
}

.priority-btn.high {
  background: #F44336;
  color: white;
}

.priority-btn.active {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.save-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.save-btn {
  background: #3f51b5;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #2c3e9a;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn {
  background: #9e9e9e;
  color: white;
}

.cancel-btn:hover {
  background: #757575;
}

@media (max-width: 600px) {
  .priority-card {
    margin: 1rem;
    padding: 1rem;
  }

  .priority-options {
    flex-direction: column;
  }

  .priority-btn {
    width: 100%;
  }
}
</style> 