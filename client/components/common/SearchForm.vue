<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit" class="form-inline" style="position: relative">
    <b-form-input
      type="search"
      :placeholder="placeholder"
      style="height: 100%; box-shadow: 0 0 5px #ccc; width: 100%"
      @input="autoSearch"
      v-model="value"
    />
    <b-container v-if="value">
      <article
        v-if="showUsers"
        style="position: absolute; width: inherit; left: 0"
      >
        <article v-for="user of $store.state.users">
          <SearchUserComponent :user="user" v-on:click.native="reset()" />
        </article>
        <div
          v-if="!$store.state.users.length"
          style="z-index: 10 margin-bottom: 30px"
        >
          <b-card-footer class="lg">no users found</b-card-footer>
        </div>
      </article>
    </b-container>
  </form>
</template>

<script>
import SearchUserComponent from "@/components/common/SearchUserComponent.vue";

export default {
  name: "SearchForm",
  props: {
    placeholder: {
      type: String,
      default: "search...",
    },
    button: {
      type: String,
      default: "Search",
    },
    showUsers: { type: Boolean, required: true },
  },
  components: { SearchUserComponent },
  data() {
    return { value: "", alerts: {} };
  },

  methods: {
    reset() {
      this.value = "";
      this.autoSearch();
    },
    submit() {
      if (this.$store.state.users) {
        const firstMatch = this.$store.state.users[0]; // look for exact match

        if (this.value === firstMatch.username) {
          this.value = "";
          this.$store.commit("setUsersFilter", null);
          return this.$router.push(`/profile/${firstMatch.username}`);
        }
      }
    },
    autoSearch() {
      this.$store.commit("setUsersFilter", this.value);
      this.$store.commit("refreshUsers");
    },
  },
};
</script>
