<!-- Form for getting users searched (block style) -->

<script>
import InlineForm from "@/components/common/InlineForm.vue";

export default {
  name: "GetUsers",
  mixins: [InlineForm],
  data() {
    return { value: this.$store.state.usersFilter };
  },

  methods: {
    async submit() {
      const url = `/api/users/?filter=${this.value}`;

      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit("setUsersFilter", this.value);
        this.$store.commit("setUsers", res.users);

        console.log(res.users, this.$store.state.users);
      } catch (e) {
        if (this.value === this.$store.state.usersFilter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit("setUsersFilter", null);
          this.value = ""; // Clear filters
          this.$store.commit("refreshUsers");
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.usersFilter;
        }

        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>
