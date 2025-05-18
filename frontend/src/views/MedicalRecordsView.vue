<script setup lang="ts">
import api from "@/axios/axios";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { ref, onBeforeMount } from "vue";
import { useToast } from "vue-toastification";

type MedicalRecord = {
  prezime: string;
  opis: string;
  datum: string;
};

const toast = useToast();

const medicalRecord = ref<MedicalRecord[]>([]);
const patientName = ref("");
const isLoading = ref(true);

onBeforeMount(async () => {
  try {
    const response = await api.get("/record");

    patientName.value = response.data.name;
    medicalRecord.value = response.data.records;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="record-container">
    <template v-if="isLoading"> <LoadingSpinner /> </template>
    <template v-else-if="medicalRecord.length">
      <h2>{{ patientName }}'s Medical Record</h2>
      <div
        v
        v-for="(record, index) in medicalRecord"
        :key="index"
        class="record-card"
      >
        <div class="record-row">
          <span class="label">Doctor:</span>
          <span>dr. {{ record.prezime }}</span>
        </div>

        <div class="record-row">
          <span class="label">Description:</span>
          <span>{{ record.opis }}</span>
        </div>

        <div class="record-row">
          <span class="label">Date:</span>
          <span>{{ new Date(record.datum).toDateString() }}</span>
        </div>
      </div>
    </template>
    <template v-else>No medical records.</template>
  </div>
</template>

<style scoped>
.record-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fefefe;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #2c3e50;
}

.record-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.record-row {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.label {
  font-weight: 600;
  color: #34495e;
}
</style>
