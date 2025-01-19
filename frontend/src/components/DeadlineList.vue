<template>
<div class="deadlines-container">
  <h2>Deadlines for {{ course_name }}</h2>
  <ul>
    <li v-for="deadline in deadlines" :key="deadline.deadline_id" class="deadline-item">
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
    </li>
  </ul>
</div>
  
</template>

<script>
export default {
  props: ['deadlines', 'course_name'],
  methods: {
    getStatusClass(status, progress) {
      return status == 1 || progress === 100 ? 'Completed' : 'Pending';
    },
  },
};
</script>

<style scoped>

.deadlines-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #c7bbbb;
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
  transition: transform 0.2s, box-shadow 0.2s;
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

</style>