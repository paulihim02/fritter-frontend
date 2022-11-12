<!-- Form for creating freets (block style) -->
<template>
  <article style="min-width: 300px">
    <SearchForm :showUsers="false" style="width: 100%" />

    <div v-for="user of $store.state.users" :key="user._id">
      <b-row
        align-v="center"
        v-if="user.username !== $store.state.username"
        style="width: 100%; background-color: "
      >
        <b-col cols="1" style="background-color: ">
          <b-form-checkbox size="lg" @change="toggleUser(user._id)" />
        </b-col>
        <b-col cols="10" style="border-radius: 20px">
          <b-card style="border-radius: 20px; margin: 8px">
            {{
              user.username === $store.state.username
                ? user.username + " (me)"
                : user.username
            }}
          </b-card>
        </b-col>
      </b-row>
    </div>
    <div v-if="!$store.state.users.length" style="width: auto">
      no users found
    </div>
  </article>
</template>

<script>
import SearchForm from "@/components/common/SearchForm.vue";
export default {
  name: "ShareModal",
  props: { freet: { type: Object, required: true } },
  components: { SearchForm },
  data() {
    return { checkboxes: {} };
  },

  beforeCreate() {
    this.$store.commit("setUsersFilter", "");
    this.$store.commit("refreshUsers");
  },

  methods: {
    toggleUser(userid) {
      if (this.checkboxes[userid]) {
        this.checkboxes[userid] = {
          id: userid,
          selected: !this.checkboxes[userid].selected,
        };
      } else {
        this.checkboxes[userid] = { id: userid, selected: true };
      }
      console.log(this.checkboxes);
    },

    // reset() {
    //   this.$store.commit("setUsersFilter", null);
    //   this.$store.commit("setUsers", []);
    //   console.log("resetting", this.$store.state.usersFilter);
    // },

    submit() {
      const toShare = Object.values(this.checkboxes).filter(
        (select) => select.selected
      );

      const url = "/api/shares";
      const params = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };

      const shareCalls = toShare.map((share) => {
        const body = { freetId: this.freet._id, audienceId: share.id };
        console.log("body to post", body);
        return fetch(url, { ...params, body: JSON.stringify(body) });
      });

      Promise.all(shareCalls).then((res) => res);
      this.$store.commit("setUsersFilter", null);
    },
  },
};
</script>
