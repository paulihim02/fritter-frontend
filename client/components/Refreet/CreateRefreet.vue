<!-- Form for creating freets (block style) -->
<template>
  <div>
    <b-card style="border-radius: 40px">
      <b-button
        type="text"
        style="background-color: pink; border-radius: 10px; width: 100%"
        >refreeting •</b-button
      >
      <p style="padding: 2px 6px; margin-bottom: 4px">caption</p>
      <b-input
        type="text"
        style="margin: 2px; margin-bottom: 4px"
        v-model="caption"
      ></b-input>
      <div style="padding: 2px 6px">freet:</div>
      <FreetShadow :freet="refreet" />
    </b-card>
  </div>
</template>

<script>
import FreetShadow from "@/components/Freet/FreetShadowComponent.vue";

export default {
  name: "CreateRefreet",
  props: {
    refreet: { type: Object, required: true },
  },
  components: { FreetShadow },
  data() {
    return { caption: "" };
  },

  methods: {
    submit() {
      console.log("submitting refreet!");
      const body = {
        freetId: this.refreet._id,
        caption: this.caption,
      };

      console.log(body);
      fetch(
        `/api/refreets 
      `,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(body), // Sends express-session credentials with request
        }
      ).then((res) => {
        this.$store.commit("refreshRefreets");
      });
    },
  },
};
</script>
