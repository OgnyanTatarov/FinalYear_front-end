<template>
  <div>
    
    <h1>Your Courses</h1>
    <CourseCard
      v-for="course in courses"
      :key="course.course_id"
      :course="course"
      @view-deadlines="fetchDeadlines(course.course_name,course.user_id)"
    />

    <Pagination
      :totalPages="total"
      :current-page="currentPage"
      @page-changed="getCourses"
    />
  </div>
</template>

<script setup>
import CourseCard from '@/components/CourseCard.vue';
import Pagination from '@/components/Pagination.vue';
import { fetchCourses } from '@/services/api.js';
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const toast = useToast();

// Use computed property to get courses from store
const courses = computed(() => store.getters.getCourses);
const total = ref(0);
const currentPage = ref(1);
const userInfo = computed(() => store.getters.getUserInfo);

const getCourses = async (page = 1) => {
  try {
    // Only fetch if we don't have courses or if explicitly requesting a page
    if (!courses.value.length || page !== currentPage.value) {
      const data = await fetchCourses(userInfo.value.userId, page);
      store.commit('setCourses', data);
      total.value = data.length > 20 ? Math.ceil(data.length / 20) : 1;
      currentPage.value = page;
    } else {
      // Use existing data to set total and current page
      total.value = courses.value.length > 20 ? Math.ceil(courses.value.length / 20) : 1;
    }
  } catch (error) {
    toast.error("There was a problem while getting the courses!");
    console.error('error:', error);
  }
};

const fetchDeadlines = async(courseName, userId) => {
  router.push({
    name: 'Deadlines', 
    params: { courseName }, 
    query: { userId: userId}, 
  });
};

onMounted(async () => {
  // Check if user is logged in
  if (!userInfo.value.userId) {
    router.push('/');
    return;
  }
  await getCourses(currentPage.value);
});
</script>
