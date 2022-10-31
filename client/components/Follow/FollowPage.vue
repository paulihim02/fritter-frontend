<template>
  <main>
    <h1>Follow Someone</h1>
    <section>
      <FollowForm />
    </section>
  </main>
</template>

<script>
import FollowForm from "@/components/Follow/FollowForm.vue";

export default {
  name: "FollowPage",
  components: {
    FollowForm,
  },
};
</script>
