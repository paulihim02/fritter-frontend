<!-- Form for following (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "FollowForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/follows",
      method: "POST",
      hasBody: true,
      fields: [{ id: "username", label: "Username", value: "" }],
      refreshFollow: true,
      title: "follow",
      callback: () => {
        this.$store.commit("alert", {
          message: "You are now following this user",
          status: "success",
        });
      },
    };
  },
};
</script>
