<!-- Form for following (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "CircleForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/circles",
      method: "POST",
      hasBody: true,
      fields: [{ circleId: "circleId", label: "ID of cricle", value: "" }],
      refreshFollow: true,
      title: "circles",
      callback: () => {
        this.$store.commit("alert", {
          message: "You are now circling this user",
          status: "success",
        });
      },
    };
  },
};
</script>
