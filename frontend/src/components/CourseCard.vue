<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps(['course']);
const emit = defineEmits(['view-deadlines']);
const hasImageError = ref(false);
// Add computed properties for assessment counts
const totalAssessments = computed(() => {
  return props.course.total_assinments || props.course.total_assessments || 0;
});

const completedAssessments = computed(() => {
  return props.course.completed_assessments || props.course.completed_assignments || 0;
});

const viewDeadlines = () => {
  emit('view-deadlines', {
    courseId: props.course.course_id,
    userId: props.course.user_id
  });
};

const setPriority = () => {
  // Convert the Proxy object to a plain object and stringify it
  const courseData = JSON.parse(JSON.stringify(props.course));
  router.push({
    name: 'Priority',
    query: {
      courseData: encodeURIComponent(JSON.stringify(courseData))
    }
  });
};

const handleImageError = () => {
  hasImageError.value = true;
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
  <div class="course-card" :class="[getPriorityClass(course.priority)]">
    <div class="course-header">
      <div class="course-title">
        <h3 class="course-name">{{ course.course_name }}</h3>
        <span class="course-code">{{ props.course.course_code }}</span>
      </div>
      <div class="priority-indicator" :class="getPriorityClass(course.priority)"></div>
    </div>

    <div class="course-lecturer">
      <div class="lecturer-image-container">
        <template v-if="!hasImageError && course.lecturer_image">
          <img 
            :src="course.lecturer_image" 
            alt="Lecturer" 
            class="lecturer-image"
            @error="handleImageError"
          />
        </template>
        <div v-else class="default-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </div>
      <div class="lecturer-info">
        <p class="lecturer-title">Course Lecturer</p>
        <p class="course-admin">Dr. {{ props.course.admin_name }}</p>
      </div>
    </div>

    <div class="course-stats">
      <div class="stat-item">
        <span class="stat-label">Total Assessments</span>
        <span class="stat-value">{{ totalAssessments }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Completed</span>
        <span class="stat-value">{{ completedAssessments }}</span>
      </div>
    </div>

    <div class="course-actions">
      <button class="action-btn view-deadlines-btn" @click="viewDeadlines">
        <span class="btn-icon">📅</span>
        View Deadlines
      </button>
      <button class="action-btn set-priority-btn" @click="setPriority">
        <span class="btn-icon">🎯</span>
        Set Priority
      </button>
    </div>
  </div>
</template>

<style scoped>
.course-card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.course-title {
  flex: 1;
}

.course-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.course-code {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.priority-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 8px;
}

.course-lecturer {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.lecturer-image-container {
  position: relative;
}

.lecturer-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lecturer-info {
  flex: 1;
}

.lecturer-title {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0 0 4px 0;
}

.course-admin {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.course-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
}

.course-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-deadlines-btn {
  background: #3b82f6;
  color: white;
}

.view-deadlines-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.set-priority-btn {
  background: #f1f5f9;
  color: #1a1a1a;
}

.set-priority-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Priority classes */
.priority-low .priority-indicator {
  background-color: #22c55e;
}

.priority-medium .priority-indicator {
  background-color: #f59e0b;
}

.priority-high .priority-indicator {
  background-color: #ef4444;
}

.priority-low {
  border-left: 4px solid #22c55e;
}

.priority-medium {
  border-left: 4px solid #f59e0b;
}

.priority-high {
  border-left: 4px solid #ef4444;
}

.default-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.default-avatar svg {
  width: 32px;
  height: 32px;
}

@media (max-width: 768px) {
  .course-card {
    padding: 20px;
  }

  .course-name {
    font-size: 1.3rem;
  }

  .course-stats {
    grid-template-columns: 1fr;
  }

  .action-btn {
    padding: 10px;
    font-size: 0.9rem;
  }
}
</style>


