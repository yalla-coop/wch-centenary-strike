import App from './App.vue'
import Vue from 'vue'
import VueHtmlToPaper from 'vue-html-to-paper';
import Store from './js/DataManagement/Store';
import '@fortawesome/fontawesome-free/css/all.css'
//import VueGtag from "vue-gtag";
import vuetify from 'vuetify';
import axios from "axios";
import Vuetify from 'vuetify/lib';
import $ from "jquery";

//import AsyncComputed from 'vue-async-computed'
let getOrientation = Vue.prototype.getOrientation = function () {
  if (Math.max(
    document.documentElement["clientWidth"],
    document.body["scrollWidth"],
    document.documentElement["scrollWidth"],
    document.body["offsetWidth"],
    document.documentElement["offsetWidth"]
  ) > Math.max(
    document.documentElement["clientHeight"],
    document.body["scrollHeight"],
    document.documentElement["scrollHeight"],
    document.body["offsetHeight"],
    document.documentElement["offsetHeight"]
  )) {
    return 'landscape';
  }
  return 'portrait'

}
let setOrientation = Vue.prototype.setOrientation = function () {
  if (getOrientation() === 'portrait') {
    document.querySelector('body').classList.remove("landscape");
    document.querySelector('body').classList.add("portrait");
  } else {
    document.querySelector('body').classList.remove("portrait");
    document.querySelector('body').classList.add("landscape");
  }
}


if (window.location !== window.parent.location) {
  document.querySelector('body').classList.add("embed")
} else{
  setOrientation();
}

window.addEventListener('resize',()=>{
  setOrientation()
})

  Vue.config.productionTip = false;

//Commonly used imports:
Vue.prototype.$axios = axios;

Vue.use(VueHtmlToPaper);

//Vue.use(AsyncComputed);
Vue.use(vuetify);
const setConfigs = (configs) => {
  configs.forEach((_config) => {
    if (_config.data.name) {
      Vue.prototype[`$${_config.data.name}`] = _config.data;
    }
  });
};

const configs = [
  axios.get('./data/MainConfig.json'),
  axios.get('./data/StyleConfig.json'),
];

Promise.all(configs).then((_configs) => {
  $("body > #loading").hide();
  new Vue({
    icons: {
      iconfont: 'fa',
    },
    vuetify: new Vuetify(),
    store: Store,
    created: () => {
      setConfigs(_configs);
    },
    mounted: () => { },
    render: h => h(App)
  }).$mount('#app');


}).catch((err) => {
  $("body > #loading").hide();
  $("body > #error").show();
  $("body > #error-message").show();
  $("body > #error-message").html(err.response.config.url + " : " + err + ("<br/>MESSAGE: " + err.response.data.message || ""));

  console.error(err.response.data);
  console.error(err.response.status);
  console.error(err.response.headers);
  $("body > #error-message").show();
});


