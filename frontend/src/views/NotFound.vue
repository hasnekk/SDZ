<script setup lang="ts"></script>

<template>
  <div class="error-page">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for doesn't exist.</p>
    <router-link to="/">Go back to Home</router-link>
  </div>
</template>

<style scoped>
.error-page {
  text-align: center;
  padding: 3rem;
}
</style>
