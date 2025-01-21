<template>
  <div>
    <div class="header-section">
      <h1>Your Courses</h1>
      <CourseFilter @filter-changed="handleFilterChange" />
    </div>
    
    <CourseCard
      v-for="course in courses"
      :key="course.course_id"
      :course="course"
      @view-deadlines="fetchDeadlines(course.course_name,course.user_id)"
    />

    <Pagination
      :currentPage="currentPage"
      :totalItems="totalItems"
      :itemsPerPage="20"
      @page-changed="handlePageChange"
    />
  </div>
</template>

<script setup>
import CourseCard from '@/components/CourseCard.vue';
import Pagination from '@/components/Pagination.vue';
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import CourseFilter from '@/components/CourseFilter.vue';

const store = useStore();
const router = useRouter();
const toast = useToast();

// Use computed property to get courses from store
const courses = computed(() => store.getters.getCourses);
const filterState = computed(() => store.getters.getFilterState);
const totalItems = ref(0);
const currentPage = computed({
  get: () => filterState.value.currentPage,
  set: (val) => store.commit('setFilterState', { ...filterState.value, currentPage: val })
});
const userInfo = computed(() => store.getters.getUserInfo);

const handleFilterChange = async (filterData) => {
  try {
    const response = await store.dispatch('filterCoursesList', {
      userId: userInfo.value.userId,
      page: currentPage.value,
      filters: filterData
    });

    // Update store with filtered courses
    store.commit('setCourses', response.items);
    if(!response.items){
      toast.error("No courses found with those filters!");
      await getCourses(currentPage.value);
      return;
    }
    
    // Update total items for pagination
    if (response.items[0]?.total_items) {
      totalItems.value = response.items[0].total_items;
    }
  } catch (error) {
    toast.error("Error applying filters!");
    console.error('Filter error:', error);
  }
};

const handlePageChange = async (page) => {
  try {
    if (filterState.value.isFiltered && filterState.value.currentFilters) {
      const response = await store.dispatch('filterCoursesList', {
        userId: userInfo.value.userId,
        page: page,
        filters: filterState.value.currentFilters
      });
      store.commit('setCourses', response.items);
    } else {
      const response = await getCourses(page);
      store.commit('setCourses', response.items);
    }
    
    store.commit('setFilterState', { 
      ...filterState.value, 
      currentPage: page 
    });
  } catch (error) {
    toast.error("Error changing page!");
    console.error('Page change error:', error);
  }
};

const getCourses = async (page = 1) => {
  try {
    const response = await store.dispatch('refreshCourses', {
      userId: userInfo.value.userId,
      page
    });
    
    // Update store with new courses
    store.commit('setCourses', response.items);
    
    // Update total items from the first course object
    if (response.items[0]?.total_items) {
      totalItems.value = response.items[0].total_items;
    }
    return response;
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
  if (!userInfo.value.userId) {
    router.push('/');
    return;
  }
  
  if (filterState.value.isFiltered && filterState.value.currentFilters) {
    await handleFilterChange(filterState.value.currentFilters);
  } else {
    await getCourses(currentPage.value);
  }
});
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}
</style>
