<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <div class="header-actions">
        <button class="create-course-btn" @click="showCreateCourseModal = true">
          Create Course
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Total Students</h3>
            <p>{{ totalStudents }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Total Courses</h3>
            <p>{{ totalCourses }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Active Deadlines</h3>
            <p>{{ activeDeadlines }}</p>
          </div>
        </div>
      </div>

      <div class="tabs-container">
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="tab-content">
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading...</p>
          </div>

          <div v-else-if="currentTab === 'courses'" class="courses-section">
            <div class="search-bar">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search courses..."
                class="search-input"
              >
              <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            
            <div v-if="isLoading" class="loading-state">
              <div class="spinner"></div>
              <p>Loading courses...</p>
            </div>
            
            <div v-else-if="courses.length === 0" class="empty-state">
              <p>No courses found. Create your first course!</p>
              <button @click="showCreateCourseModal = true" class="create-btn">
                Create Course
              </button>
            </div>
            
            <div v-else class="courses-list">
              <div v-for="course in filteredCourses" :key="course.course_id" class="course-card">
                <div class="course-header">
                  <h3>{{ course.course_name || course.name }}</h3>
                  <div class="course-actions">
                    <button @click="openEditCourseModal(course)" class="edit-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button @click="deleteCourse(course.course_id)" class="delete-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="course-stats">
                  <span>Course Code: {{ course.course_code || course.code }}</span>
                  <span>Faculty: {{ course.faculty }}</span>
                </div>
                <router-link
                  :to="{ name: 'AdminCourseDetails', params: { courseId: course.course_id } }"
                  class="view-details-btn"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>

          <div v-else-if="currentTab === 'students'" class="students-section">
            <div class="search-bar">
              <input 
                type="text" 
                v-model="studentSearchQuery" 
                placeholder="Search by name, UP number, or email..."
                class="search-input"
              >
              <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            
            <div v-if="isLoading" class="loading-state">
              <div class="spinner"></div>
              <p>Loading students...</p>
            </div>
            
            <div v-else-if="students.length === 0" class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p>No students found</p>
              <p class="empty-state-subtitle">Try adjusting your search criteria</p>
            </div>
            
            <div v-else class="students-grid">
              <div v-for="student in filteredStudents" :key="student.student_id" class="student-card">
                <div class="student-avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div class="student-info">
                  <h3 class="student-name">{{ student.name }}</h3>
                  <div class="student-details">
                    <div class="detail-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                      <span>{{ student.email }}</span>
                    </div>
                    <div class="detail-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      <span>{{ student.up_number }}</span>
                    </div>
                  </div>
                </div>
                <div class="student-actions">
                  <button @click="viewStudentDetails(student)" class="action-btn view-btn">
                    View Details
                  </button>
                  <button @click="enrollStudent(student)" class="action-btn enroll-btn">
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="currentTab === 'deadlines'" class="deadlines-section">
            <div class="deadlines-header">
              <button class="create-deadline-btn" @click="showCreateDeadlineModal = true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Deadline
              </button>
            </div>
            <div class="deadlines-list">
              <div v-for="deadline in deadlines" :key="deadline.deadline_id" class="deadline-card">
                <div class="deadline-header">
                  <h3>{{ deadline.title }}</h3>
                  <span class="priority-badge" :class="deadline.priority">
                    {{ deadline.priority }}
                  </span>
                </div>
                <p class="deadline-description">{{ deadline.description }}</p>
                <div class="deadline-details">
                  <span>Due: {{ formatDate(deadline.due_date) }}</span>
                  <span>Course: {{ deadline.course_name }}</span>
                </div>
                <div class="deadline-actions">
                  <button @click="editDeadline(deadline)" class="edit-btn">
                    Edit
                  </button>
                  <button @click="deleteDeadline(deadline.deadline_id)" class="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="showCreateCourseModal" @close="showCreateCourseModal = false">
      <template #header>
        <h2>Create New Course</h2>
      </template>
      <template #body>
        <form @submit.prevent="createCourse" class="create-course-form">
          <div class="form-group">
            <label for="courseName">Course Name</label>
            <input 
              type="text" 
              id="courseName" 
              v-model="newCourse.name" 
              required
              placeholder="Enter course name"
            >
          </div>
          <div class="form-group">
            <label for="courseCode">Course Code</label>
            <input 
              type="text" 
              id="courseCode" 
              v-model="newCourse.code" 
              required
              placeholder="e.g., CS101"
              pattern="[A-Za-z0-9]+"
              title="Course code should only contain letters and numbers"
            >
          </div>
          <div class="form-group">
            <label for="faculty">Faculty</label>
            <select 
              id="faculty" 
              v-model="newCourse.faculty" 
              required
              class="faculty-select"
            >
              <option value="">Select a faculty</option>
              <option v-for="faculty in faculties" :key="faculty" :value="faculty">
                {{ faculty }}
              </option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateCourseModal = false" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">Create Course</button>
          </div>
        </form>
      </template>
    </Modal>

    <Modal v-if="showCreateDeadlineModal" @close="showCreateDeadlineModal = false">
      <template #header>
        <h2>Create New Deadline</h2>
      </template>
      <template #body>
        <form @submit.prevent="createDeadline">
          <div class="form-group">
            <label for="course">Course</label>
            <select v-model="newDeadline.course_id" required>
              <option v-for="course in courses" :key="course.course_id" :value="course.course_id">
                {{ course.course_name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" v-model="newDeadline.title" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="newDeadline.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="dueDate">Due Date</label>
            <input type="datetime-local" id="dueDate" v-model="newDeadline.due_date" required>
          </div>
          <div class="form-group">
            <label for="priority">Priority</label>
            <select v-model="newDeadline.priority" required>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateDeadlineModal = false">Cancel</button>
            <button type="submit">Create Deadline</button>
          </div>
        </form>
      </template>
    </Modal>

    <Modal v-if="showCourseDetailsModal" @close="showCourseDetailsModal = false" class="course-details-modal">
      <template #header>
        <h2>Course Details</h2>
      </template>
      <template #body>
        <div v-if="courseDetails.isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading course details...</p>
        </div>
        <div v-else class="course-details">
          <div class="course-title-section">
            <h3>{{ selectedCourse?.course_name || selectedCourse?.name }}</h3>
            <span class="course-code-badge">{{ selectedCourse?.course_code || selectedCourse?.code }}</span>
          </div>
          <div class="detail-section">
            <span class="detail-label">Faculty</span>
            <h4 class="detail-value">{{ selectedCourse?.faculty }}</h4>
          </div>
          <div class="stats-section">
            <div class="stat-item">
              <span class="stat-label">Total Students</span>
              <span class="stat-value">{{ courseDetails.enrolledStudents.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Active Deadlines</span>
              <span class="stat-value">{{ 
                courseDetails.courseDeadlines.filter(d => new Date(d.due_date) > new Date()).length 
              }}</span>
            </div>
          </div>
          <div class="section-container">
            <div class="section-header">
              <h4>Enrolled Students</h4>
              <div class="action-buttons">
                <button class="icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="courseDetails.enrolledStudents.length > 0" class="students-list">
              <div v-for="student in courseDetails.enrolledStudents" :key="student.student_id" class="student-row">
                <div class="student-info">
                  <span class="student-name">{{ student.name }}</span>
                  <span class="student-id">{{ student.up_number }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>No students enrolled yet</p>
            </div>
          </div>
          <div class="section-container">
            <div class="section-header">
              <h4>Deadlines</h4>
              <div class="action-buttons">
                <button class="icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="courseDetails.courseDeadlines.length > 0" class="deadlines-list">
              <div v-for="deadline in courseDetails.courseDeadlines" :key="deadline.deadline_id" class="deadline-row">
                <div class="deadline-info">
                  <span class="deadline-title">{{ deadline.title }}</span>
                  <span class="deadline-date">Due: {{ formatDate(deadline.due_date) }}</span>
                </div>
                <span class="priority-badge" :class="deadline.priority.toLowerCase()">
                  {{ deadline.priority }}
                </span>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>No deadlines set</p>
            </div>
          </div>
        </div>
      </template>
    </Modal>

    <Modal v-if="showEditCourseModal" @close="showEditCourseModal = false">
      <template #header>
        <h2>Edit Course</h2>
      </template>
      <template #body>
        <form @submit.prevent="submitEditCourse" class="create-course-form">
          <div class="form-group">
            <label for="editCourseName">Course Name</label>
            <input type="text" id="editCourseName" v-model="editCourseData.name" required />
          </div>
          <div class="form-group">
            <label for="editCourseCode">Course Code</label>
            <input type="text" id="editCourseCode" v-model="editCourseData.code" required />
          </div>
          <div class="form-group">
            <label for="editFaculty">Faculty</label>
            <select id="editFaculty" v-model="editCourseData.faculty" required class="faculty-select">
              <option value="">Select a faculty</option>
              <option v-for="faculty in faculties" :key="faculty" :value="faculty">
                {{ faculty }}
              </option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="showEditCourseModal = false" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">Save Changes</button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import Modal from '@/components/Modal.vue';
import {
  adminFetchCourses,
  adminSearchStudents,
  adminFetchDeadlines,
  adminCreateCourse,
  adminEditCourse,
  adminDeleteCourse,
  adminCreateDeadline,
  adminEditDeadline,
  adminDeleteDeadline,
  adminFetchAllStudents
} from '@/services/api';

const store = useStore();
const toast = useToast();

const userInfo = computed(() => store.getters.getUserInfo);

const currentTab = ref('courses');
const searchQuery = ref('');
const studentSearchQuery = ref('');
const searchResults = ref([]);
const showCreateCourseModal = ref(false);
const showCreateDeadlineModal = ref(false);
const showCourseDetailsModal = ref(false);
const showEditCourseModal = ref(false);
const selectedCourse = ref(null);
const courses = ref([]);
const students = ref([]);
const deadlines = ref([]);
const totalStudents = ref(0);
const totalCourses = ref(0);
const activeDeadlines = ref(0);
const isLoading = ref(false);

const newCourse = ref({
  name: '',
  code: '',
  faculty: ''
});

const newDeadline = ref({
  course_id: '',
  title: '',
  description: '',
  due_date: '',
  priority: 'medium'
});

const editCourseData = ref({ name: '', code: '', faculty: '', course_id: null });

const courseDetails = ref({
  enrolledStudents: [],
  courseDeadlines: [],
  isLoading: false
});

const faculties = [
  'Faculty of Technology',
  'Faculty of Engineering',
  'Faculty of Science',
  'Faculty of Computing',
  'Faculty of Architecture',
  'Faculty of Business'
];

const tabs = [
  { id: 'courses', label: 'Courses' },
  { id: 'students', label: 'Students' },
  { id: 'deadlines', label: 'Deadlines' }
];

const filteredCourses = computed(() => {
  if (!searchQuery.value.trim()) return courses.value;
  const query = searchQuery.value.toLowerCase();
  return courses.value.filter(course => {
    const courseName = (course.course_name || course.name || '').toLowerCase();
    const courseCode = (course.course_code || course.code || '').toLowerCase();
    const faculty = (course.faculty || '').toLowerCase();
    return courseName.includes(query) || 
           courseCode.includes(query) || 
           faculty.includes(query);
  });
});

const filteredStudents = computed(() => {
  if (!studentSearchQuery.value.trim()) return students.value;
  const query = studentSearchQuery.value.toLowerCase();
  return students.value.filter(student => 
    student.up_number.toLowerCase().includes(query) ||
    student.name.toLowerCase().includes(query) ||
    student.email.toLowerCase().includes(query)
  );
});

const fetchAllStudents = async () => {
  try {
    isLoading.value = true;
    console.log('Fetching students...');
    const response = await adminFetchAllStudents(userInfo.value?.userId);
    console.log('Students response:', response);
    
    if (response && response.data) {
      students.value = Array.isArray(response.data) ? response.data : [response.data];
      totalStudents.value = students.value.length;
      console.log('Updated students:', students.value);
      console.log('Total students:', totalStudents.value);
    }
  } catch (error) {
    toast.error('Failed to fetch students');
    console.error('Error fetching students:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchCourses = async () => {
  try {
    isLoading.value = true;
    const response = await adminFetchCourses(userInfo.value?.userId);
    if (response && response.courses) {
      // Handle both array and single object responses
      const coursesData = response.courses;
      courses.value = Array.isArray(coursesData) ? coursesData : [coursesData];
      totalCourses.value = courses.value.length;
    }
  } catch (error) {
    toast.error('Failed to fetch courses');
    console.error('Error fetching courses:', error);
    courses.value = [];
  } finally {
    isLoading.value = false;
  }
};

const searchStudents = async () => {
  if (studentSearchQuery.value.length < 3) return;
  try {
    const response = await adminSearchStudents(studentSearchQuery.value);
    students.value = [response.data];
  } catch (error) {
    if (error.response?.status === 404) {
      students.value = [];
    } else {
      toast.error('Failed to search students');
      console.error('Error searching students:', error);
    }
  }
};

const fetchDeadlines = async () => {
  try {
    const response = await adminFetchDeadlines();
    deadlines.value = response.data;
    activeDeadlines.value = deadlines.value.filter(d => 
      new Date(d.due_date) > new Date()
    ).length;
  } catch (error) {
    toast.error('Failed to fetch deadlines');
    console.error('Error fetching deadlines:', error);
  }
};

const createCourse = async () => {
  try {
    const response = await adminCreateCourse(
      newCourse.value.name,
      newCourse.value.code,
      newCourse.value.faculty,
      userInfo.value.userId
    );
    
    // Add the new course to the courses list
    if (response && response.data) {
      const newCourseData = response.data;
      courses.value = [...courses.value, newCourseData];
      totalCourses.value = courses.value.length;
    }
    
    toast.success('Course created successfully');
    showCreateCourseModal.value = false;
    newCourse.value = {
      name: '',
      code: '',
      faculty: ''
    };
  } catch (error) {
    toast.error('Failed to create course');
    console.error('Error creating course:', error);
  }
};

const editCourse = async (course) => {
  try {
    const response = await adminEditCourse(course.course_id, course.course_name);
    // Update the course in the local state
    if (response && response.data) {
      const updatedCourse = response.data;
      courses.value = courses.value.map(c => 
        c.course_id === updatedCourse.course_id ? updatedCourse : c
      );
    }
    toast.success('Course updated successfully');
  } catch (error) {
    toast.error('Failed to update course');
    console.error('Error updating course:', error);
  }
};

const deleteCourse = async (courseId) => {
  if (!confirm('Are you sure you want to delete this course?')) return;
  try {
    await adminDeleteCourse(courseId);
    
    // Remove the course from the local state
    courses.value = courses.value.filter(course => course.course_id !== courseId);
    totalCourses.value = courses.value.length;
    
    toast.success('Course deleted successfully');
  } catch (error) {
    toast.error('Failed to delete course');
    console.error('Error deleting course:', error);
  }
};

const createDeadline = async () => {
  try {
    await adminCreateDeadline(newDeadline.value);
    toast.success('Deadline created successfully');
    showCreateDeadlineModal.value = false;
    newDeadline.value = {
      course_id: '',
      title: '',
      description: '',
      due_date: '',
      priority: 'medium'
    };
    await fetchDeadlines();
  } catch (error) {
    toast.error('Failed to create deadline');
    console.error('Error creating deadline:', error);
  }
};

const editDeadline = async (deadline) => {
  try {
    await adminEditDeadline(deadline.deadline_id, {
      title: deadline.title,
      description: deadline.description,
      due_date: deadline.due_date,
      priority: deadline.priority
    });
    toast.success('Deadline updated successfully');
    await fetchDeadlines();
  } catch (error) {
    toast.error('Failed to update deadline');
    console.error('Error updating deadline:', error);
  }
};

const deleteDeadline = async (deadlineId) => {
  if (!confirm('Are you sure you want to delete this deadline?')) return;
  try {
    await adminDeleteDeadline(deadlineId);
    toast.success('Deadline deleted successfully');
    await fetchDeadlines();
  } catch (error) {
    toast.error('Failed to delete deadline');
    console.error('Error deleting deadline:', error);
  }
};

const enrollStudent = async (student) => {
  // Implementation for enrolling a student in a course
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const viewCourseDetails = async (course) => {
  try {
    selectedCourse.value = course;
    showCourseDetailsModal.value = true;
    courseDetails.value.isLoading = true;

    // Fetch course deadlines
    const deadlinesResponse = await fetchDeadlines(course.course_id, userInfo.value?.userId, 1);
    if (deadlinesResponse && deadlinesResponse.data) {
      courseDetails.value.courseDeadlines = deadlinesResponse.data;
    }

    // Get enrolled students from the students list
    courseDetails.value.enrolledStudents = students.value.filter(student => 
      student.enrolled_courses?.includes(course.course_id)
    );

  } catch (error) {
    toast.error('Failed to load course details');
    console.error('Error loading course details:', error);
  } finally {
    courseDetails.value.isLoading = false;
  }
};

function openEditCourseModal(course) {
  editCourseData.value = {
    name: course.course_name || course.name,
    code: course.course_code || course.code,
    faculty: course.faculty,
    course_id: course.course_id
  };
  showEditCourseModal.value = true;
}

async function submitEditCourse() {
  try {
    const payload = {
      course_name: editCourseData.value.name,
      course_code: editCourseData.value.code,
      faculty: editCourseData.value.faculty
    };
    const query = `?course_id=${editCourseData.value.course_id}&admin_id=${userInfo.value.userId}`;
    const response = await adminEditCourse(query, payload);
    if (response && response.data) {
      const updatedCourse = response.data;
      courses.value = courses.value.map(c =>
        c.course_id === updatedCourse.course_id ? updatedCourse : c
      );
    }
    toast.success('Course updated successfully');
    showEditCourseModal.value = false;
  } catch (error) {
    toast.error('Failed to update course');
    console.error('Error updating course:', error);
  }
}

watch(studentSearchQuery, async (newQuery) => {
  if (newQuery.trim().length >= 3) {
    try {
      const response = await adminSearchStudents(newQuery.trim());
      if (response && response.data) {
        students.value = Array.isArray(response.data) ? response.data : [response.data];
      }
    } catch (error) {
      if (error.response?.status === 404) {
        students.value = [];
      } else {
        toast.error('Failed to search students');
        console.error('Error searching students:', error);
      }
    }
  } else {
    students.value = [];
  }
}, { debounce: 300 });

watch(currentTab, async (newTab) => {
  console.log('Tab changed to:', newTab);
  try {
    if (newTab === 'courses') {
      await fetchCourses();
    } else if (newTab === 'students') {
      await fetchAllStudents();
    } else if (newTab === 'deadlines') {
      await fetchDeadlines();
    }
  } catch (error) {
    console.error('Error in tab change:', error);
    toast.error('Failed to load data for this tab');
  }
});

onMounted(async () => {
  await fetchCourses(); // Fetch courses since it's the default tab
});
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
}

.create-course-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.create-course-btn:hover {
  background: #4338ca;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info h3 {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.stat-info p {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.tabs-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.tabs button {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  border-bottom: 2px solid transparent;
}

.tabs button.active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
}

.tabs button:hover {
  color: #4f46e5;
}

.tab-content {
  padding: 1.5rem;
}

.search-bar {
  position: relative;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.search-bar input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  background-color: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 15px;
  color: #1a202c;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-bar input::placeholder {
  color: #94A3B8;
}

.search-bar input:focus {
  outline: none;
  border-color: #CBD5E1;
  box-shadow: 0 0 0 1px #E2E8F0;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #94A3B8;
  pointer-events: none;
}

.search-bar svg {
  stroke-width: 2;
  width: 18px;
  height: 18px;
}

.courses-list, .students-list, .deadlines-list {
  display: grid;
  gap: 1rem;
}

.course-card, .student-card, .deadline-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.course-card:hover, .student-card:hover, .deadline-card:hover {
  transform: translateY(-2px);
}

.course-header, .deadline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.course-header h3, .deadline-header h3 {
  margin: 0;
  color: #1e293b;
}

.course-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.edit-btn:hover {
  background: #f1f5f9;
}

.delete-btn:hover {
  background: #fee2e2;
}

.course-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #64748b;
  font-size: 0.9rem;
}

.view-details-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.view-details-btn:hover {
  background: #4338ca;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
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

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-actions button[type="button"] {
  background: #f1f5f9;
  border: none;
  color: #64748b;
}

.form-actions button[type="submit"] {
  background: #4f46e5;
  border: none;
  color: white;
}

.form-actions button:hover {
  opacity: 0.9;
}

.create-deadline-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.create-deadline-btn:hover {
  background-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
}

.create-deadline-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.create-deadline-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group input::placeholder {
  color: #94a3b8;
}

.cancel-btn {
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #e2e8f0;
}

.submit-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background-color: #4338ca;
}

.create-course-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.faculty-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: all 0.2s ease;
  color: #1a202c;
  cursor: pointer;
}

.faculty-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.faculty-select option {
  padding: 0.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #e5e7eb;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  background-color: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 15px;
  color: #1a202c;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #CBD5E1;
  box-shadow: 0 0 0 1px #E2E8F0;
}

.search-input::placeholder {
  color: #94A3B8;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
  pointer-events: none;
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
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #e5e7eb;
  margin: 1rem 0;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1rem;
}

.create-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-btn:hover {
  background-color: #4338ca;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.student-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.student-avatar {
  width: 48px;
  height: 48px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.student-avatar svg {
  color: #6b7280;
}

.student-info {
  flex-grow: 1;
}

.student-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-item svg {
  flex-shrink: 0;
  color: #9ca3af;
}

.student-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.view-btn {
  background-color: #f3f4f6;
  color: #4b5563;
}

.view-btn:hover {
  background-color: #e5e7eb;
}

.enroll-btn {
  background-color: #4f46e5;
  color: white;
}

.enroll-btn:hover {
  background-color: #4338ca;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  text-align: center;
}

.empty-state svg {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #4b5563;
  font-size: 1rem;
  margin: 0;
}

.empty-state-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.search-bar {
  max-width: 500px;
  margin: 0 auto 2rem auto;
}

.search-input {
  padding-left: 2.5rem;
  font-size: 1rem;
}

.course-details-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  z-index: 1000;
  animation: modalFadeIn 0.3s ease-out;
}

.modal-header {
  position: sticky;
  top: 0;
  background: white;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  color: #6b7280;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.course-details {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 4rem);
  background: white;
}

.course-title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.course-title-section h3 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.course-code-badge {
  background-color: #f3f4f6;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-label {
  font-size: 0.875rem;
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
  background: linear-gradient(to right, #f9fafb, #f3f4f6);
  border: 1px solid #e5e7eb;
}

.stat-item {
  position: relative;
  padding: 1rem;
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -0.75rem;
  top: 20%;
  height: 60%;
  width: 1px;
  background: #e5e7eb;
}

.spinner {
  animation: spin 1s linear infinite, fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: overlayFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.action-buttons {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.section-header:hover .action-buttons {
  opacity: 1;
}
</style> 