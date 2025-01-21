<template>
  <div>
    <DeadlineList 
    :deadlines="deadlines"
    :course_name="courseName"
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
import { fetchDeadlines } from '@/services/api.js';
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

const courseName = route.params.courseName;
const userId = route.query.userId;

// Get current course from store
const currentCourse = computed(() => 
  store.getters.getCourses.find(course => course.course_name === courseName)
);

const getDeadlines = async (page = 1) => {
  try {
    const response = await fetchDeadlines(courseName, userId, page);
    // Update store instead of local state
    store.commit('setDeadlines', response.items);
    
    // Update total items for pagination
    if (response.total_items) {
      totalItems.value = response.total_items;
    }
    currentPage.value = page;
  } catch (error) {
    toast.error("There was a problem while getting the deadlines for your courses!");
    console.error('error', error);
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
