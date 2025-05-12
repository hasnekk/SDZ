<script setup lang="ts">
// vue
import { ref } from "vue";

// 3-td party modules
import { useToast } from "vue-toastification";

// components
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const toast = useToast();

// data
const email = ref("");
const password = ref("");
const repeatPassword = ref("");
const showPassword = ref(false);
const isLoading = ref(false);

// functions
function handleSubmit() {
  if (password.value !== repeatPassword.value) {
    toast.error("Passwords do not match.");
    return;
  }

  isLoading.value = true;

  try {
  } catch (error) {
    console.log(error);
    toast.error(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="register-wrapper">
    <template v-if="isLoading">
      <LoadingSpinner />
    </template>

    <template v-else>
      <div class="register-form">
        <h2>Register</h2>
        <form @submit.prevent="handleSubmit">
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

          <div class="form-group">
            <label>Repeat Password</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="repeatPassword"
              required
            />
          </div>

          <div class="toggle-password">
            <input type="checkbox" id="togglePassword" v-model="showPassword" />
            <label for="togglePassword">Show Password</label>
          </div>

          <button type="submit">Register</button>
        </form>

        <p class="login-link">
          Already registered?
          <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.register-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #dff9fb, #c7ecee);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.register-form {
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #34495e;
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
  border-color: #3498db;
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
  background-color: #3498db;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

@media (max-width: 480px) {
  .register-form {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  button {
    font-size: 0.95rem;
  }
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #636e72;
}

.login-link a {
  color: #0984e3;
  font-weight: 600;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
