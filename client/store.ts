import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    // allFreets: [], // All freets created in the app
    allUsers: [], // all users in the app
    freetsFilter: null, // username to filter shown freets by (null = show all)
    usersFilter: null, // usernames to filter shown matching users (null = show all)
    freets: [], // filtered freets
    refreets: [], // refreets
    shares: [], // shares
    users: [], // (filtered) users in the app

    username: null, // Username of the logged in user
    userId: null, // Id of the logged in user
    followers: [],
    following: [],
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },

    setAllUsers(state, users) {
      /**
       * Update the stored users to the specified one.
       * @param users - new users to set
       */
      state.allUsers = users;
    },

    setUserId(state, id) {
      /**
       * Update the stored id to the specified one.
       * @param id - ID to set
       */
      state.userId = id;
    },
    setUsers(state, users) {
      /**
       * Update the stored id to the specified one.
       * @param id - ID to set
       */
      state.users = users;
    },
    setFreetsFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.freetsFilter = filter;
    },
    setUsersFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.usersFilter = filter;
    },
    setFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    setRefreets(state, refreets) {
      /**
       * Update the stored refreets to the provided refreets.
       * @param refreets - refreets to store
       */
      state.refreets = refreets;
    },
    setFollowers(state, followers) {
      /**
       * Update the stored followers to the provided followers.
       * @param followers - followers to store
       */
      state.followers = followers;
    },
    setFollowing(state, following) {
      /**
       * Update the stored following to the provided following.
       * @param following - following to store
       */
      state.following = following;
    },

    setShares(state, shares) {
      /**
       * Update the stored following to the provided following.
       * @param shares - following to store
       */
      state.shares = shares;
    },

    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.freetsFilter
        ? `/api/freets?username=${state.freetsFilter}`
        : "/api/freets";
      const res = await fetch(url).then(async (r) => r.json());

      state.freets = res;
    },

    async refreshRefreets(state) {
      /**
       * Request the server for the currently available refreets.
       */
      const url = "/api/refreets";
      const res = await fetch(url).then(async (r) => r.json());

      state.refreets = res.refreets;
    },

    async refreshFollow(state) {
      /**
       * Request the server for the currently available followers.
       */
      const url = `/api/follows/${state.username}`;
      const res = await fetch(url).then(async (r) => r.json());
      state.following = res.following;
      state.followers = res.followers;

      console.log("received result", res);
    },

    async refreshUsers(state) {
      const url = `/api/users${
        state.usersFilter ? "?filter=" + state.usersFilter : ""
      }`; // gets users
      console.log(url);
      const res = await fetch(url).then(async (r) => r.json());
      console.log(res);
      state.users = res.users;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()],
});

export default store;
