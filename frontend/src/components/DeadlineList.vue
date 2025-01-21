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
        <span class="deadline-date">- Due: {{ deadline.due_date }}</span>
      </div>
      <div class="deadline-details">
        <progress :value="deadline.progress" max="100" class="deadline-progress"></progress>
        <span :class="['deadline-status', getStatusClass(deadline.status, deadline.progress)]">
          {{ deadline.status == 1 || deadline.progress === 100 ? 'Completed' : 'Pending' }}
        </span>
      </div>
      <div class="priority-controls">
        <button 
          class="priority-btn low" 
          :class="{ active: deadline.priority_level === 1 }"
          @click="setPriority(deadline.deadline_id, 1)"
        >
          Low
        </button>
        <button 
          class="priority-btn medium" 
          :class="{ active: deadline.priority_level === 2 }"
          @click="setPriority(deadline.deadline_id, 2)"
        >
          Medium
        </button>
        <button 
          class="priority-btn high" 
          :class="{ active: deadline.priority_level === 3 }"
          @click="setPriority(deadline.deadline_id, 3)"
        >
          High
        </button>
      </div>
    </li>
  </ul>
</div>
  
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps(['deadlines', 'course_name']);
const emit = defineEmits(['update-priority']);
const toast = useToast();

const getStatusClass = (status, progress) => {
  return status == 1 || progress === 100 ? 'Completed' : 'Pending';
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

const setPriority = async (deadlineId, priority) => {
  try {
    emit('update-priority', { deadlineId, priority });
    toast.success(`Priority updated successfully!`);
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
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.deadlines-container h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.deadline-item {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #ddd;
}

.deadline-item.priority-low {
  border-left-color: #4caf50;
  background-color: rgba(76, 175, 79, 0.233);
}

.deadline-item.priority-medium {
  border-left-color: #ff9800;
  background-color: rgba(255, 153, 0, 0.252);
}

.deadline-item.priority-high {
  border-left-color: #f44336;
  background-color: rgba(247, 75, 62, 0.367);
}

.deadline-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.deadline-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #555;
}

.deadline-date {
  color: #888;
  font-style: italic;
  margin-left: 5px;
}

.deadline-details {
  display: flex;
  align-items: center;
  gap: 10px;
}

.deadline-progress {
  flex: 1;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  appearance: none;
}

.deadline-progress::-webkit-progress-bar {
  background-color: #e0e0e0;
  border-radius: 6px;
}

.deadline-progress::-webkit-progress-value {
  background-color: #3f51b5;
  border-radius: 6px;
}

.deadline-progress::-moz-progress-bar {
  background-color: #3f51b5;
  border-radius: 6px;
}

.deadline-status {
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
}

.deadline-status.Pending {
  background-color: #f9c74f;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
}

.deadline-status.Completed {
  background-color: #43aa8b;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
}

.priority-controls {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: flex-end;
}

.priority-btn {
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.priority-btn:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.priority-btn.active {
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.priority-btn.low {
  background-color: #4caf50;
  color: white;
}

.priority-btn.medium {
  background-color: #ff9800;
  color: white;
}

.priority-btn.high {
  background-color: #f44336;
  color: white;
}

</style>