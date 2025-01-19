<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['view-deadlines']);

const viewDeadlines = () => {
  emit('view-deadlines', props.course.course_name);
};

const getPriorityClass = () => {
  switch (props.course.priority) {
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
</script>

<template>
<div :class="['course-card', getPriorityClass(course.priority)]">
  <div class="course-header">
    <h3 class="course-name">
      {{ course.course_name }}
      <span class="course-code">({{ course.course_code }})</span>
    </h3>
  </div>
  <div class="course-lecturer">
    <img :src="course.lecturer_image" alt="Lecturer" class="lecturer-image" />
    <p class="course-admin">Dr. {{ course.admin_name }}</p>
  </div>
  <div class="course-stats">
    <p>Total Assessments: <strong>{{ course.total_assinments }}</strong></p>
    <p>Completed: <strong>{{ course.completedAssesmants }}</strong></p>
  </div>
  <div class="course-actions">
    <button class="view-deadlines-btn" @click="viewDeadlines">View Deadlines</button>
    <button class="set-priority-btn" @click="setPriority">Set Priority</button>
  </div>
</div>


</template>

<style scoped>
/* Container for course card */

/* Base course card styling */
.course-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

/* Header styling */
.course-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.course-name {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.course-code {
  font-size: 1rem;
  color: #666;
  margin-left: 8px;
  font-style: italic;
}


/* Lecturer section styling */
.course-lecturer {
  display: flex;
  align-items: center; /* Align image and text vertically */
  margin-bottom: 20px;
}

.lecturer-image {
  width: 100px; /* Circular image size */
  height: 100px; /* Match width for circular shape */
  border-radius: 50%; /* Makes the image circular */
  margin-right: 15px; /* Add space between the image and the name */
  border: 3px solid #ccc; /* Slightly thicker border for aesthetics */
  object-fit: cover; /* Ensures the image is properly cropped */
}

.course-admin {
  font-size: 1.2rem; /* Slightly larger font for the lecturer name */
  font-weight: bold;
  color: #333; /* Darker color for visibility */
  margin: 0; /* Remove default margin */
  text-align: left; /* Align text to the left */
}


/* Stats section styling */
.course-stats {
  font-size: 1rem;
  margin-bottom: 20px;
  text-align: center;
}

.course-stats p {
  margin: 5px 0;
}

.course-stats strong {
  color: #333;
}

/* Actions container for buttons */
.course-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Buttons styling */
.course-card button {
  padding: 10px 15px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease;
}

.view-deadlines-btn {
  background-color: #3f51b5;
  color: #fff;
}

.view-deadlines-btn:hover {
  background-color: #2c3e9a;
}

.set-priority-btn {
  background-color: #ff9800;
  color: #fff;
}

.set-priority-btn:hover {
  background-color: #e68900;
}

.set-priority-btn:active {
  transform: scale(0.98);
}


/* Priority classes */
.priority-low {
  background-color: #d4edda; /* Light green */
  border-left: 5px solid #28a745; /* Green border */
}

.priority-medium {
  background-color: #fff3cd; /* Light yellow */
  border-left: 5px solid #ffc107; /* Yellow border */
}

.priority-high {
  background-color: #f8d7da; /* Light red */
  border-left: 5px solid #dc3545; /* Red border */
}

</style>


