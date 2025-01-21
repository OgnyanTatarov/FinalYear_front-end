<template>
  <div class="pagination">
    <button
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      Previous
    </button>

    <div class="page-numbers">
      <button 
        v-for="pageNumber in displayedPages" 
        :key="pageNumber"
        class="page-number"
        :class="{ active: pageNumber === currentPage }"
        @click="changePage(pageNumber)"
      >
        {{ pageNumber }}
      </button>
    </div>

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
import { defineProps, computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 20
  }
});

const emit = defineEmits(['page-changed']);

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

const displayedPages = computed(() => {
  const pages = [];
  const maxDisplayed = 5; // Show max 5 page numbers
  let start = Math.max(1, props.currentPage - 2);
  let end = Math.min(totalPages.value, start + maxDisplayed - 1);

  if (end - start + 1 < maxDisplayed) {
    start = Math.max(1, end - maxDisplayed + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    emit('page-changed', newPage);
  }
};
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

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number.active {
  background-color: #3f51b5;
  color: white;
}

.page-number:hover:not(.active) {
  background-color: #e0e0e0;
}

.pagination-btn {
  background-color: #3f51b5;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #2c3e9a;
  transform: scale(1.05);
}

.pagination-btn:disabled {
  background-color: #ccc;
  color: #777;
  cursor: not-allowed;
}

.pagination-btn:disabled:hover {
  transform: none;
}

@media (max-width: 480px) {
  .page-numbers {
    display: none; /* Hide page numbers on mobile */
  }
  
  .pagination {
    gap: 10px;
  }
}
</style>
  