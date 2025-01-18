<template>
  <div>
    <h1>Your Courses</h1>
    <CourseCard
      v-for="course in courses"
      :key="course.course_id"
      :course="course"
      @view-deadlines="fetchDeadlines(course.course_name,userId.value)"
    />

    <Pagination
      :totalPages="total"
      :current-page="currentPage"
      @page-changed="fetchCourses"
    />
  </div>
</template>

<script setup>
import CourseCard from '@/components/CourseCard.vue';
import Pagination from '@/components/Pagination.vue';
import { fetchCourses } from '@/services/api.js';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import router from '../router';

const toast = useToast();
  
const courses = ref([]);
const total = ref(0);
const currentPage = ref(1);
const userId = ref(-1);

const getCourses = async (userId, page) => {
  try {
    const data = await fetchCourses(userId, page);
    userId = userId;
    // Update reactive state
    courses.value = data;
    if( data.length > 20){
      total.value = (data.length % 20) + 1;
    } else {
      total.value = data.length;
    };
    currentPage.value = page;
  } catch (error) {
    toast.error("There was a problem while getting the courses!");
    console.error('error:', error);
    return;
  }
};
    
  const  fetchDeadlines = async(courseName, userId) => {
      router.push({
      name: 'Deadlines', 
      params: { courseName: courseName }, 
      query:  {userId: 1} , 
    });
  };
  
onMounted(async () => {
  await getCourses(1,currentPage.value);
});

</script>
