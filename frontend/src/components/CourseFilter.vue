<template>
  <div class="filter-container">
    <button class="filter-btn" @click="toggleFilter">
      <i class="fas fa-filter"></i>
    </button>
    
    <div v-if="showFilter" class="filter-dropdown">
      <div class="filter-options">
        <h3>Filter Courses</h3>
        
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
        <div class="filter-group sort-direction">
          <label>Sort Direction:</label>
          <div class="sort-buttons">
            <button 
              type="button"
              :class="['sort-btn', { active: filters.sortOrder === 'asc' }]"
              @click="setSort('asc')"
            >
              <i class="fas fa-sort-amount-up"></i>
              Ascending
            </button>
            <button 
              type="button"
              :class="['sort-btn', { active: filters.sortOrder === 'desc' }]"
              @click="setSort('desc')"
            >
              <i class="fas fa-sort-amount-down"></i>
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
          <button class="clear-filters" @click="clearFilters">
            Clear Filters
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
}

.filter-btn {
  background: #3f51b5;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.filter-btn:hover {
  background: #2c3e9a;
}

.filter-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  min-width: 320px;
  z-index: 1000;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.filter-options h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.filter-group select,
.filter-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.range-inputs {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.range-inputs input {
  width: 45%;
}

.range-inputs span {
  color: #666;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.apply-btn {
  flex: 1;
  padding: 0.75rem;
  background: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.apply-btn:hover {
  background: #2c3e9a;
}

.clear-filters {
  flex: 1;
  padding: 0.75rem;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-filters:hover {
  background: #e0e0e0;
}

/* Animation */
.filter-dropdown {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sort-direction {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.sort-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.sort-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-btn i {
  font-size: 0.9rem;
}

.sort-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.sort-btn.active {
  background: #3f51b5;
  color: white;
  border-color: #3f51b5;
}

/* Make buttons more touch-friendly on mobile */
@media (max-width: 480px) {
  .sort-buttons {
    flex-direction: column;
  }
  
  .sort-btn {
    padding: 0.75rem;
  }
}
</style> 