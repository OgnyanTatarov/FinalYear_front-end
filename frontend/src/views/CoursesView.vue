<template>
  <div class="courses-container">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Your Courses</h1>
          <p class="page-subtitle">Manage and track your academic progress</p>
        </div>
        <div class="header-actions">
          <CourseFilter @filter-changed="handleFilterChange" />
        </div>
      </div>
      
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-label">Total Courses</span>
          <span class="stat-value">{{ totalItems }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Active Filters</span>
          <span class="stat-value">{{ filterState.isFiltered ? 'Yes' : 'No' }}</span>
        </div>
      </div>
    </div>
    
    <div class="courses-grid">
      <CourseCard
        v-for="course in courses"
        :key="course.course_id"
        :course="course"
        @view-deadlines="fetchDeadlines({ courseId: course.course_id, userId: course.user_id })"
      />
    </div>

    <div class="pagination-wrapper">
      <Pagination
        :currentPage="currentPage"
        :totalItems="totalItems"
        :itemsPerPage="20"
        @page-changed="handlePageChange"
      />
    </div>
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

const fetchDeadlines = async({ courseId, userId }) => {
  router.push({
    name: 'Deadlines', 
    params: { courseId }, 
    query: { userId }, 
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
.courses-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 72px);
}

.page-header {
  margin-bottom: 3rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

.header-actions {
  margin-left: 2rem;
}

.stats-bar {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .courses-container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }

  .header-actions {
    margin-left: 0;
  }

  .page-title {
    font-size: 2rem;
  }

  .stats-bar {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .courses-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
