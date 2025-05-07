import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';


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
  {
    path: '/suggestions',
    name: 'MLSuggestions',
    component: () => import('@/views/SuggestionsView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/revision/:topic',
    name: 'Revision',
    component: () => import('@/views/RevisionView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/courses/:courseId',
    name: 'AdminCourseDetails',
    component: () => import('@/views/CourseDetails.vue'),
    props: true,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check for authentication and admin access
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.getUserInfo?.userId;
  const isAdmin = store.getters.getUserRole === 'admin';

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/courses');
  } else {
    next();
  }
});

export default router;
