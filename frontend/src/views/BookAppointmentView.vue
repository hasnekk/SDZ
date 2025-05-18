<script setup lang="ts">
// vue
import api from "@/axios/axios";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

// data
const doctors = ref<{ id: number; prezime: string }[]>([]);

const selectedDoctor = ref(null);
const desc = ref("");
const appointmentDate = ref("");
const isLoading = ref(false);

// functions
async function bookAppointment() {
  isLoading.value = true;

  try {
    await api.post("/appointment", {
      doctor: selectedDoctor.value,
      desc: desc.value,
      date: appointmentDate.value,
    });
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
  } finally {
    isLoading.value = false;
    router.push("/appointments");
  }
}

onBeforeMount(async () => {
  isLoading.value = true;

  try {
    const response = await api.get("/appointment/doctors/all");
    doctors.value = response.data.doctors;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="book-appointment">
    <template v-if="isLoading"> <LoadingSpinner /> </template>
    <template v-else>
      <h1>Book an Appointment</h1>

      <form @submit.prevent="bookAppointment">
        <div>
          <label for="doctor">Select Doctor</label>
          <select v-model="selectedDoctor" required>
            <option
              v-for="doctor in doctors"
              :key="doctor.id"
              :value="doctor.id"
            >
              dr. {{ doctor.prezime }}
            </option>
          </select>
        </div>

        <div>
          <label>Description</label>
          <input
            type="text"
            v-model="desc"
            required1
            placeholder="Enter desc"
          />
        </div>
        <div>
          <label for="date">Select Date</label>
          <input type="date" v-model="appointmentDate" required />
        </div>

        <div>
          <button type="submit">Book Appointment</button>
        </div>
      </form>
    </template>
  </div>
</template>

<style scoped>
.book-appointment {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #f9fafc;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

h1 {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

label {
  font-weight: 500;
  color: #34495e;
  margin-bottom: 0.3rem;
  display: block;
}

select,
input[type="date"] {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background-color: white;
  transition: border-color 0.2s ease;
}

select:focus,
input[type="date"]:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

button {
  background-color: #3498db;
  color: white;
  padding: 0.85rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

@media (max-width: 600px) {
  .book-appointment {
    padding: 1.5rem;
    margin: 2rem 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
