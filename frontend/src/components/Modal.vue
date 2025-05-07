<template>
  <div class="modal-wrapper">
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header"></slot>
          <button class="close-button" @click="$emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 998;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
  min-width: 350px;
  z-index: 999;
  animation: slideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  max-height: 85vh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: visible;
}

.modal-header {
  position: relative;
  background: white;
  padding: 1.25rem 2rem 1.25rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.5;
  padding-right: 2.5rem;
}

.modal-body {
  padding: 1.5rem 2rem;
  overflow-y: auto;
  background: white;
  border-radius: 0 0 12px 12px;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  min-height: 0;
  max-height: calc(85vh - 4.5rem);
}

.close-button {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: #f3f4f6;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
}

.close-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

.close-button svg {
  width: 18px;
  height: 18px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.modal-body::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

@media (max-width: 1100px) {
  .modal-container {
    max-width: 95vw;
    min-width: 0;
  }
}

@media (max-width: 768px) {
  .modal-container {
    max-width: 100vw;
    min-width: 0;
  }
  .modal-content {
    border-radius: 0;
    max-height: 100vh;
  }
  .modal-header {
    border-radius: 0;
    padding: 1rem 1.25rem;
  }
  .modal-body {
    border-radius: 0;
    padding: 1rem 1.25rem;
    max-height: calc(100vh - 4rem);
  }
}
</style> 