<script setup lang="ts"></script>

<template>
  <div class="error-page">
    <h1>403 - Unauthorized Access</h1>
    <p>You don't have permission to access this page.</p>
    <router-link to="/">Go back to Home</router-link>
  </div>
</template>

<style scoped>
.error-page {
  text-align: center;
  padding: 3rem;
}
</style>
