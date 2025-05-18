<script setup lang="ts">
// vue
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { RouterLink } from "vue-router";

// stores
const authStore = useAuthStore();

const { role } = storeToRefs(authStore);

// data
const isOpen = ref(false);

// functions
function closeModal() {
  if (!isOpen.value) return;

  isOpen.value = false;
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!--TODO: change app name-->
      <RouterLink to="/" class="logo">MedApp</RouterLink>

      <button class="toggle-button" @click="isOpen = !isOpen">☰</button>

      <div @click="closeModal" class="navbar-links" :class="{ open: isOpen }">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
        <RouterLink to="/appointments">Appointments</RouterLink>
        <RouterLink v-if="role === 'pacijent'" to="/medical-records"
          >Medical Records</RouterLink
        >
        <RouterLink v-if="role === 'osoblje'" to="/analytics"
          >Analytics</RouterLink
        >
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
  padding: 0.75rem 1rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  max-width: 1200px;
  margin: auto;
}

.logo {
  font-weight: bold;
  font-size: 1.25rem;
  color: #3498db;
  text-decoration: none;
}

.toggle-button {
  font-size: 1.5rem;
  background: none;
  border: none;
  display: none;
  cursor: pointer;
}

.navbar-links {
  display: flex;
  gap: 1rem;
}

.navbar-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.navbar-links a:hover {
  color: #3498db;
}

/* Responsive */
@media (max-width: 768px) {
  .toggle-button {
    display: block;
  }

  .navbar-links {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    position: fixed;
    top: 0;
    right: -100%;
    width: 250px;
    height: 100%;
    padding: 1rem;
    border-left: 1px solid #ddd;
    box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 999;
  }

  .navbar-links.open {
    right: 0;
  }

  .navbar-links a {
    margin: 1rem 0;
  }
}
</style>
