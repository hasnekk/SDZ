import { createWebHistory, createRouter } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import NotFound from "@/views/NotFound.vue";
import Unauthorized from "@/views/Unauthorized.vue";
import ProfileView from "@/views/ProfileView.vue";
import AnalyticsView from "@/views/AnalyticsView.vue";
import AppointmentsView from "@/views/AppointmentsView.vue";
import BookAppointmentView from "@/views/BookAppointmentView.vue";
import EditAppointmentView from "@/views/EditAppointmentView.vue";
import MedicalRecordsView from "@/views/MedicalRecordsView.vue";

import MainLayout from "@/layout/MainLayout.vue";
import { useAuthStore } from "@/stores/authStore";

const routes = [
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },

  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", name: "Home", component: HomeView },
      { path: "profile", component: ProfileView, name: "Profile" },
      {
        path: "appointments",
        component: AppointmentsView,
        name: "Appoitments",
      },
      {
        path: "appointments/book",
        component: BookAppointmentView,
      },
      {
        path: "analytics",
        component: AnalyticsView,
        name: "Analytics",
        meta: { requiresAuth: true, allowedRoles: ["osoblje"] },
      },
      {
        path: "/appointments/edit/:id",
        name: "EditAppointment",
        component: EditAppointmentView,
        props: true,
      },
      {
        path: "/medical-records",
        name: "MedicalRecords",
        component: MedicalRecordsView,
      },
    ],
  },

  {
    path: "/unauthorized",
    name: "Unauthorized",
    component: Unauthorized,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const userIsAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.role;

  if (authRequired && !userIsAuthenticated) {
    return next("/login");
  }

  const allowedRoles = to.meta.allowedRoles as any;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return next("/unauthorized");
  }

  next();
});
export default router;
