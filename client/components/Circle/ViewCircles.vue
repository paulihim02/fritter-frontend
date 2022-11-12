<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <main>
    <b-card v-bind:title="'Circle ' + $route.params.rank"
      >Circle | users in this circle can
      {{
        $route.params.rank == 1
          ? "comment on your freets"
          : $route.params.rank == 2
          ? "refreet your freets"
          : "share your freets"
      }}
    </b-card>

    <article v-if="circleWithRank">
      <b-card-header class="text-center" style="padding: 20px"
        >users in this circle</b-card-header
      >
      <b-card v-for="circle of circleWithRank" :key="circle._id">
        <b-link @click="$router.push('/profile/' + circle.userId.username)">
          @{{ circle.userId.username }} </b-link
        >is in your circle
        <b-button
          class="float-right btn-sm d-inline"
          variant="danger"
          @click="removeFromCircle(circle._id)"
        >
          - remove
        </b-button>
        <div></div>
      </b-card>
    </article>
    <article v-else>
      <div>
        <b-card v-if="!circle.userId.length">
          no users are in this circle</b-card
        >
      </div>
    </article>
    <br />
    <p class="text-center">•••---•••</p>
    <p class="text-center" style="padding-left: 50px">
      tip: search users up using the search in the navbar and add them to a
      circle!
    </p>
  </main>
</template>

<script>
export default {
  name: "ViewCircles",
  data() {
    return { circleWithRank: {} };
  },
  mounted() {
    this.getCircles();
  },

  methods: {
    getCircles: function () {
      fetch(
        `/api/circles?ownerId=${this.$store.state.userId}&rank=${this.$route.params.rank}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log("res is", res.circles);
          this.circleWithRank = res.circles;
        });
    },

    removeFromCircle: function (circleId) {
      fetch("/api/circles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ circleId }),
      })
        .then((res) => res.json())
        .then(() => this.getCircles());
    },
  },
};
</script>

<style scoped>
.freet {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
</style>
