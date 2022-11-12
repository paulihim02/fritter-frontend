<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="freet">
    <header>
      <h5 class="author">
        @{{ freet.author }}
        <span class="info" style="float: right; color: #bdbcbc">
          –• {{ freet.dateModified }} | (edited)
        </span>
        <span style="color: skyblue; position: absolute; right: 37%"
          >vally range | move to see if freet is still vally</span
        >
        <b-input
          v-model="vallyThreshold"
          type="range"
          min="-5"
          max="5"
          step="0.001"
        />
        vallythreshold: {{ vallyThreshold }}
        <span
          style="color: hotpink; position: absolute; right: 43%"
          v-if="vallyPoints >= vallyThreshold"
        >
          ••••••• vallied •freet• •••••••</span
        >

        <b-button id="vally-btn" @click="showVal = !showVal">
          give √ally
        </b-button>

        <div
          class="btn-group"
          v-show="showVal"
          style="position: absolute; right: 24px; margin: 84px 8px"
        >
          <b-button
            style="background-color: red; opacity: 1"
            :value="-3"
            @click="vally = -3"
            >devally devally</b-button
          >
          <b-button
            style="background-color: red; opacity: 0.7"
            :value="-2"
            @click="vally = -2"
            >strong devally</b-button
          >
          <b-button
            style="background-color: red; opacity: 0.5"
            :value="-1"
            @click="vally = -1"
            >devally</b-button
          >

          <b-button
            style="background-color: green; opacity: 0.5"
            :value="1"
            @click="vally = 1"
            >vally</b-button
          >
          <b-button
            style="background-color: green; opacity: 0.7"
            :value="2"
            @click="vally = 2"
            >strong vally</b-button
          >
          <b-button
            style="background-color: green; opacity: 1"
            :value="3"
            @click="vally = 3"
            >vally vally</b-button
          >
        </div>
        <b-button
          v-show="showVal"
          @click="submitVally()"
          style="position: absolute; right: 24px; top: 190px; margin: 8px"
          >vally</b-button
        >
      </h5>

      <div v-if="$store.state.username === freet.author" class="actions">
        <b-button v-if="editing" @click="submitEdit" class="action"
          >✅ Save changes</b-button
        >
        <b-button v-if="editing" @click="stopEditing" class="action"
          >🚫 Discard changes</b-button
        >
        <b-button v-if="!editing" @click="startEditing" class="action"
          >✏️ Edit</b-button
        >
        <b-button @click="deleteFreet" class="action">🗑️ Delete</b-button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p v-else class="content">
      {{ freet.content }}
    </p>

    <article
      style="padding-top: 10px"
      class="interactions"
      v-show="showComment || showRefreet || showShare"
    >
      <div style="display: flex; align-items: baseline; gap: 10px">
        <b-col cols="1" style="align-self: flex-start" v-show="showComment">
          <div v-b-modal="freet._id + 'comment'">
            <b-icon icon="reply" style="padding-bottom: 24px" scale="2" />
          </div>
        </b-col>
        <b-col cols="1" style="align-self: flex-start" v-show="showRefreet">
          <div v-b-modal="freet._id + 'refreet'">
            <b-iconstack scale="1">
              <b-icon icon="arrow-return-right" />
              <b-icon icon="arrow-return-right" rotate="180" shift-v="10" />
            </b-iconstack>
          </div>
        </b-col>

        <b-col cols="1" style="align-self: flex-start" v-show="showShare">
          <div v-b-modal="freet._id + 'share'">
            <b-icon icon="share" style="padding-bottom: 24px" scale="1.5" />
          </div>
        </b-col>
      </div>
    </article>

    <b-modal
      :id="freet._id + 'comment'"
      centered
      content-class="shadow"
      no-fade
      title="make a comment"
      style="background-color: crimson !important"
      class="comment-modal"
      @ok="$refs.commentModal.submit()"
    >
      <CreateComment
        :commentingOn="freet"
        :freetComment="true"
        ref="commentModal"
      />
    </b-modal>
    <b-modal
      :id="freet._id + 'refreet'"
      class="modal refreet-modal border-0"
      title="refreet"
      @ok="$refs.refreetModal.submit()"
      ok-title="refreet"
      centered
      hide-header
      ><CreateRefreet :refreet="freet" ref="refreetModal" />
    </b-modal>
    <b-modal
      :id="freet._id + 'share'"
      class="modal share-modal"
      @ok="$refs.shareModal.submit()"
    >
      <ShareModal ref="shareModal" :freet="freet" />
    </b-modal>

    <button
      class="btn"
      data-toggle="dropdown"
      style="margin-left: 0px; padding-left: 0px"
      @click="toggleComments"
    >
      {{ hideComments ? "view comments" : "hide comments" }}
    </button>

    <section v-if="!hideComments && !!Object.keys(comments).length">
      <div v-for="comment of comments" :key="comment._id">
        <CommentComponent
          style="padding-left: 24px"
          v-if="
            !hideComments &&
            comment.commentedOn.toString() === freet._id.toString()
          "
          :comment="comment"
        />
      </div>
    </section>
    <div v-if="!hideComments && !Object.keys(comments).length">
      <b-card-footer>no comments. make the first one!</b-card-footer>
    </div>

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
import CommentComponent from "@/components/Comments/CommentComponent.vue";
import CreateComment from "@/components/Comments/CreateComment.vue";
import CreateRefreet from "@/components/Refreet/CreateRefreet.vue";
import ShareModal from "@/components/Share/ShareModal.vue";

export default {
  name: "FreetComponent",
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true,
    },
    showComment: {
      type: Boolean,
      default: true,
    },
    showRefreet: {
      type: Boolean,
      default: true,
    },
    showShare: {
      type: Boolean,
      default: true,
    },
  },
  components: { CommentComponent, CreateComment, CreateRefreet, ShareModal },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      comments: {},
      vallyThreshold: 2,
      vallyPoints: 0,
      vally: 0,
      showVal: false,
      hideComments: true,
    };
  },
  mounted() {
    const vallys = fetch(`/api/vally/${this.freet._id}`)
      .then((res) => res.json())
      .then((vallys) => {
        for (const vally of vallys.vally) {
          this.vallyPoints += vally.vallyStrength;
        }
      });
  },
  methods: {
    toggleComments() {
      if (!this.hideComments) {
        // clear comments
        this.comments = {};
        this.hideComments = true;
        return;
      }
      this.hideComments = false;

      console.log(this.freet.author);
      const comments = fetch(
        `/api/comments?freetItemId=${this.freet._id}
      `,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin", // Sends express-session credentials with request
        }
      )
        .then((res) => res.json())
        .then((res) => {
          this.comments = res;
        });

      return;
    },

    submitVally() {
      this.showVal = false;
      const freetId = this.freet._id;

      if (!this.vally) {
        return;
      }

      const vally = fetch("/api/vally", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freetId, points: this.vally }),
      })
        .then((vally) => vally.json())
        .then((vally) => console.log("result is", vally));

      this.vally = 0;
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted freet!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error =
          "Error: Edited freet content should be different than current freet content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited freet!",
        body: JSON.stringify({ content: this.draft }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit("refreshFreets");

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.freet {
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

.comment-modal {
  opacity: 0.5 !important;
}
.modal-header {
  border-bottom: 0 none;
}

.modal-footer {
  border-top: 0 none;
}

.modal-backdrop {
  background-color: white;
}

#vally-btn {
  right: 24px;
  margin: 42px 8px;
  padding: 6px 8px;
  position: absolute;
  color: rgb(250, 198, 198);
  font-size: 16px;
  background-color: #191919;
  border-radius: 12px;
}

* {
  background-color: #555555;
}
</style>
