<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <main>
    <br />
    <h3 stytle="width: auto; height: auto; color: blue">
      freets shared with you so far:
    </h3>
    <article v-if="sharedToUser">
      <div v-for="share of sharedToUser">
        <SharedComponent
          :freet="share.freetId"
          :sharedTo="share.audienceId"
          :sharedBy="share.sharedById"
        />
      </div>
    </article>
    <article v-else>no freets have been shared with you yet</article>
    <br />
    <article>
      <h3 stytle="width: auto; height:auto; color: black">
        freets you've shared:
      </h3>
      <article v-if="sharedFreets">
        <div v-for="share of sharedFreets">
          <SharedComponent
            :freet="share.freetId"
            :sharedTo="share.audienceId"
            :sharedBy="share.sharedById"
          />
        </div>
      </article>
      <article v-else>
        <div>you've haven't shared any freets yet</div>
      </article>
    </article>

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
</template>

<script>
// import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";
// import GetFreetsForm from "@/components/Freet/GetFreetsForm.vue";
import SharedComponent from "@/components/Share/SharedComponent.vue";

export default {
  name: "SharedPage",
  components: { SharedComponent },
  data() {
    return { alerts: {}, sharedFreets: [], sharedToUser: [] };
  },

  mounted() {
    fetch(`/api/shares?username=${this.$store.state.username}`)
      .then((res) => res.json())
      .then((res) => (this.sharedFreets = res.shares));

    fetch(`/api/shares?username=${this.$store.state.username}&sharedWith=true`)
      .then((res) => res.json())
      .then((res) => (this.sharedToUser = res.shares)); // Promise.all(freetsFromShare).then((res) => (this.sharedFreets = res));
  },
};
</script>

<style scoped>
.share {
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
</style>
