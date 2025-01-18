import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js'; // If you have a router setup
import store from './store'; // If you have a state management setup (e.g., Pinia or Vuex)
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css'
import './assets/main.css'; // Optional: Replace with your global CSS file

const app = createApp(App);

app.use(Toast);
app.use(router);
app.use(store);

app.mount('#app');
