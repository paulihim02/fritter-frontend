<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="refreet">
    <header>
      <h5 class="author">
        @{{ refreet.refreeter.username }}
        <span class="info" style="float: right; color: white">
          –• {{ refreet.dateModified }} | (edited)
        </span>
        <span style="color: skyblue">• refreet</span>
      </h5>
      <div
        v-if="$store.state.username === refreet.refreeter.username"
        class="actions"
      >
        <b-button v-if="editing" @click="submitEdit" class="action"
          >✅ Save changes</b-button
        >
        <b-button v-if="editing" @click="stopEditing" class="action"
          >🚫 Discard changes</b-button
        >
        <b-button v-if="!editing" @click="startEditing" class="action"
          >✏️ Edit</b-button
        >
        <b-button @click="deleterefreet" class="action">🗑️ Delete</b-button>
      </div>
    </header>

    <!-- <div> -->
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p v-else class="content">caption: {{ refreet.caption }}</p>
    <!-- </div> -->
    freet:
    <FreetShadow :freet="refreet.freetId" />

    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import FreetShadow from "@/components/Freet/FreetShadowComponent.vue";

export default {
  name: "RefreetComponent",
  components: { FreetShadow },
  props: {
    // Data from the stored freet
    refreet: {
      type: Object,
      required: true,
    },
  },
  data() {
    {
      {
        this.refreet.caption;
      }
    }
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.refreet.caption, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },

  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.refreet.caption; // The caption of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this refreet.
       */
      this.editing = false;
      this.draft = this.refreet.caption;
    },
    deleterefreet() {
      /**
       * Deletes this refreet.
       */
      const params = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request

        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted refreet!",
            status: "success",
          });
        },
      };
      fetch(`/api/refreets/${this.refreet._id}`, params).then(() => {
        this.$store.commit("refreshRefreets");
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el);
      });
    },
    submitEdit() {
      /**
       * Updates refreet to have the submitted draft content.
       */
      if (this.refreet.caption === this.draft) {
        const error =
          "Error: Edited refreet content should be different than current refreet content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      const params = {
        method: "PATCH",
        message: "Successfully edited refreet!",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request

        body: JSON.stringify({ caption: this.draft }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      fetch(`/api/refreets/${this.refreet._id}`, params)
        .then((res) => res.json())
        .then((res) => {
          this.$store.commit("refreshRefreets");

          // this.refreet.caption = res.refreet.caption;
          this.editing = false;
          this.draft = "";
        });
    },
  },
};
</script>

<style scoped>
.refreet {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  border-radius: 20px;
  margin: 10px 0;
  border: white 50px;
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
