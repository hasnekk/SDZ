<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <div class="layout">
    <Navbar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.content {
  margin-top: 2rem;
  flex-grow: 1;
}
</style>
