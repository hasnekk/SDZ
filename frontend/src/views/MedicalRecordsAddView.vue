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

const medicalRecords = ref<MedicalRecord[]>([]);
const newRecord = ref<Partial<MedicalRecord>>({
  patientName: "",
  doctorName: "",
  diagnosis: "",
  treatment: "",
  date: "",
});

function addRecord() {
  if (
    newRecord.value.patientName &&
    newRecord.value.doctorName &&
    newRecord.value.diagnosis &&
    newRecord.value.treatment &&
    newRecord.value.date
  ) {
    const id = Date.now(); // use a unique ID in real app
    medicalRecords.value.push({ ...newRecord.value, id } as MedicalRecord);
    newRecord.value = {
      patientName: "",
      doctorName: "",
      diagnosis: "",
      treatment: "",
      date: "",
    };
  }
}
</script>

<template>
  <div class="medical-records">
    <h1>Medical Records</h1>

    <form @submit.prevent="addRecord" class="form">
      <input
        v-model="newRecord.patientName"
        placeholder="Patient Name"
        required
      />
      <input
        v-model="newRecord.doctorName"
        placeholder="Doctor Name"
        required
      />
      <input v-model="newRecord.diagnosis" placeholder="Diagnosis" required />
      <input v-model="newRecord.treatment" placeholder="Treatment" required />
      <input v-model="newRecord.date" type="date" required />
      <button type="submit">Add Record</button>
    </form>

    <div class="records-table" v-if="medicalRecords.length">
      <h2>All Records</h2>
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Diagnosis</th>
            <th>Treatment</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in medicalRecords" :key="record.id">
            <td>{{ record.patientName }}</td>
            <td>{{ record.doctorName }}</td>
            <td>{{ record.diagnosis }}</td>
            <td>{{ record.treatment }}</td>
            <td>{{ record.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.medical-records {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
}

form.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
}

button:hover {
  background-color: #27ae60;
}

.records-table table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th,
.records-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}
</style>
