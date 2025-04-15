<template>
  <div class="ml-suggestions">
    <div class="suggestions-header">
      <h2>Personalized Revision Suggestions</h2>
      <p class="subtitle">Based on your learning patterns and performance</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Analyzing your study data...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchSuggestions" class="retry-button">Try Again</button>
    </div>

    <div v-else class="suggestions-content">
      <div class="suggestion-card" v-for="(suggestion, index) in suggestions" :key="index">
        <div class="card-header">
          <h3>{{ suggestion.topic }}</h3>
          <span class="priority-badge" :class="suggestion.priority">
            {{ suggestion.priority }}
          </span>
        </div>
        <div class="card-body">
          <p>{{ suggestion.reason }}</p>
          <div class="metrics">
            <div class="metric">
              <span class="metric-label">Performance</span>
              <div class="progress-bar">
                <div class="progress" :style="{ width: suggestion.performance + '%' }"></div>
              </div>
            </div>
            <div class="metric">
              <span class="metric-label">Time Since Last Review</span>
              <span class="metric-value">{{ suggestion.lastReview }}</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="action-button" @click="startRevision(suggestion)">
            Start Revision
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mlService from '@/services/ml.service';

export default {
  name: 'MLSuggestions',
  data() {
    return {
      suggestions: [],
      loading: false,
      error: null
    };
  },
  async created() {
    await this.fetchSuggestions();
  },
  methods: {
    async fetchSuggestions() {
      this.loading = true;
      this.error = null;
      try {
        // Get user data from your store or local storage
        const userData = {
          completedTopics: [], // Add your actual data here
          quizScores: {},     // Add your actual data here
          timeSpent: {}       // Add your actual data here
        };
        
        this.suggestions = await mlService.getRevisionSuggestions(userData);
      } catch (err) {
        this.error = 'Failed to load suggestions. Please try again later.';
        console.error('Error fetching suggestions:', err);
      } finally {
        this.loading = false;
      }
    },
    startRevision(suggestion) {
      // Implement navigation to the revision page
      this.$router.push({
        name: 'Revision',
        params: { topic: suggestion.topic }
      });
    }
  }
};
</script>

<style scoped>
.ml-suggestions {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.suggestions-header {
  text-align: center;
  margin-bottom: 2rem;
}

.suggestions-header h2 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.suggestions-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.suggestion-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.suggestion-card:hover {
  transform: translateY(-5px);
}

.card-header {
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.priority-badge.high {
  background: #ff6b6b;
  color: white;
}

.priority-badge.medium {
  background: #ffd93d;
  color: #2c3e50;
}

.priority-badge.low {
  background: #6cff6b;
  color: #2c3e50;
}

.card-body {
  padding: 1rem;
}

.metrics {
  margin-top: 1rem;
}

.metric {
  margin-bottom: 0.5rem;
}

.metric-label {
  display: block;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.progress-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #3498db;
  border-radius: 4px;
}

.card-footer {
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  text-align: center;
}

.action-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.action-button:hover {
  background: #2980b9;
}

.loading-container {
  text-align: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.retry-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.retry-button:hover {
  background: #2980b9;
}
</style> 