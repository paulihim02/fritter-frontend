<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="freet">
    <h3 class="author">{{ freet.author ? "@" + freet.author : "" }}</h3>
    <span style="color: skyblue; position: absolute; right: 43%" v-if="isVally">
      ••••••• vallied •freet• •••••••</span
    >
    <p class="content">
      {{ freet.content }}
    </p>

    <p class="info">
      last modified at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
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
  name: "FreetShadow",
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return { alerts: {}, isVally: false };
  },

  mounted() {
    const vallys = fetch(`/api/vally/${this.freet._id}`)
      .then((res) => res.json())
      .then((vallys) => {
        let points = 0;
        for (const vally of vallys.vally) {
          points += vally.vallyStrength;
        }

        if (points >= 1) {
          this.isVally = true;
        }
      });
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

* {
  background-color: #555555;
}
</style>
