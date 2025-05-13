<script setup lang="ts">
import { ref } from "vue";

type MedicalRecord = {
  id: number;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  date: string;
};

// Just one user's latest medical record
const medicalRecord = ref<MedicalRecord>({
  id: 1,
  patientName: "John Doe",
  doctorName: "Dr. Smith",
  diagnosis: "Flu",
  treatment: "Rest, hydration, and paracetamol",
  date: "2025-05-12",
});
</script>

<template>
  <div class="record-container">
    <h2>{{ medicalRecord.patientName }}'s Medical Record</h2>
    <div class="record-card">
      <div class="record-row">
        <span class="label">Doctor:</span>
        <span>{{ medicalRecord.doctorName }}</span>
      </div>

      <div class="record-row">
        <span class="label">Diagnosis:</span>
        <span>{{ medicalRecord.diagnosis }}</span>
      </div>

      <div class="record-row">
        <span class="label">Treatment:</span>
        <span>{{ medicalRecord.treatment }}</span>
      </div>

      <div class="record-row">
        <span class="label">Date:</span>
        <span>{{ medicalRecord.date }}</span>
      </div>
    </div>
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
