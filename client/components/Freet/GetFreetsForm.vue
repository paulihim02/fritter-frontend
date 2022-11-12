<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from "@/components/common/InlineForm.vue";

export default {
  name: "GetFreetsForm",
  mixins: [InlineForm],
  data() {
    return { value: this.$store.state.freetsFilter };
  },
  methods: {
    async submit() {
      const url = this.value
        ? `/api/freets?username=${this.value}`
        : "/api/freets";

      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit("setFreetsFilter", this.value);
        this.$store.commit("setFreets", res);
      } catch (e) {
        if (this.value === this.$store.state.freetsFilter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit("setFreetsFilter", null);
          this.value = ""; // Clear filter to show all users' freets
          this.$store.commit("refreshFreets");
          this.$store.commit("refreshRefreets");
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.freetsFilter;
        }

        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>
