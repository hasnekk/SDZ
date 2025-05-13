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
import MedicalRecordsAddView from "@/views/MedicalRecordsAddView.vue";
import MedicalRecordsView from "@/views/MedicalRecordsView.vue";

import MainLayout from "@/layout/MainLayout.vue";

const routes = [
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },

  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", component: HomeView },
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
        // beforeEnter: (to, from, next) => {
        //   const { user } = useAuth();
        //   // If the user is not an admin, redirect to the Unauthorized page
        //   if (user && user.role === "admin") {
        //     next();
        //   } else {
        //     next("/unauthorized");
        //   }
        // },
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
      {
        path: "/medical-records/add",
        name: "MedicalRecordsAdd",
        component: MedicalRecordsAddView,
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

export default router;
