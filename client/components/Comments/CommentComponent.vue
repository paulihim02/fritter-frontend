<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="comment">
    <header>
      <h5 class="author">@{{ comment.author }}</h5>
      <div
        v-if="$store.state.username === comment.author"
        class="actions inline"
      >
        <b-button v-if="editing" @click="submitEdit" class="action inline"
          >✅ Save changes</b-button
        >
        <b-button v-if="editing" @click="stopEditing" class="action inline"
          >🚫 Discard changes</b-button
        >
        <b-button v-if="!editing" @click="startEditing" class="action inline"
          >✏️ Edit</b-button
        >
        <b-button @click="deleteComment" class="action inline"
          >🗑️ Delete</b-button
        >
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p v-else class="content">
      {{ comment.content }}
    </p>
    <p class="info">
      last modified @{{ comment.dateModified }}
      <i v-if="comment.edited">(edited)</i>
    </p>
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
export default {
  name: "CommentComponent",
  props: {
    // Data from the stored freet
    comment: {
      type: Object,
      required: true,
    },
    setComment: {
      type: Function,
    },
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.comment.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },

  methods: {
    makeComments() {
      fetch(
        `/api/comments?freetComment=false
      `,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: this.value }),
          credentials: "same-origin", // Sends express-session credentials with request
        }
      ).then((res) => {
        // this.setComment(true);
      });
    },

    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.comment.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this comment.
       */
      this.editing = false;
      this.draft = this.comment.content;
    },
    deleteComment() {
      /**
       * Deletes this comment.
       */
      const params = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request

        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted comment!",
            status: "success",
          });
        },
      };
      fetch(`/api/comments/${this.comment._id}`, params).then(() => {
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el);
      });
    },
    submitEdit() {
      /**
       * Updates comment to have the submitted draft content.
       */
      if (this.comment.content === this.draft) {
        const error =
          "Error: Edited comment content should be different than current comment content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      const params = {
        method: "PATCH",
        message: "Successfully edited comment!",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request

        body: JSON.stringify({ content: this.draft }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      fetch(`/api/comments/${this.comment._id}`, params)
        .then((res) => res.json())
        .then((res) => {
          this.comment.content = res.comment.content;
          this.editing = false;
          this.draft = "";
        });
    },
  },
};
</script>

<style scoped>
.comment {
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
