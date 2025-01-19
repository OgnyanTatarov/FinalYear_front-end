<template>
    <div class="pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
  
      <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
  
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';

  const name = "Pagination";
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  });

  const emit = defineEmits(['page-changed']);

  const changePage = (newPage) => {
    emit('page-changed', newPage);
  };
    //   currentPage: {
    //     type: Number,
    //     required: true,
    //   },
    //   totalPages: {
    //     type: Number,
    //     required: true,
    //   },
    // },
    // emits: ["page-changed"],
    // methods: {
    //   changePage(newPage) {
    //     this.$emit("page-changed", newPage);
    //   },
    // },
  </script>
  
  <style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
  font-family: 'Arial', sans-serif;
}

.pagination-info {
  font-size: 1rem;
  color: #555;
}

.pagination-btn {
  background-color: #3f51b5; /* Primary color */
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.pagination-btn:hover {
  background-color: #2c3e9a; /* Hover color */
  transform: scale(1.05); /* Slight scaling effect */
}

.pagination-btn:disabled {
  background-color: #ccc; /* Disabled color */
  color: #777;
  cursor: not-allowed;
}

.pagination-btn:disabled:hover {
  transform: none; /* No hover effect on disabled buttons */
}

  </style>
  