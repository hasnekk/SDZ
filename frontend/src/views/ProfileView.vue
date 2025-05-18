<script setup lang="ts">
// vue
import api from "@/axios/axios";
import { onBeforeMount, ref } from "vue";

// 3-td party modules
import { useToast } from "vue-toastification";

// components
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToast();

// data
const name = ref("John Doe");
const email = ref("john.doe@example.com");
const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const isLoading = ref(true);

const isSaving = ref(false);

onBeforeMount(async () => {
  isLoading.value = true;

  try {
    const response = await api.get("/user/profile");

    name.value = response.data.name;
    email.value = response.data.email;
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
  } finally {
    isLoading.value = false;
  }
});

async function updateProfile() {
  isSaving.value = true;

  try {
    const response = await api.patch("/user/profile", {
      name: name.value,
      email: email.value,
    });

    name.value = response.data.user.name;
    email.value = response.data.user.email;
    toast.success(response.data.message);
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
  } finally {
    isSaving.value = false;
  }
}

async function changePassword() {
  if (newPassword.value !== confirmNewPassword.value) {
    toast.error("New passwords do not match.");
    return;
  }

  isSaving.value = true;

  try {
    const response = await api.patch("/user/profile/password", {
      currentPassword: currentPassword.value,
      password: newPassword.value,
    });

    toast.success(response.data.message);
  } catch (error: any) {
    console.error(error);
    toast.error(error.response.data.message);
  } finally {
    isSaving.value = false;
    currentPassword.value = "";
    newPassword.value = "";
    confirmNewPassword.value = "";
  }
}
</script>

<template>
  <div class="profile-wrapper">
    <template v-if="isLoading"> <LoadingSpinner /> </template>
    <template v-else>
      <h2>Profile</h2>

      <div class="section">
        <h3>Personal Information</h3>
        <label>Name</label>
        <input v-model="name" type="text" />

        <label>Email</label>
        <input v-model="email" type="email" />

        <button @click="updateProfile" :disabled="isSaving">
          Save Changes
        </button>
      </div>

      <div class="section">
        <h3>Change Password</h3>
        <label>Current Password</label>
        <input v-model="currentPassword" type="password" />

        <label>New Password</label>
        <input v-model="newPassword" type="password" />

        <label>Confirm New Password</label>
        <input v-model="confirmNewPassword" type="password" />

        <button @click="changePassword" :disabled="isSaving">
          Change Password
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-wrapper {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.section {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.4rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  margin-top: 1.2rem;
  padding: 0.7rem 1.2rem;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
</style>
