<!-- Default page that also displays freets, refreets, and shared freets -->

<template>
  <article>
    <FreetComponent
      :freet="freet"
      :showComment="this.showComment"
      :showRefreet="this.showRefreet"
      :showShare="this.showShare"
    />
  </article>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";

export default {
  name: "CircleMeComponent",
  props: {
    freet: { type: Object, required: true },
  },

  data() {
    return { showComment: false, showRefreet: false, showShare: false };
  },
  components: {
    FreetComponent,
  },

  mounted() {

    fetch(`/api/circles/${this.freet.authorId}/${this.$store.state.userId}/1`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        console.log("res.error", res.error);

        this.showComment = !!res.circle;
      });
    fetch(`/api/circles/${this.freet.authorId}/${this.$store.state.userId}/2`)
      .then((res) => res.json())
      .then((res) => {
        console.log("res.error", res.error);

        this.showRefreet = !!res.circle;
      });
    fetch(`/api/circles/${this.freet.authorId}/${this.$store.state.userId}/3`)
      .then((res) => res.json())
      .then((res) => {
        console.log("res.error", res.error);
        this.showShare = !!res.circle;
      });
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
