<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <main v-if="$store.state.refreets.length" class="refreet">
    <section>
      <div v-for="refreet in $store.state.refreets" :key="refreet._id">
        <RefreetComponent
          v-if="
            !$store.state.freetsFilter ||
            $store.state.freetsFilter === refreet.refreeter.username
          "
          :key="refreet.id"
          :refreet="refreet"
        />
      </div>
    </section>

    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </main>
  <main v-else>no refreets!</main>
</template>

<script>
// import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";
// import GetFreetsForm from "@/components/Freet/GetFreetsForm.vue";
import RefreetComponent from "@/components/Refreet/RefreetComponent.vue";

export default {
  name: "RefreetsPage",
  components: { RefreetComponent },
  data() {
    return { alerts: {}, refreets: {} };
  },
};
</script>

<!-- <style scoped>
.refreet {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  border-radius: 20px;
  margin: 10px 0;
}

b-button {
  background-color: white !important;
  border-radius: 20px !important;
}

.actions {
  padding: 16px 16px 0px 0px;
  margin-bottom: 12px;
}

.action {
  border-radius: 10px;
}

* {
  background-color: #555555;
}
</style> -->
