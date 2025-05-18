<script setup lang="ts">
import api from "@/axios/axios";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { ref, onBeforeMount, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const authStore = useAuthStore();

const appointmentId = Number(route.params.id);

const { role } = storeToRefs(authStore);

const appointment = ref({
  id: appointmentId,
  doctor: 0,
  opis: "",
  datum: "",
});
const isLoading = ref(true);
const isStaff = computed(() => role.value === "osoblje");
const doctors = ref<{ id: number; prezime: string }[]>([]);

async function saveChanges() {
  isLoading.value = true;

  try {
    await api.patch("/appointment/" + appointmentId, {
      appointment: appointment.value,
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
  try {
    const response = await api.get("/appointment/" + appointmentId);
    doctors.value = response.data.doctors;
    appointment.value = {
      ...response.data.appointment,
      datum: response.data.appointment.datum.slice(0, 10), // Format date
    };

    console.log(response);
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="edit-appointment">
    <template v-if="isLoading"></template>
    <template v-else>
      <h1>Edit Appointment</h1>

      <form @submit.prevent="saveChanges">
        <div v-if="!isStaff">
          <label>Doctor</label>
          <select v-model="appointment.doctor" required>
            <option v-for="doc in doctors" :key="doc.id" :value="doc.id">
              dr. {{ doc.prezime }}
            </option>
          </select>
        </div>

        <div>
          <label>Description</label>
          <input
            type="text"
            v-model="appointment.opis"
            required
            placeholder="Enter desc"
          />
        </div>

        <div>
          <label>Date</label>
          <input type="date" v-model="appointment.datum" required />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </template>
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
