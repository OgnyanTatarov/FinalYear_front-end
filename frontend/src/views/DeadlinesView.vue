<template>
  <div>
    <DeadlineList 
    :deadlines="deadlines"
    :course_name="courseName"
    />
    <Pagination
    :totalPages="total"
    :current-page="currentPage"
    @page-changed="fetchDeadlines"
  />
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination.vue';
import DeadlineList from '../components/DeadlineList.vue';
import {fetchDeadlines} from '@/services/api.js';
import { useToast } from 'vue-toastification';
import { onMounted, ref } from 'vue';
import router from '../router';
const toast = useToast();

const deadlines = ref([]);
const total = ref(0);
const currentPage = ref(1);


const { params, query } = router.currentRoute.value; 
const courseName = params.courseName; 
const userId = ref(query.userId);

const getDeadlines = async (courseName, userId, page) => {
try {
  const data = await fetchDeadlines(courseName ,userId, page);
  // Update reactive state
  deadlines.value = data;
  console.log(courseName)
  if( data.length > 20){
    total.value = (data.length % 20) + 1;
  } else {
    total.value = 1;
  };
  currentPage.value = page;
} catch (error) {
  toast.error("There was a problem while getting the deadlines for your courses!");
  console.error('error', error);
}
};

onMounted(() =>{
  getDeadlines(courseName, userId.value,1);
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
