<template>
  <div id="event-details">
    <h3 class="info-title popup-title">{{ event.title }}</h3>
    <br />
    <v-divider class="border-opacity-0"></v-divider>
    <br />
    <p class="info-description" v-html="event.description"></p>

    <div :class=" event.media ? 'media-container info-photo' : 'hidden info-photo'">
      <div class="img-container">
        <img :src="event.media" />
      </div>
      <p class="img-caption">{{ event.media_caption }}</p>
      <p class="img-caption">{{ event.media_credit }}</p>
    </div>
    <!-- //HC -->
    <v-divider class="border-opacity-0"></v-divider>
    <div>
      {{ event.geotag_info }}:
      {{ event.geotag_description }}
    </div>
    <div v-show="event.visitor_info.length > 0">
      {{ event.visitor_info }}
    </div>
    <v-divider class="border-opacity-0"></v-divider>
    <ul class="info-list">
      <li class="info-author" v-show="event.author_name.length > 0">
        <span class="list-title">Author:</span>
        <a :href="event.author_url" target="_blank">{{event.author_name}}</a>
      </li>
      <li class="info-learn">
        <a :href="`${this.$baseurl}/article/${event.id}/${event.title.replaceAll(' ', '-')}`" target="_blank">
          Learn More
        </a>
      </li>
      <li class="info-merch" v-show="event.merch_url.length > 0">
        <a :href="event.merch_url" target="_blank">Related Merch</a>
      </li>
      <li class="info-podcast" v-show="event.podcast_url.length > 0">
        <a :href="event.podcast_url" target="_blank">Related Podcast</a>
      </li>
      <li class="info-book" v-show="event.books_url.length > 0">
        <a :href="event.books_url" target="_blank">Related Books</a>
      </li>
      <li class="info-googlemaps" v-show=" event.latitude.length > 0 && event.longitude.length > 0">
        <a target="_blank" :href="`https://maps.google.com?q=${event.latitude},${event.longitude}`">
          Open in Google Maps
        </a>
      </li>
    </ul>
    <div class="zoom-to">
      <a @click.prevent="zoomTo({ lat: event.latitude, lng: event.longitude, })" href="#">
        <v-icon dark>mdi-magnify</v-icon>
        <span class="list-title">Zoom To</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventDetails',
  props: ['event', 'zoomTo'],
  mounted() {
    // Force apply styles to all links after component mounts
    this.applyLinkStyles();
  },
  updated() {
    // Reapply styles when content updates (like v-html changes)
    this.applyLinkStyles();
  },
  methods: {
    applyLinkStyles() {
      this.$nextTick(() => {
        const container = this.$el;
        if (container) {
          const links = container.querySelectorAll('a');
          links.forEach(link => {
            // Force apply styles directly to each link element
            link.style.setProperty('font-family', "'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif", 'important');
            link.style.setProperty('font-weight', '300', 'important');
            link.style.setProperty('font-size', window.innerWidth >= 768 ? '16px' : '14px', 'important');
            link.style.setProperty('text-decoration', 'underline', 'important');
            link.style.setProperty('color', '#EBB68E', 'important');
            link.style.setProperty('outline', 'none', 'important');
            link.style.setProperty('background-color', 'transparent', 'important');
            link.style.setProperty('border', 'none', 'important');
            
            // Add hover listeners
            link.addEventListener('mouseenter', () => {
              link.style.setProperty('color', '#DF6E4B', 'important');
            });
            link.addEventListener('mouseleave', () => {
              link.style.setProperty('color', '#EBB68E', 'important');
            });
          });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
#event-details {
  .img-container {
    width: 100%;
    img {
      max-width: 90%;
      display: block;
      margin-left: 0;
    }
  }
  .img-caption {
    margin-bottom: 0;
    text-align: left;
    font-size: 0.85em;
  }
  .info-list {
    margin-top: 15px;
    padding-left: 24px;
  }
  .media-container {
    margin: 10px 10px 10px 0;
  }
  .zoom-to {
    display: block;
    font-size: 15px;
    position: relative;
    width: 100%;
    text-align: right;
    bottom: 13px;
    pointer-events: none;
    margin-top: 2em;
    a {
      pointer-events: all;
      text-decoration: none;
      margin-top: 20px;
      outline: none;
      
      &:focus {
        outline: none;
      }
      
      &:active {
        outline: none;
      }
    }
  }
  
  .info-title.popup-title {
    font-family: 'Helvetica Neue', 'Helvetica Neue Condensed', 'Helvetica', 'Arial Narrow', 'Arial', sans-serif !important;
    font-weight: 500 !important;
    font-size: 24px !important; /* Same as h1/title */
    line-height: 1.3 !important;
  }
  
  /* Apply consistent hyperlink styling to ALL links */
  a, a:link, a:visited {
    font-family: 'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif !important;
    font-weight: 300 !important;
    font-size: 14px !important; /* Mobile base size */
    text-decoration: underline !important;
    color: #EBB68E; /* Pink primary - warm, readable color */
    outline: none !important;
    
    &:hover, &:focus {
            color: #DF6E4B; /* Yellow primary - your main brand orange */

      text-decoration: underline !important;
      outline: none !important;
    }
    
    &:active {
      outline: none !important;
    }
  }
}

/* Responsive typography to match global styles */
@media (min-width: 768px) {
  #event-details {
    /* All text including links scale up on desktop */
    a, a:link, a:visited {
      font-size: 16px !important; /* Desktop size */
    }
  }}
</style>