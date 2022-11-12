<template>
  <main>
    username: <b-input type="text" v-model="value"> </b-input
    ><button type="submit" @click="submit()">Submit</button>
  </main>
</template>

<script>
export default {
  name: "FollowPage",
  data() {
    return { value: "" };
  },
  methods: {
    submit() {
      fetch(`/api/follows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: this.value }),
        credentials: "same-origin", // Sends express-session credentials with request
      }).then((result) => {});
    },
  },

  beforeCreate() {
    this.$store.commit("refreshFollow");
  },
};
</script>
