<template>
    <div id="app">
      <header>
        <h1>My Final Year Project</h1>
      </header>
      <main>
        <!-- Dynamically load pages based on routes -->
        <router-view />
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
  };
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
  
  