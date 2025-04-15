import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  {
    path: '/',
    name:"Login",
    component: () => import('@/views/loginView.vue')
  },
  {
    path:'/register',
    name:'Registration',
    component: () => import('@/views/RegistrationView.vue')
  },
  { 
    path: '/courses', 
    name: 'Courses', 
    component: () => import('@/views/CoursesView.vue') 
  },
  {
    path: '/courses/:courseId/deadlines', 
    name: 'Deadlines', 
    component: () => import('@/views/DeadlinesView.vue'),
    props: (route) => ({
      courseId: route.params.courseId,
      userId: route.query.userId,
    }),
  },
  {
    path: '/courses/priority',
    name: 'Priority',
    component: () => import('../views/PriorityView.vue'),
    props: (route) => ({
      courseData: route.query.courseData ? 
        JSON.parse(decodeURIComponent(route.query.courseData)) : 
        null
    }),
    // meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: {
      requiresAuth: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
