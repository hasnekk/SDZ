<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { Bar, Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import api from "@/axios/axios";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const authStore = useAuthStore();

const { role } = storeToRefs(authStore);

const router = useRouter();
const toast = useToast();

const isStaff = computed(() => role.value === "staff");
const isLoading = ref(true);

if (!isStaff) {
  router.push("/not-authorized");
}

const totalPatients = ref(120);
const totalAppointments = ref(85);

const appointmentStats = ref({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      label: "Appointments per Day",
      backgroundColor: "#3498db",
      data: [12, 19, 14, 9, 31],
    },
  ],
});

const serviceDistribution = ref({
  labels: ["completed", "canceled", "not-arrived", "scheduled"],
  datasets: [
    {
      label: "Status of terms",
      backgroundColor: ["#1abc9c", "#e67e22", "#9b59b6", "#f39c12"],
      data: [40, 25, 10, 25],
    },
  ],
});

onBeforeMount(async () => {
  try {
    const reponse = await api.get("/analytics");

    console.log(reponse);

    totalPatients.value = reponse.data.numOfPatients;
    totalAppointments.value = reponse.data.numOfAppointments;
    appointmentStats.value.datasets[0].data = reponse.data.appointmentsPerDay;
    serviceDistribution.value.datasets[0].data = reponse.data.numOfStatuses;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="analytics-container">
    <template v-if="isLoading"> <LoadingSpinner /> </template>
    <template v-else>
      <h1>📊 Staff Analytics Dashboard</h1>

      <div class="metrics">
        <div class="metric-card">
          <h3>Total Patients</h3>
          <p>{{ totalPatients }}</p>
        </div>
        <div class="metric-card">
          <h3>Total Appointments</h3>
          <p>{{ totalAppointments }}</p>
        </div>
      </div>

      <div class="charts">
        <div class="chart-box">
          <Bar :data="appointmentStats" />
        </div>
        <div class="chart-box">
          <Doughnut :data="serviceDistribution" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.analytics-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f4f6f8;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #2c3e50;
}

.metrics {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.metric-card {
  background-color: #fff;
  flex: 1;
  min-width: 200px;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.metric-card h3 {
  margin-bottom: 0.5rem;
  color: #34495e;
}

.metric-card p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-between;
}

.chart-box {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-width: 400px;
}
</style>
