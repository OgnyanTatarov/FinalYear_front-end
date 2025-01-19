import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/main.css'; // Optional: Replace with your global CSS file

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

app.mount('#app');
