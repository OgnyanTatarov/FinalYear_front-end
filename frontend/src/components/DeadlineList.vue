<template>
<div class="deadlines-container">
  <h2>Deadlines for {{ course_name }}</h2>
  <ul>
    <li v-for="deadline in deadlines" 
        :key="deadline.deadline_id" 
        class="deadline-item"
        :class="getPriorityClass(deadline.priority_level)"
    >
      <div class="deadline-title">
        <strong>{{ deadline.title }}</strong> 
        <span class="deadline-date">Due: {{ formatDate(deadline.due_date) }}</span>
      </div>
      <div class="deadline-details">
        <div class="progress-control">
          <div class="progress-slider">
            <input 
              type="range" 
              v-model="progressValues[deadline.deadline_id]" 
              min="0" 
              max="100" 
              step="5"
              class="slider"
              :style="{ background: getProgressGradient(progressValues[deadline.deadline_id]) }"
            >
            <div class="progress-value">{{ progressValues[deadline.deadline_id] }}%</div>
          </div>
          <button 
            class="update-progress-btn"
            @click="updateProgress(deadline.deadline_id, progressValues[deadline.deadline_id])"
            :disabled="progressValues[deadline.deadline_id] === deadline.progress"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="update-icon">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Update Progress
          </button>
        </div>
        <div 
          class="deadline-status"
          :style="{
            backgroundColor: progressValues[deadline.deadline_id] === 100 ? '#22c55e' : '#f59e0b'
          }"
        >
          {{ progressValues[deadline.deadline_id] === 100 ? 'Completed' : 'Pending' }}
        </div>
      </div>
      <div class="priority-controls">
        <button 
          class="priority-btn low" 
          :class="{ active: deadline.priority_level === 1 }"
          @click="setPriority(deadline.deadline_id, 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20V10"></path>
            <path d="M18 20V4"></path>
            <path d="M6 20v-4"></path>
          </svg>
          Low
        </button>
        <button 
          class="priority-btn medium" 
          :class="{ active: deadline.priority_level === 2 }"
          @click="setPriority(deadline.deadline_id, 2)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20V6"></path>
            <path d="M18 20V4"></path>
            <path d="M6 20v-8"></path>
          </svg>
          Medium
        </button>
        <button 
          class="priority-btn high" 
          :class="{ active: deadline.priority_level === 3 }"
          @click="setPriority(deadline.deadline_id, 3)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20V4"></path>
            <path d="M18 20V4"></path>
            <path d="M6 20V4"></path>
          </svg>
          High
        </button>
      </div>
    </li>
  </ul>
</div>
  
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';

const props = defineProps(['deadlines', 'course_name']);
const emit = defineEmits(['update-priority', 'update-progress']);
const toast = useToast();
const store = useStore();

const progressValues = ref({});

// Initialize progress values when deadlines change
watch(() => props.deadlines, (newDeadlines) => {
  if (newDeadlines) {
    newDeadlines.forEach(deadline => {
      progressValues.value[deadline.deadline_id] = deadline.progress;
    });
  }
}, { immediate: true });

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case 1:
      return 'priority-low';
    case 2:
      return 'priority-medium';
    case 3:
      return 'priority-high';
    default:
      return '';
  }
};

const getProgressGradient = (value) => {
  return `linear-gradient(to right, #4f46e5 ${value}%, #e2e8f0 ${value}%)`;
};

const updateProgress = async (deadlineId, progress) => {
  try {
    const userId = store.getters.getUserInfo.userId;
    await emit('update-progress', { deadlineId, progress });
    
    // Update local progress value
    progressValues.value[deadlineId] = progress;
    
  } catch (error) {
    toast.error('Failed to update progress');
    console.error('Error updating progress:', error);
    // Reset progress value to original if update fails
    const originalDeadline = props.deadlines.find(d => d.deadline_id === deadlineId);
    if (originalDeadline) {
      progressValues.value[deadlineId] = originalDeadline.progress;
    }
  }
};

const setPriority = async (deadlineId, priority) => {
  try {
    await emit('update-priority', { deadlineId, priority });
  } catch (error) {
    toast.error("Failed to update priority");
    console.error('Error updating priority:', error);
  }
};
</script>

<style scoped>

.deadlines-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.deadlines-container h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  font-weight: 700;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.deadline-item {
  display: flex;
  flex-direction: column;
  background: white;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
}

.deadline-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: all 0.3s ease;
}

.deadline-item.priority-low::before {
  background: linear-gradient(to bottom, #22c55e 0%, #16a34a 100%);
}

.deadline-item.priority-medium::before {
  background: linear-gradient(to bottom, #eab308 0%, #ca8a04 100%);
}

.deadline-item.priority-high::before {
  background: linear-gradient(to bottom, #ef4444 0%, #dc2626 100%);
}

.deadline-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.12);
}

.deadline-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.deadline-title strong {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  flex: 1;
}

.deadline-date {
  font-size: 0.875rem;
  color: #64748b;
  white-space: nowrap;
}

.deadline-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.progress-slider {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 12px;
}

.slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 999px;
  outline: none;
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
}

.progress-value {
  min-width: 3.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  text-align: right;
}

.update-progress-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 999px;
  background: #818cf8;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.update-progress-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.update-progress-btn:not(:disabled):hover {
  background: #6366f1;
  transform: translateY(-1px);
}

.update-icon {
  width: 16px;
  height: 16px;
}

.deadline-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  transition: background-color 0.3s ease;
  min-width: 100px;
}

.deadline-status.Pending {
  background-color: #22c55e;
}

.deadline-status.Completed {
  background-color: #22c55e;
}

.priority-controls {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.priority-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
}

.priority-btn svg {
  width: 16px;
  height: 16px;
}

.priority-btn.low {
  background: #22c55e;
}

.priority-btn.medium {
  background: #f59e0b;
}

.priority-btn.high {
  background: #ef4444;
}

.priority-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

.priority-btn.active {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .deadlines-container {
    padding: 1rem;
    margin: 1rem;
    border-radius: 12px;
  }

  .deadline-item {
    padding: 1.25rem;
  }

  .deadline-title {
    flex-direction: column;
    gap: 0.5rem;
  }

  .deadline-date {
    align-self: flex-start;
  }

  .progress-control {
    flex-direction: column;
    align-items: stretch;
  }

  .progress-slider {
    padding: 0.625rem;
  }

  .update-progress-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .priority-controls {
    flex-direction: column;
  }

  .priority-btn {
    width: 100%;
  }

  .deadline-title strong {
    font-size: 1.125rem;
  }
}

</style>