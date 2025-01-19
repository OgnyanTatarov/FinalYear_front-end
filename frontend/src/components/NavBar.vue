<template>
    <nav class="navbar">
      <div class="navbar-left">
        <!-- Back button - hidden on courses page -->
        <button 
          v-if="shouldShowBackButton" 
          class="back-btn" 
          @click="goBack"
        >
          ← Back
        </button>
        <!-- Project name -->
        <h1 class="project-name">Deadline Tracker</h1>
      </div>
      <div class="navbar-right">
        <!-- Future links -->
        <router-link to="/courses" class="nav-link">Dashboard</router-link>
        <router-link to="/settings" class="nav-link">Settings</router-link>
        <!-- Changed to button for logout -->
        <button @click="handleLogout" class="nav-link logout">Logout</button>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import { useToast } from 'vue-toastification';
  
  const router = useRouter();
  const route = useRoute();
  const store = useStore();
  const toast = useToast();
  
  // Compute whether back button should be shown
  const shouldShowBackButton = computed(() => {
    return route.name !== 'Courses';
  });
  
  // Method to navigate back to the previous page
  const goBack = () => {
    router.back();
  };
  
  // Logout handler
  const handleLogout = async () => {
    try {
      // Dispatch logout action to clear the store
      await store.dispatch('logout');
      
      // Redirect to login page
      await router.push('/');
      
      // Show success message
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error during logout');
      console.error('Logout error:', error);
    }
  };
  </script>


<style scoped>
/* Base styling for navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #3f51b5; /* Primary color */
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Left section: Back button and project name */
.navbar-left {
  display: flex;
  align-items: center;
}

.back-btn {
  background-color: transparent;
  color: white;
  border: none;
  font-size: 1.2rem;
  margin-right: 15px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: #ff9800; /* Hover effect */
}

.project-name {
  font-size: 1.5rem;
  margin: 0;
  font-weight: bold;
}

/* Right section: Links */
.navbar-right {
  display: flex;
  align-items: center;
}

.nav-link {
  margin-left: 20px;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ff9800; /* Hover effect */
}

.logout {
  font-weight: bold;
  color: #f44336; /* Red for logout */
}

.logout:hover {
  color: #ff7961;
}

/* Responsive Design */
@media (max-width: 768px) {
  .project-name {
    font-size: 1.2rem;
  }

  .nav-link {
    font-size: 0.9rem;
  }
}
</style>