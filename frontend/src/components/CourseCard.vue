<script>
export default {
  props: ['course'],
  methods: {
    viewDeadlines() {
      this.$emit('view-deadlines', this.course.course_name);
    },
  },
};
</script>

<template>
<div class="course-card">
  <h3 class="course-name">{{ course.course_name }}</h3>
  <p class="course-admin">Lecturer: {{ course.admin_name }}</p>
  <button class="view-deadlines-btn" @click="viewDeadlines">View Deadlines</button>
</div>

</template>

<style scoped>
.course-card {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.course-name {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.course-admin {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

.view-deadlines-btn {
  background-color: #3f51b5; /* Primary button color */
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.view-deadlines-btn:hover {
  background-color: #2c3e9a; /* Darker blue on hover */
  transform: scale(1.05); /* Slightly larger button on hover */
}

.view-deadlines-btn:active {
  transform: scale(0.95); /* Slightly smaller button when clicked */
}

.view-deadlines-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.4); /* Focus ring */
}

</style>


