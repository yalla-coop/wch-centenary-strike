import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index.js';
import router from './js/DataManagement/Router';
import '@fortawesome/fontawesome-free/css/all.css'
import { createVuetify } from 'vuetify';
import { setOrientation, getOrientation } from './js/helpers/orientationHelpers.js';
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives
})

if (window.location !== window.parent.location) {
  if (getOrientation() === 'landscape') {
    document.querySelector('body').classList.add("embed");
  }else{
    document.querySelector('body').classList.add("mobile-embed");
    setOrientation();
  }
} else {
  setOrientation();
}
window.addEventListener('resize', () => {setOrientation()})

const app = createApp(App)
app.use(store)
app.use(router)
app.use(vuetify)
//Commonly used imports:
app.config.globalProperties.$baseurl = "https://stories.workingclasshistory.com"
app.mount('#app')

