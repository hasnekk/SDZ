<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const appointmentId = Number(route.params.id);

// Mock existing appointment data
const appointment = ref({
  id: appointmentId,
  doctor: 1,
  service: 1,
  date: "2025-05-15",
});

const doctors = ref([
  { id: 1, name: "Dr. Smith" },
  { id: 2, name: "Dr. Johnson" },
]);

const services = ref([
  { id: 1, name: "General Checkup" },
  { id: 2, name: "Dental Cleaning" },
]);

function saveChanges() {
  console.log("Saving appointment", appointment.value);
  router.push("/appointments");
}

onMounted(() => {
  // Here you'd fetch appointment data by ID from API if needed
});
</script>

<template>
  <div class="edit-appointment">
    <h1>Edit Appointment</h1>

    <form @submit.prevent="saveChanges">
      <div>
        <label>Doctor</label>
        <select v-model="appointment.doctor" required>
          <option v-for="doc in doctors" :key="doc.id" :value="doc.id">
            {{ doc.name }}
          </option>
        </select>
      </div>

      <div>
        <label>Service</label>
        <select v-model="appointment.service" required>
          <option v-for="srv in services" :key="srv.id" :value="srv.id">
            {{ srv.name }}
          </option>
        </select>
      </div>

      <div>
        <label>Date</label>
        <input type="date" v-model="appointment.date" required />
      </div>

      <button type="submit">Save Changes</button>
    </form>
  </div>
</template>

<style scoped>
.edit-appointment {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: bold;
}

select,
input {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
