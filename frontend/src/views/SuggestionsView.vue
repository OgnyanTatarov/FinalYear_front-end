<template>
  <div class="suggestions-view">
    <div class="view-header">
      <h1>Smart Revision Suggestions</h1>
      <p class="subtitle">AI-powered recommendations to optimize your study time</p>
    </div>

    <div class="view-content">
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Time Saved</h3>
            <p>{{ timeSaved }} hours</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Success Rate</h3>
            <p>{{ successRate }}%</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <h3>Active Users</h3>
            <p>{{ activeUsers }}</p>
          </div>
        </div>
      </div>

      <div class="filters-container">
        <div class="filter-group">
          <label>Sort By:</label>
          <select v-model="sortBy" @change="handleSortChange">
            <option value="priority">Priority</option>
            <option value="performance">Performance</option>
            <option value="lastReview">Last Review</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Filter:</label>
          <select v-model="filterBy" @change="handleFilterChange">
            <option value="all">All Topics</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      <MLSuggestions ref="mlSuggestions" />
    </div>
  </div>
</template>

<script>
import MLSuggestions from '@/components/MLSuggestions.vue';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'SuggestionsView',
  components: {
    MLSuggestions
  },
  setup() {
    const store = useStore();
    const mlSuggestions = ref(null);
    const timeSaved = ref(0);
    const successRate = ref(0);
    const activeUsers = ref(0);
    const sortBy = ref('priority');
    const filterBy = ref('all');

    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API calls
        timeSaved.value = 42;
        successRate.value = 87;
        activeUsers.value = 156;
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const handleSortChange = () => {
      if (mlSuggestions.value) {
        mlSuggestions.value.sortSuggestions(sortBy.value);
      }
    };

    const handleFilterChange = () => {
      if (mlSuggestions.value) {
        mlSuggestions.value.filterSuggestions(filterBy.value);
      }
    };

    onMounted(() => {
      fetchStats();
    });

    return {
      mlSuggestions,
      timeSaved,
      successRate,
      activeUsers,
      sortBy,
      filterBy,
      handleSortChange,
      handleFilterChange
    };
  }
};
</script>

<style scoped>
.suggestions-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.view-header {
  text-align: center;
  margin-bottom: 3rem;
}

.view-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.2rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  color: #4f46e5;
}

.stat-info h3 {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

.stat-info p {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.25rem 0 0;
}

.filters-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  background: white;
  color: #2c3e50;
  font-size: 0.9rem;
  cursor: pointer;
}

.filter-group select:focus {
  outline: none;
  border-color: #4f46e5;
}

@media (max-width: 768px) {
  .suggestions-view {
    padding: 1rem;
  }

  .view-header h1 {
    font-size: 2rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .filters-container {
    flex-direction: column;
  }
}
</style> 