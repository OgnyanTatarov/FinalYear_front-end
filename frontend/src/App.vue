<template>
    <div id="app">
      <header>
        <h1>My Final Year Project</h1>
      </header>
      <main>
        <Navbar v-if="shouldShowNavbar"/>
        <!-- Dynamically load pages based on routes -->
        <router-view />
      </main>
    </div>
  </template>
  
<script setup>
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';
  import Navbar from '../src/components/NavBar.vue';
  
  defineOptions({
    name: 'App',
  });

  const route = useRoute();

  // Compute whether navbar should be shown based on current route
  const shouldShowNavbar = computed(() => {
    const hiddenPaths = ['/', '/register'];
    return !hiddenPaths.includes(route.path);
  });
</script>
  
<style>
  /* Global styles */
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  header {
    background-color: #3f51b5;
    color: white;
    padding: 1rem;
    text-align: center;
  }
  main {
    padding: 1rem;
  }
</style>
  
  