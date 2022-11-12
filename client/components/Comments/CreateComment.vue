<!-- Form for creating freets (block style) -->
<template>
  <article style="background-color: grey; margin: 8px">
    <div style="padding: 10px">
      <FreetShadow :freet="commentingOn" />
      comment:
      <b-textarea v-model="content" />
    </div>
  </article>
</template>

<script>
import BlockForm from "@/components/common/BlockForm.vue";
import FreetShadow from "@/components/Freet/FreetShadowComponent.vue";

export default {
  name: "CreateComment",
  // mixins: [BlockForm],
  props: {
    // username responding to
    commentingOn: { type: Object, required: true },
    freetComment: { type: Boolean, required: true },
    submitCallback: { type: Object },
  },
  components: { FreetShadow },
  data() {
    return { content: "" };
  },

  methods: {
    submit() {
      console.log("submitting!");
      const body = {
        commentItemId: this.freetComment ? null : this.commentingOn._id,
        freetItemId: this.freetComment ? this.commentingOn._id : null,
        content: this.content,
      };
      console.log(body);
      fetch(
        `/api/comments?freetComment=true
      `,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(body), // Sends express-session credentials with request
        }
      ).then((res) => {
        this.$router.go(0);
      });
      // this.$store.commit("refreshFreets");
    },
  },
};
</script>
