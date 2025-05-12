<script setup lang="ts">
// Vue
import { ref, onMounted, type Ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Data
const appointments: Ref<
  Array<{
    id: number;
    date: string;
    doctor: string;
    service: string;
  }>
> = ref([]);

// Mock user role (use actual auth system in a real app)
const user = {
  role: "patient",
};
const isPatient = user?.role === "patient";
const isStaff = user?.role === "staff";

// Functions
function fetchAppointments() {
  appointments.value = [
    {
      id: 1,
      date: "2025-05-15 10:00",
      doctor: "Dr. Smith",
      service: "General Checkup",
    },
    {
      id: 2,
      date: "2025-05-16 14:00",
      doctor: "Dr. Johnson",
      service: "Dental Cleaning",
    },
  ];
}

function formatTime(time: string) {
  const date = new Date(time);
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
}

function cancelAppointment(id: number) {
  console.log(`Cancel appointment with id: ${id}`);
  appointments.value = appointments.value.filter(
    (appointment) => appointment.id !== id
  );
}

function editAppointment(id: number) {
  router.push(`/appointments/edit/${id}`);
}

onMounted(() => {
  fetchAppointments();
});
</script>

<template>
  <div class="appointments-container">
    <h1 class="appointments-title">Appointments</h1>

    <div class="appointments-list">
      <div
        v-for="appointment in appointments"
        :key="appointment.id"
        class="appointment-card"
      >
        <div class="appointment-info">
          <h2 class="appointment-doctor">{{ appointment.doctor }}</h2>
          <p class="appointment-time">{{ formatTime(appointment.date) }}</p>
          <p class="appointment-service">{{ appointment.service }}</p>
        </div>
        <div class="appointment-actions">
          <button class="btn edit-btn" @click="editAppointment(appointment.id)">
            Edit
          </button>
          <button
            class="btn cancel-btn"
            @click="cancelAppointment(appointment.id)"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <router-link to="/appointments/book" class="btn book-appointment-btn"
      >Book New Appointment</router-link
    >
  </div>
</template>

<style scoped>
.appointments-container {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.appointments-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 1.5rem;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-card {
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
}

.appointment-info {
  display: flex;
  flex-direction: column;
}

.appointment-doctor {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.appointment-time {
  color: #777;
}

.appointment-service {
  font-size: 0.9rem;
  color: #555;
}

.appointment-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #3498db;
  color: #fff;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.cancel-btn {
  background-color: #e74c3c;
  color: #fff;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

.book-appointment-btn {
  display: block;
  margin-top: 2rem;
  background-color: #2ecc71;
  color: #fff;
  text-align: center;
  padding: 0.8rem;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
  text-decoration: none;
  transition: background-color 0.3s;
}

.book-appointment-btn:hover {
  background-color: #27ae60;
}

@media (max-width: 768px) {
  .appointments-title {
    font-size: 1.5rem;
  }

  .appointment-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .appointment-actions {
    margin-top: 1rem;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
