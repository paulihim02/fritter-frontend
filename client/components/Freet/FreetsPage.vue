<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.freets.length">
      <FreetComponent
        v-for="freet in $store.state.freets"
        :key="freet.id"
        :freet="freet"
      />
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";

export default {
  name: "FreetPage",
  components: {
    FreetComponent,
  },

  beforeCreate() {
    this.$store.commit("setFreetsFilter", "");
    this.$store.commit("refreshFreets");
  },

  data() {
    return { alerts: {}, freets: {} };
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
