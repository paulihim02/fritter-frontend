<template>
  <main>
    <h1>Circles</h1>
    <b-card v-for="circle of [{ rank: 1 }, { rank: 2 }, { rank: 3 }]">
      <b-card img="circles.png">
        <b-img src="circles.png" width="60" />
        Circle {{ circle.rank }}
        <a :href="`/#/circles/view/${circle.rank}`">
          <span
            align="right"
            style="float: right; padding-top: 12px; color: grey; underline"
            ><u>view users»</u></span
          >
        </a>
      </b-card>
    </b-card>
    <div style="margin: 30px">
      <h3 class="text-center">freets with circleMes applied</h3>
    </div>
    <b-card v-if="!followersFreets.length" class="text-center"
      >no freets yet. follow someone and have them add you to their
      circle!</b-card
    >

    <b-card v-for="freet of followersFreets">
      <CircleMeComponent :freet="freet" />
    </b-card>
  </main>
</template>

<script>
import CircleForm from "@/components/Circle/CircleForm.vue";
import ViewCircles from "@/components/Circle/ViewCircles.vue";
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import CircleMeComponent from "@/components/CircleMe/CircleMeComponent.vue";

export default {
  name: "CirclePage",
  data() {
    return { followersFreets: [], circles: {} };
  },

  components: {
    CircleForm,
    ViewCircles,
    FreetComponent,
    CircleMeComponent,
  },

  mounted() {
    const following = fetch(`/api/follows/${this.$store.state.username}`)
      .then((follow) => follow.json())
      .then((res) => {
        let following = res.following;
        const freetsFromFollowing = [];
        for (const follow of following) {
          fetch(`/api/freets?username=${follow.username}`)
            .then((res) => res.json())
            .then((res) => {
              this.followersFreets.push(...res);
            });
        }

        Promise.all(this.followersFreets).then(() => {});
      });
  },
};
</script>
