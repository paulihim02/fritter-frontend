<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article>
    <div>shared by: {{ sharedBy.username }}</div>
    shared to: {{ sharedTo.username }}
    <FreetShadow :freet="freet" />
  </article>
</template>

<script>
import FreetShadow from "@/components/Freet/FreetShadowComponent.vue";
import RefreetComponent from "@/components/Refreet/RefreetComponent.vue";

export default {
  name: "SharedComponent",
  props: {
    freet: { type: Object, required: true },
    sharedBy: { type: Object, required: true },
    sharedTo: { type: Object, required: true },
  },
  components: { RefreetComponent, FreetShadow },
  data() {
    return { alerts: {} };
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
