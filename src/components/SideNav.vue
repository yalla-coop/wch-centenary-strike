<template>
  <div class="left-controls-container">
    <div class="logo-container">
      <a class="logo-link" @click="resetView()">
        <img 
          src="/assets/wch-centenary-strike-logo.webp" 
          alt="100 General Strike Logo" 
          class="logo-image"
        />
      </a>
    </div>
    <!-- Basemap control will be inserted here by JavaScript -->
  </div>
</template>

<script>
import { EventBus } from "../js/DataManagement/EventBus";

export default {
  name: "LogoNav",
  methods: {
    resetView() {
      this.$store.commit("setSelectedEventId", -1);
      this.$map.flyTo({
        center: [0, 0],
        zoom: 2,
        essential: true,
      });
      EventBus.$emit("reset-info-panel");
      EventBus.$emit("clear-filters");
    },
  },
};
</script>

<style lang="scss">
/* Container for left-side controls using flexbox */
.left-controls-container {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px; /* Reduced from 16px to 8px */
}

/* Logo container */
.logo-container {
  background-color: rgba(0, 0, 0, 0.8);
  /* border-radius: 12px; */ /* Removed border radius */
  padding: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
    transform: scale(1.05);
  }
}

.logo-link {
  display: block;
  cursor: pointer;
  text-decoration: none;
}

.logo-image {
  width: 60px;
  height: auto;
  object-fit: contain;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* Basemap control styling when moved to flex container */
.basemap-control-container {
  background-color: rgba(0, 0, 0, 0.8) !important;
  /* border-radius: 12px !important; */ /* Removed border radius */
  padding: 12px !important;
  backdrop-filter: blur(10px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.3s ease !important;
  margin: 0 !important;
  position: static !important;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.9) !important;
  }

  .large-control {
    margin: 0;

    b {
      color: white;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      display: block;
    }
  }

  ul {
    margin: 8px 0 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    margin: 6px 0;
    padding: 0;
  }

  .radio {
    display: block;
  }

  label.basemap {
    color: white;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px 0;
    transition: color 0.2s ease;

    &:hover {
      color: #ccc;
    }
  }

  input[type="radio"] {
    margin-right: 8px;
    margin-top: 0;
    cursor: pointer;
    
    /* Custom radio button styling */
    appearance: none;
    width: 12px;
    height: 12px;
    border: 1px solid #ccc;
    border-radius: 50%;
    position: relative;
    
    &:checked {
      border-color: #EF1E35;
      background-color: #EF1E35;
    }
    
    &:checked::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      background-color: white;
      border-radius: 50%;
    }
    
    &:hover {
      border-color: #EF1E35;
    }
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .left-controls-container {
    top: 15px;
    left: 15px;
    gap: 6px; /* Reduced gap for mobile */
  }
  
  .logo-container {
    padding: 10px !important;
  }
  
  /* Hide basemap control on mobile */
  .basemap-control-container {
    display: none !important;
  }
  
  .logo-image {
    width: 50px;
  }
}

@media (max-width: 480px) {
  .left-controls-container {
    top: 10px;
    left: 10px;
    gap: 4px; /* Even smaller gap for small mobile */
  }
  
  .logo-container {
    padding: 8px !important;
  }
  
  /* Keep basemap control hidden on small mobile */
  .basemap-control-container {
    display: none !important;
  }
  
  .logo-image {
    width: 40px;
  }
}
</style>