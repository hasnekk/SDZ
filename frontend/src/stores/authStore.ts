import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const role = ref("");

  function login(_role: string) {
    isAuthenticated.value = true;
    role.value = _role;
  }

  function logout() {
    isAuthenticated.value = false;
    role.value = "";
  }

  function setAuthState(_authenticated: boolean, _role: string) {
    isAuthenticated.value = _authenticated;
    role.value = _role;
  }

  return { login, logout, setAuthState, isAuthenticated, role };
});
