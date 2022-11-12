<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <!-- Logged In navbar -->

  <b-nav pills id="navbar" v-if="$store.state.username">
    <div class="left">
      <router-link to="/">
        <img src="../../public/logo2.png" />
      </router-link>
      <router-link to="/" style="text-decoration: none; color: inherit">
        <h1 class="title">Fritter</h1>
      </router-link>
    </div>
    <div style="margin-right: 0; padding-right: 0; width: 350px">
      <SearchForm :showUsers="true" />
    </div>

    <b-nav-item to="/" exact exact-active-class="active">feed </b-nav-item>
    <b-nav-item to="/freets" exact exact-active-class="active"
      >freets
    </b-nav-item>
    <b-nav-item to="/refreets" exact exact-active-class="active"
      >refreets
    </b-nav-item>
    <b-nav-item to="/shared" exact exact-active-class="active"
      >shared
    </b-nav-item>
    <b-nav-item to="/settings" exact exact-active-class="active"
      >settings
    </b-nav-item>
    <b-nav-item to="/circles" exact exact-active-class="active"
      >circles
    </b-nav-item>
    <b-nav-item
      :to="'/profile/' + $store.state.username"
      exact
      exact-active-class="active"
      >profile
    </b-nav-item>

    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </b-nav>

  <!-- Logged out navbar -->
  <b-nav v-else pills id="navbar-out">
    <b-nav-item to="/login" id="login-pill" exact exact-active-class="active"
      >Login</b-nav-item
    >
  </b-nav>
</template>
<script>
import SearchForm from "@/components/common/SearchForm.vue";

export default {
  name: "NavBar",
  components: {
    SearchForm,
  },
};
</script>

document.onClick()

<style scoped>
#navbar,
#navbar-out {
  border: solid 2.5px;
  color: grey;
  border-radius: 15px;
  margin: 20px;
  padding: 1vw 2vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 24px;
  box-shadow: 0 2px 2px -4px;
}

#navbar-out {
  display: block;
}

#display-users {
  position: absolute;
  margin-top: 8px;
  width: 310px;
  z-index: 10;
}

#login-pill {
  float: right;
}

nav {
  padding: 1vw 2vw;
  background-color: #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 24px;
}

.title {
  font-size: 32px;
  margin: 0 5px;
}

img {
  height: 32px;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  font-size: 20px;
  display: grid;
  gap: 16px;
  grid-auto-flow: column;
  align-items: center;
}

.right a {
  margin-left: 5px;
}

.alerts {
  width: 25%;
}
</style>
