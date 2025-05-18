<script setup lang="ts">
// vue
import { ref } from "vue";
import { useRouter } from "vue-router";

// 3-td party modules
import { useToast } from "vue-toastification";

//components
import LoadingSpinner from "@/components/LoadingSpinner.vue";

// stores
import { useAuthStore } from "@/stores/authStore";

import api from "@/axios/axios";

const toast = useToast();
const router = useRouter();

// stores
const authStore = useAuthStore();

// data
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);

// functions
async function handleLogin() {
  if (!email.value || !password.value) {
    toast.error("Please enter both email and password.");
    return;
  }

  isLoading.value = true;

  try {
    const response = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    console.log(response);

    const { message, role } = response.data;
    authStore.login(role);
    toast.success(message);

    router.push({ name: "Home" });
  } catch (error: any) {
    console.log(error);
    toast.error(error.response.data.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="login-wrapper">
    <template v-if="isLoading">
      <LoadingSpinner />
    </template>

    <template v-else>
      <div class="login-form">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
            />
          </div>

          <div class="toggle-password">
            <input type="checkbox" id="togglePassword" v-model="showPassword" />
            <label for="togglePassword">Show Password</label>
          </div>

          <button type="submit">Login</button>
        </form>

        <p class="register-link">
          No account?
          <router-link to="/register">Register here</router-link>
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #74b9ff, #a29bfe);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.login-form {
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #2d3436;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #2d3436;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 0.65rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #0984e3;
  outline: none;
}

.toggle-password {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #0984e3;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #0652dd;
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  button {
    font-size: 0.95rem;
  }
}

.register-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #636e72;
}

.register-link a {
  color: #0984e3;
  font-weight: 600;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
