<template>
  <div class="revision-view">
    <div class="revision-header">
      <div class="header-content">
        <h1>{{ topic }}</h1>
        <p class="subtitle">Revision Session</p>
      </div>
      <div class="header-stats">
        <div class="stat">
          <span class="stat-label">Time Spent</span>
          <span class="stat-value">{{ formatTime(timeSpent) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Progress</span>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="revision-content">
      <div class="content-section" v-if="currentSection">
        <h2>{{ currentSection.title }}</h2>
        <div class="section-content">
          <div v-if="currentSection.type === 'text'" class="text-content">
            <p v-for="(paragraph, index) in currentSection.content" :key="index">
              {{ paragraph }}
            </p>
          </div>
          <div v-else-if="currentSection.type === 'quiz'" class="quiz-content">
            <div class="question">
              <h3>{{ currentSection.question }}</h3>
              <div class="options">
                <button 
                  v-for="(option, index) in currentSection.options" 
                  :key="index"
                  class="option-btn"
                  :class="{ 
                    'selected': selectedAnswer === index,
                    'correct': showAnswer && index === currentSection.correctAnswer,
                    'incorrect': showAnswer && selectedAnswer === index && selectedAnswer !== currentSection.correctAnswer
                  }"
                  @click="selectAnswer(index)"
                  :disabled="showAnswer"
                >
                  {{ option }}
                </button>
              </div>
            </div>
            <div class="quiz-actions">
              <button 
                v-if="!showAnswer" 
                class="submit-btn"
                @click="checkAnswer"
                :disabled="selectedAnswer === null"
              >
                Submit Answer
              </button>
              <button 
                v-else 
                class="next-btn"
                @click="nextQuestion"
              >
                Next Question
              </button>
            </div>
          </div>
          <div v-else-if="currentSection.type === 'practice'" class="practice-content">
            <div class="practice-problem">
              <h3>{{ currentSection.problem }}</h3>
              <div class="solution-input">
                <textarea 
                  v-model="practiceAnswer"
                  placeholder="Type your solution here..."
                  rows="4"
                ></textarea>
              </div>
              <div class="practice-actions">
                <button 
                  class="submit-btn"
                  @click="submitPractice"
                  :disabled="!practiceAnswer"
                >
                  Submit Solution
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation-buttons">
        <button 
          class="nav-btn prev"
          @click="previousSection"
          :disabled="currentSectionIndex === 0"
        >
          Previous
        </button>
        <button 
          class="nav-btn next"
          @click="nextSection"
          :disabled="currentSectionIndex === sections.length - 1"
        >
          Next
        </button>
      </div>
    </div>

    <div class="revision-sidebar">
      <div class="sidebar-header">
        <h3>Revision Progress</h3>
      </div>
      <div class="sections-list">
        <div 
          v-for="(section, index) in sections" 
          :key="index"
          class="section-item"
          :class="{ 
            'active': index === currentSectionIndex,
            'completed': section.completed
          }"
          @click="goToSection(index)"
        >
          <div class="section-icon">
            <svg v-if="section.type === 'text'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <svg v-else-if="section.type === 'quiz'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span class="section-title">{{ section.title }}</span>
          <div class="section-status">
            <svg v-if="section.completed" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

export default {
  name: 'RevisionView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const toast = useToast();

    const topic = ref(route.params.topic);
    const timeSpent = ref(0);
    const progress = ref(0);
    const currentSectionIndex = ref(0);
    const selectedAnswer = ref(null);
    const showAnswer = ref(false);
    const practiceAnswer = ref('');
    const sections = ref([
      {
        title: 'Introduction',
        type: 'text',
        content: [
          'This topic covers the fundamental concepts and principles.',
          'Let\'s start with a brief overview of the key points.'
        ],
        completed: false
      },
      {
        title: 'Key Concepts Quiz',
        type: 'quiz',
        question: 'What is the main principle discussed in this topic?',
        options: [
          'Option A',
          'Option B',
          'Option C',
          'Option D'
        ],
        correctAnswer: 1,
        completed: false
      },
      {
        title: 'Practice Problem',
        type: 'practice',
        problem: 'Solve the following problem:',
        completed: false
      }
    ]);

    const currentSection = computed(() => sections.value[currentSectionIndex.value]);

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const selectAnswer = (index) => {
      selectedAnswer.value = index;
    };

    const checkAnswer = () => {
      showAnswer.value = true;
      if (selectedAnswer.value === currentSection.value.correctAnswer) {
        toast.success('Correct answer!');
        sections.value[currentSectionIndex.value].completed = true;
        updateProgress();
      } else {
        toast.error('Incorrect answer. Try again!');
      }
    };

    const nextQuestion = () => {
      showAnswer.value = false;
      selectedAnswer.value = null;
      nextSection();
    };

    const submitPractice = () => {
      // TODO: Implement practice submission logic
      toast.success('Solution submitted!');
      sections.value[currentSectionIndex.value].completed = true;
      updateProgress();
      nextSection();
    };

    const updateProgress = () => {
      const completed = sections.value.filter(section => section.completed).length;
      progress.value = (completed / sections.value.length) * 100;
    };

    const nextSection = () => {
      if (currentSectionIndex.value < sections.value.length - 1) {
        currentSectionIndex.value++;
      }
    };

    const previousSection = () => {
      if (currentSectionIndex.value > 0) {
        currentSectionIndex.value--;
      }
    };

    const goToSection = (index) => {
      currentSectionIndex.value = index;
    };

    onMounted(() => {
      // Start timer
      const timer = setInterval(() => {
        timeSpent.value++;
      }, 1000);

      // Cleanup timer on component unmount
      return () => clearInterval(timer);
    });

    return {
      topic,
      timeSpent,
      progress,
      currentSection,
      currentSectionIndex,
      selectedAnswer,
      showAnswer,
      practiceAnswer,
      sections,
      formatTime,
      selectAnswer,
      checkAnswer,
      nextQuestion,
      submitPractice,
      nextSection,
      previousSection,
      goToSection
    };
  }
};
</script>

<style scoped>
.revision-view {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.revision-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.stat-value {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: bold;
}

.progress-bar {
  width: 150px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #4f46e5;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.revision-content {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.content-section {
  margin-bottom: 2rem;
}

.content-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.text-content p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.quiz-content {
  margin-top: 1rem;
}

.question h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.options {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-btn {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-btn:hover:not(:disabled) {
  border-color: #4f46e5;
  background: #f8f9fa;
}

.option-btn.selected {
  border-color: #4f46e5;
  background: #f8f9fa;
}

.option-btn.correct {
  border-color: #10b981;
  background: #ecfdf5;
}

.option-btn.incorrect {
  border-color: #ef4444;
  background: #fef2f2;
}

.option-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.quiz-actions {
  display: flex;
  justify-content: flex-end;
}

.practice-content {
  margin-top: 1rem;
}

.practice-problem h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.solution-input textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 150px;
}

.solution-input textarea:focus {
  outline: none;
  border-color: #4f46e5;
}

.practice-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.submit-btn, .next-btn {
  padding: 0.75rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.submit-btn:hover:not(:disabled), .next-btn:hover:not(:disabled) {
  background: #4338ca;
}

.submit-btn:disabled, .next-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  color: #2c3e50;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  border-color: #4f46e5;
  background: #f8f9fa;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.revision-sidebar {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-header h3 {
  color: #2c3e50;
  margin: 0;
}

.sections-list {
  padding: 1rem;
}

.section-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-item:hover {
  background: #f8f9fa;
}

.section-item.active {
  background: #f1f5f9;
}

.section-item.completed {
  opacity: 0.7;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 50%;
}

.section-title {
  flex: 1;
  color: #2c3e50;
  font-size: 0.9rem;
}

.section-status {
  color: #10b981;
}

@media (max-width: 1024px) {
  .revision-view {
    grid-template-columns: 1fr;
  }

  .revision-sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .revision-view {
    padding: 1rem;
  }

  .revision-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-stats {
    width: 100%;
    justify-content: center;
  }
}
</style> 