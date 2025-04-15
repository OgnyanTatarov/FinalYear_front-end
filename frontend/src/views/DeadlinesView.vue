<template>
  <div>
    <DeadlineList 
    :deadlines="deadlines"
    :course_name="currentCourse?.course_name"
    @update-priority="handlePriorityUpdate"
    @update-progress="handleProgressUpdate"
    />
    <Pagination
    :currentPage="currentPage"
    :totalItems="totalItems"
    :itemsPerPage="20"
    @page-changed="getDeadlines"
  />
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination.vue';
import DeadlineList from '../components/DeadlineList.vue';
import { fetchDeadlines, updateDeadlinePriority, updateDeadlineProgress } from '@/services/api.js';
import { useToast } from 'vue-toastification';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const toast = useToast();
const route = useRoute();
const store = useStore();

const deadlines = computed(() => store.getters.getDeadlines);
const totalItems = ref(0);
const currentPage = ref(1);

const courseId = route.params.courseId;
const userId = route.query.userId;

// Get current course from store
const currentCourse = computed(() => 
  store.getters.getCourses.find(course => course.course_id === courseId)
);

const getDeadlines = async (page = 1) => {
  try {
    const response = await fetchDeadlines(courseId, userId, page);
    // Update store with new deadlines
    store.commit('setDeadlines', response);
    
    // Update total items for pagination
    if (response.total_items) {
      totalItems.value = response.total_items;
    }
    currentPage.value = page;
  } catch (error) {
    toast.error("There was a problem while getting the deadlines for your course!");
    console.error('error', error);
  }
};

const handlePriorityUpdate = async ({ deadlineId, priority }) => {
  try {
    await updateDeadlinePriority(deadlineId, userId, priority);
    // Refresh deadlines after update
    await getDeadlines(currentPage.value);
  } catch (error) {
    toast.error("Failed to update deadline priority");
    console.error('Error:', error);
  }
};

const handleProgressUpdate = async ({ deadlineId, progress }) => {
  try {
    await updateDeadlineProgress(deadlineId, userId, progress);
    // Refresh deadlines to get updated data
    await getDeadlines(currentPage.value);
    toast.success("Progress updated successfully");
  } catch (error) {
    toast.error("Failed to update deadline progress");
    console.error('Error:', error);
  }
};

onMounted(() => {
  getDeadlines(1);
});

// export default {
//   name: "DeadlinesView",
//   props: {
//     courseName: {
//       type: String,
//       required: true,
//     },
//   },
//   components: {Pagination },
//   data() {
//     return {
//       deadlines: [],// List of deadlines
//       totalCourses: 0, 
//       currentPage: 1,
//     };
//   },
//   mounted() {
//     this.fetchDeadlines();
//   },

</script>

<style scoped>
h1 {
  color: #3f51b5;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
