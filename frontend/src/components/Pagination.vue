<template>
  <div class="pagination">
    <button
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
      <span>Previous</span>
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
      <span>Next</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
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
  gap: 1rem;
  margin: 2rem 0;
  font-family: system-ui, -apple-system, sans-serif;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 12px;
  padding: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-number:hover:not(.active) {
  background: #f1f5f9;
  color: #1e293b;
  transform: translateY(-1px);
}

.page-number.active {
  background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #64748b;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pagination-btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f1f5f9;
  color: #1e293b;
  transform: translateY(-1px);
}

.pagination-btn:hover:not(:disabled) svg {
  transform: translateX(-2px);
}

.pagination-btn:last-child:hover:not(:disabled) svg {
  transform: translateX(2px);
}

.pagination-btn:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.7;
}

@media (max-width: 480px) {
  .pagination {
    gap: 0.75rem;
  }

  .page-numbers {
    display: none;
  }

  .pagination-btn {
    padding: 0.75rem 1rem;
  }

  .pagination-btn span {
    display: none;
  }

  .pagination-btn svg {
    margin: 0;
  }
}
</style>
  