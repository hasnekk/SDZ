<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const user = ref({
  name: "John Doe",
  role: "patient", // "staff" or "patient"
});

const isStaff = computed(() => user.value.role === "staff");

const appointments = ref([
  {
    id: 1,
    date: "2025-05-14",
    doctor: "Dr. Smith",
    service: "Dental Cleaning",
  },
  {
    id: 2,
    date: "2025-05-20",
    doctor: "Dr. Johnson",
    service: "General Checkup",
  },
]);

const medicalRecord = ref({
  doctorName: "Dr. Smith",
  diagnosis: "Seasonal Flu",
  treatment: "Rest, fluids, paracetamol",
  date: "2025-05-10",
});

const stats = ref({
  totalPatients: 140,
  totalAppointments: 89,
  occupancyRate: "79%",
});

// Navigation functions
function goToBooking() {
  router.push("/book");
}
function goToAppointments() {
  router.push("/appointments");
}
function goToAnalytics() {
  router.push("/analytics");
}
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-center text-blue-900">
      👋 Welcome, {{ user.name }}
    </h1>

    <!-- PATIENT SECTIONS -->
    <div v-if="!isStaff" class="flex flex-col gap-6">
      <!-- Appointments -->
      <section class="bg-white p-4 rounded-xl shadow-md">
        <h2 class="text-xl font-semibold mb-2">📅 Upcoming Appointments</h2>
        <div v-if="appointments.length > 0">
          <ul class="space-y-2">
            <li
              v-for="appt in appointments"
              :key="appt.id"
              class="border p-3 rounded-lg flex flex-col sm:flex-row sm:justify-between"
            >
              <span
                ><strong>{{ appt.date }}</strong> with {{ appt.doctor }}</span
              >
              <span class="text-sm text-gray-500">{{ appt.service }}</span>
            </li>
          </ul>
        </div>
        <p v-else class="text-gray-600">No upcoming appointments.</p>
      </section>

      <!-- Medical Record -->
      <section class="bg-white p-4 rounded-xl shadow-md">
        <h2 class="text-xl font-semibold mb-2">
          🧾 Your Latest Medical Record
        </h2>
        <ul class="space-y-1 text-gray-700">
          <li><strong>Doctor:</strong> {{ medicalRecord.doctorName }}</li>
          <li><strong>Diagnosis:</strong> {{ medicalRecord.diagnosis }}</li>
          <li><strong>Treatment:</strong> {{ medicalRecord.treatment }}</li>
          <li><strong>Date:</strong> {{ medicalRecord.date }}</li>
        </ul>
      </section>

      <!-- Actions -->
      <section class="bg-white p-4 rounded-xl shadow-md">
        <h2 class="text-xl font-semibold mb-2">🩺 Quick Actions</h2>
        <div class="flex flex-col sm:flex-row gap-3">
          <button @click="goToBooking" class="btn-primary">
            Book Appointment
          </button>
          <button @click="goToAppointments" class="btn-outline">
            View All
          </button>
        </div>
      </section>
    </div>

    <!-- STAFF SECTIONS -->
    <div v-else class="flex flex-col gap-6">
      <!-- Analytics -->
      <section class="bg-white p-4 rounded-xl shadow-md">
        <h2 class="text-xl font-semibold mb-2">📊 Analytics Overview</h2>
        <ul class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-blue-900">
          <li class="stat-box">
            <strong class="text-lg">{{ stats.totalPatients }}</strong>
            <p class="text-sm text-gray-600">Patients</p>
          </li>
          <li class="stat-box">
            <strong class="text-lg">{{ stats.totalAppointments }}</strong>
            <p class="text-sm text-gray-600">Appointments</p>
          </li>
          <li class="stat-box">
            <strong class="text-lg">{{ stats.occupancyRate }}</strong>
            <p class="text-sm text-gray-600">Occupancy</p>
          </li>
        </ul>
        <button @click="goToAnalytics" class="btn-primary mt-4">
          View Full Analytics
        </button>
      </section>

      <!-- Manage Appointments -->
      <section class="bg-white p-4 rounded-xl shadow-md">
        <h2 class="text-xl font-semibold mb-2">📋 Manage Appointments</h2>
        <p class="text-gray-700 mb-2">
          Review and edit all upcoming appointments.
        </p>
        <button @click="goToAppointments" class="btn-outline">
          Go to Appointments
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Page Container */
div {
  padding: 1rem;
  max-width: 1024px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

/* Headings */
h1 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: #1a3b6f;
  margin-bottom: 2rem;
}
h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #1a3b6f;
}

/* Section Cards */
section {
  background-color: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Appointment and Record Items */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  border: 1px solid #ddd;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
li span {
  margin: 0.2rem 0;
}
li strong {
  color: #1a3b6f;
}

/* Stat Boxes */
.stat-box {
  background-color: #f1f9ff;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
}
.stat-box strong {
  font-size: 1.4rem;
  color: #0074d9;
}
.stat-box p {
  font-size: 0.9rem;
  color: #555;
}

/* Buttons */
button {
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.btn-primary {
  background-color: #3498db;
  color: white;
  border: none;
}
.btn-primary:hover {
  background-color: #2980b9;
}
.btn-outline {
  background-color: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}
.btn-outline:hover {
  background-color: #ecf6fc;
}

/* Flex Layouts */
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.flex-row {
  flex-direction: row;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-6 {
  gap: 1.5rem;
}

/* Responsive Design */
@media (min-width: 600px) {
  li {
    flex-direction: row;
    align-items: center;
  }
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .actions {
    flex-direction: row;
  }
}
</style>
