<template>
  <div class="course-details-page">
    <div class="back-bar">
      <button @click="$router.back()" class="back-btn">&larr; Back to Dashboard</button>
    </div>
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading course details...</p>
    </div>
    <div v-else-if="!course" class="empty-state">
      <p>Course not found or you do not have access to view it.</p>
    </div>
    <div v-else class="course-details-card">
      <div class="course-title-section">
        <h1>{{ course?.course_name || course?.name }}</h1>
        <span class="course-code-badge">{{ course?.course_code || course?.code }}</span>
      </div>
      <div class="detail-section">
        <span class="detail-label">Faculty</span>
        <h3 class="detail-value">{{ course?.faculty }}</h3>
      </div>
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-label">Total Students</span>
          <span class="stat-value">{{ enrolledStudents.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Active Deadlines</span>
          <span class="stat-value">{{ activeDeadlines }}</span>
        </div>
      </div>
      <div class="section-container">
        <div class="section-header">
          <h3>Enrolled Students</h3>
        </div>
        <div v-if="enrolledStudents.length > 0" class="students-list">
          <div v-for="student in enrolledStudents" :key="student.user_id" class="student-row">
            <span class="student-name">{{ student.username }}</span>
            <span class="student-email">{{ student.email }}</span>
            <span class="student-id">{{ student.up_number }}</span>
            <span class="student-deadlines">Completed Deadlines: {{ student.completed_deadlines }} / {{ student.total_deadlines }}</span>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No students enrolled yet</p>
        </div>
      </div>
      <div class="section-container">
        <div class="section-header">
          <h3>Deadlines</h3>
        </div>
        <div v-if="deadlines.length > 0" class="deadlines-list">
          <div v-for="deadline in deadlines" :key="deadline.deadline_id" class="deadline-row">
            <span class="deadline-title">{{ deadline.title }}</span>
            <span class="deadline-date">Due: {{ formatDate(deadline.due_date) }}</span>
            <span class="priority-badge" :class="deadline.priority.toLowerCase()">{{ deadline.priority }}</span>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No deadlines set</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adminFetchCourses, adminFetchAllStudents, adminFetchDeadlines } from '@/services/api';
import { useStore } from 'vuex';

const route = useRoute();
const router = useRouter();
const store = useStore();
const userInfo = store.getters.getUserInfo;
const courseId = route.params.courseId;

const isLoading = ref(true);
const course = ref(null);
const enrolledStudents = ref([]);
const deadlines = ref([]);
const activeDeadlines = ref(0);

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

onMounted(async () => {
  isLoading.value = true;
  try {
    // Fetch course info
    const coursesRes = await adminFetchCourses(userInfo.userId);
    console.log('coursesRes', coursesRes);
    let courseList = [];
    if (coursesRes) {
      if (Array.isArray(coursesRes.courses)) courseList = coursesRes.courses;
      else if (Array.isArray(coursesRes.data)) courseList = coursesRes.data;
      else if (coursesRes.courses) courseList = [coursesRes.courses];
      else if (coursesRes.data) courseList = [coursesRes.data];
    }
    const found = courseList.find(c => c.course_id == courseId);
    course.value = found || null;

    // Fetch all students and filter those enrolled in this course
    const studentsRes = await adminFetchAllStudents(userInfo.userId);
    console.log('studentsRes', studentsRes);
    let allStudents = [];
    if (studentsRes) {
      if (Array.isArray(studentsRes.data)) allStudents = studentsRes.data;
      else if (Array.isArray(studentsRes.students)) allStudents = studentsRes.students;
      else if (studentsRes.data) allStudents = [studentsRes.data];
      else if (studentsRes.students) allStudents = [studentsRes.students];
    }
    enrolledStudents.value = studentsRes.data;

    // Fetch deadlines for this course
    const deadlinesRes = await adminFetchDeadlines(userInfo.userId, courseId);
    console.log('deadlinesRes', deadlinesRes);
    let allDeadlines = [];
    if (deadlinesRes) {
      if (Array.isArray(deadlinesRes.data)) allDeadlines = deadlinesRes.data;
      else if (Array.isArray(deadlinesRes.deadlines)) allDeadlines = deadlinesRes.deadlines;
      else if (deadlinesRes.data) allDeadlines = [deadlinesRes.data];
      else if (deadlinesRes.deadlines) allDeadlines = [deadlinesRes.deadlines];
    }
    deadlines.value = allDeadlines;
    activeDeadlines.value = allDeadlines.filter(d => new Date(d.due_date) > new Date()).length;
  } catch (e) {
    // Optionally handle error
    console.error('Error loading course details:', e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.course-details-page {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
}
.back-bar {
  margin-bottom: 1.5rem;
}
.back-btn {
  background: #f3f4f6;
  border: none;
  color: #4f46e5;
  font-weight: 500;
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #e5e7eb;
}
.course-title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.course-title-section h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.course-code-badge {
  background-color: #f3f4f6;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #374151;
  font-weight: 500;
}
.detail-section {
  margin-bottom: 2rem;
}
.detail-label {
  font-size: 0.95rem;
  color: #6b7280;
  display: block;
  margin-bottom: 0.5rem;
}
.detail-value {
  font-size: 1.25rem;
  color: #111827;
  margin: 0;
}
.stats-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}
.stat-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem 2rem;
  min-width: 160px;
  text-align: center;
}
.stat-label {
  color: #6b7280;
  font-size: 0.95rem;
  display: block;
  margin-bottom: 0.5rem;
}
.stat-value {
  color: #111827;
  font-size: 1.3rem;
  font-weight: 600;
}
.section-container {
  margin-bottom: 2.5rem;
}
.section-header {
  margin-bottom: 1rem;
}
.students-list, .deadlines-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.student-row, .deadline-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #f9fafb;
  border-radius: 6px;
  padding: 0.75rem 1.25rem;
}
.student-name {
  font-weight: 500;
  color: #1e293b;
}
.student-email {
  color: #64748b;
  font-size: 0.95rem;
}
.student-id {
  color: #64748b;
  font-size: 0.95rem;
}
.student-deadlines {
  color: #64748b;
  font-size: 0.95rem;
}
.deadline-title {
  font-weight: 500;
  color: #1e293b;
}
.deadline-date {
  color: #64748b;
  font-size: 0.95rem;
}
.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}
.priority-badge.high {
  background: #fee2e2;
  color: #dc2626;
}
.priority-badge.medium {
  background: #fef3c7;
  color: #d97706;
}
.priority-badge.low {
  background: #dcfce7;
  color: #16a34a;
}
.empty-state {
  color: #6b7280;
  text-align: center;
  padding: 2rem 0;
}
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #4f46e5;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 