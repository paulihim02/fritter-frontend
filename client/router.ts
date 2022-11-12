import Vue from "vue";
import VueRouter from "vue-router";
import FreetsPage from "./components/Freet/FreetsPage.vue";
import RefreetsPage from "./components/Refreet/RefreetsPage.vue";
import SettingsPage from "./components/Settings/SettingsPage.vue";
import LoginPage from "./components/Login/LoginPage.vue";
import BannerPage from "./components/BannerPage.vue";
import HomePage from "./components/Home/HomePage.vue";
import CirclesPage from "./components/Circle/CirclePage.vue";
import SharedPage from "./components/Share/SharedPage.vue";
import ViewCircles from "./components/Circle/ViewCircles.vue";
import ProfilePage from "./components/Profile/ProfilePage.vue";
import NotFound from "./NotFound.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/banner", name: "Banner", component: BannerPage },
  { path: "/freets", name: "Freets", component: FreetsPage },
  { path: "/refreets", name: "Refreets", component: RefreetsPage },
  { path: "/circles", name: "Circles", component: CirclesPage },
  { path: "/circles/view/:rank", name: "ViewCircles", component: ViewCircles },
  { path: "/settings", name: "Settings", component: SettingsPage },
  { path: "/shared", name: "Shared", component: SharedPage },
  { path: "/profile/:username", name: "Profile", component: ProfilePage },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "*", name: "Not Found", component: NotFound },
];

const router = new VueRouter({ routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  console.log("ROUTER", to.name, from.name);
  if (!router.app.$store) {
    return next();
  }

  if (router.app.$store.state.usersFilter) {
    // remove user list panel if moving to different page
    router.app.$store.commit("setUsersFilter", null);
  }

  // redirect to banner if not already logged in except if they're trying to log in!
  if (!router.app.$store.state.username) {
    if (to.name === "Banner") {
      return next();
    }

    if (to.name !== "Login") {
      return next({ name: "Banner" }); // allow signed out users to only access login
    }

    return next(); // must be going to login then
  }

  // trying to log in when already logged in
  if (to.name === "Login") {
    next({ name: "Profile" }); // Go to Profile page if user navigates to Login and are signed in
    return;
  }

  // trying to access home when already logged in
  if (to.name === "Banner") {
    next({ name: "Home" });
  }

  return next();
});

export default router;
