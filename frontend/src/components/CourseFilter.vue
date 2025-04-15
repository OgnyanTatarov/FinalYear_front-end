<template>
  <div class="filter-container">
    <button class="filter-btn" @click="toggleFilter">
      <span class="filter-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </span>
      <span class="filter-text">Filter Courses</span>
    </button>
    
    <div v-if="showFilter" class="filter-dropdown">
      <div class="filter-options">
        <div class="filter-header">
          <h3>Filter Courses</h3>
          <button class="close-btn" @click="toggleFilter">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <!-- Sort Field Selection -->
        <div class="filter-group">
          <label for="sortField">Sort By:</label>
          <select 
            id="sortField" 
            v-model="filters.sortField"
          >
            <option value="course_name">Course Name</option>
            <option value="admin_name">Lecturer Name</option>
            <option value="total_assinments">Total Assignments</option>
          </select>
        </div>

        <!-- Sort Direction -->
        <div class="filter-group">
          <label>Sort Direction:</label>
          <div class="sort-buttons">
            <button 
              type="button"
              :class="['sort-btn', { active: filters.sortOrder === 'asc' }]"
              @click="setSort('asc')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <polyline points="6 10 12 4 18 10"></polyline>
              </svg>
              Ascending
            </button>
            <button 
              type="button"
              :class="['sort-btn', { active: filters.sortOrder === 'desc' }]"
              @click="setSort('desc')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="4" x2="12" y2="20"></line>
                <polyline points="18 14 12 20 6 14"></polyline>
              </svg>
              Descending
            </button>
          </div>
        </div>

        <!-- Priority Filter -->
        <div class="filter-group">
          <label for="priority">Priority Level:</label>
          <select 
            id="priority" 
            v-model="filters.priority"
          >
            <option value="">All Priorities</option>
            <option :value="1">Low</option>
            <option :value="2">Medium</option>
            <option :value="3">High</option>
          </select>
        </div>

        <!-- Course Name Filter -->
        <div class="filter-group">
          <label for="courseName">Course Name:</label>
          <input 
            type="text" 
            id="courseName" 
            v-model="filters.course_name"
            placeholder="Search by course name"
          >
        </div>

        <!-- Admin Name Filter -->
        <div class="filter-group">
          <label for="adminName">Lecturer Name:</label>
          <input 
            type="text" 
            id="adminName" 
            v-model="filters.admin_name"
            placeholder="Search by lecturer name"
          >
        </div>

        <div class="filter-actions">
          <button class="apply-btn" @click="applyFilters">
            Apply Filters
          </button>
          <button class="clear-btn" @click="clearFilters">
            Clear All
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { useStore } from 'vuex';

const emit = defineEmits(['filter-changed']);

const store = useStore();
const filterState = computed(() => store.getters.getFilterState);

const showFilter = ref(false);
const filters = reactive({
  sortField: filterState.value.currentFilters?.filters?.filter[0]?.filter_name || 'priority',
  sortOrder: filterState.value.currentFilters?.filters?.filter[0]?.value?.toLowerCase() || 'asc',
  priority: '',
  course_name: '',
  admin_name: '',
});

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const setSort = (direction) => {
  filters.sortOrder = direction;
};

const applyFilters = () => {
  const filterQuery = {
    filters: {
      filter: []
    }
  };

  // Add sorting filter
  if (filters.sortField && filters.sortOrder) {
    filterQuery.filters.filter.push({
      filter_name: filters.sortField,
      order: filters.sortOrder.toUpperCase()
    });
  }

  // Add priority filter
  if (filters.priority !== '') {
    filterQuery.filters.filter.push({
      filter_name: 'priority',
      order: filters.priority,
      operator: '='
    });
  }

  // Add course name filter
  if (filters.course_name) {
    filterQuery.filters.filter.push({
      filter_name: 'course_name',
      order: filters.course_name,
      operator: 'LIKE'
    });
  }

  // Add admin name filter
  if (filters.admin_name) {
    filterQuery.filters.filter.push({
      filter_name: 'admin_name',
      order: filters.admin_name,
      operator: 'LIKE'
    });
  }

  emit('filter-changed', filterQuery);
  showFilter.value = false; // Close dropdown after applying
};

const clearFilters = async () => {
  try {
    filters.sortField = 'priority';
    filters.sortOrder = 'asc';
    Object.keys(filters).forEach(key => {
      filters[key] = '';
    });
    
    await store.dispatch('clearFilters', {
      userId: store.getters.getUserInfo.userId,
      page: 1 // Reset to first page when clearing filters
    });
    
    showFilter.value = false;
  } catch (error) {
    console.error('Error clearing filters:', error);
  }
};

// Close filter dropdown when clicking outside
const handleClickOutside = (event) => {
  const filterContainer = document.querySelector('.filter-container');
  if (filterContainer && !filterContainer.contains(event.target)) {
    showFilter.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.filter-container {
  position: relative;
  z-index: 100;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #1a1a1a;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-btn:hover {
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
}

.filter-icon {
  display: flex;
  align-items: center;
  color: #3b82f6;
}

.filter-text {
  font-size: 0.95rem;
}

.filter-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  min-width: 320px;
  max-width: 90vw;
  z-index: 1000;
  animation: slideIn 0.2s ease-out;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.filter-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.close-btn {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #1a1a1a;
}

.filter-group {
  margin-bottom: 1.25rem;
}

.filter-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.filter-group select,
.filter-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.filter-group select:focus,
.filter-group input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.sort-buttons {
  display: flex;
  gap: 8px;
}

.sort-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  background: #f1f5f9;
}

.sort-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.apply-btn,
.clear-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-btn {
  background: #3b82f6;
  color: white;
}

.apply-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.clear-btn {
  background: #f1f5f9;
  color: #64748b;
}

.clear-btn:hover {
  background: #e2e8f0;
  color: #1a1a1a;
  transform: translateY(-1px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .filter-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: fadeIn 0.2s ease-out;
  }

  .sort-buttons {
    flex-direction: column;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -45%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
}
</style> 