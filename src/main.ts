import { createApp } from 'vue'
import { createStore } from 'vuex'
import storeConfig from './store';
import App from './App.vue'
// Create a new store instance.
const store = createStore(storeConfig)
const app = createApp(App)
app.use(store)
app.mount('#app')