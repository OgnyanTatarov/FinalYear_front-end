import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { 
    path: '/courses', 
    name: 'Courses', 
    component: () => import('@/views/CoursesView.vue') 
  },
  {
    path: '/courses/:courseName/deadlines', 
    name: 'Deadlines', 
    component: () => import('@/views/DeadlinesView.vue'),
    props: (route) => ({
      courseName: route.params.courseName,
      userId: route.query.userId,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
