<template>
  <main>
    <article v-if="user" :key="user._id">
      <b-card
        v-if="user.username !== $store.state.username"
        :title="'@ ' + user.username"
        style="border: solid; 2px; border-radius: 20px; border-color: #0288d1;"
      >
        <b-card-body>
          {{
            following
              ? "@ " + user.username + " is following you"
              : user.username + " is not following you"
          }}
        </b-card-body>
        <b-card-footer>
          <b-button
            v-if="following"
            style="margin-right: 30px"
            class="btn btn-danger"
            @click="unfollowUser(user.username)"
          >
            - unfollow
          </b-button>

          <b-button
            v-else
            style="margin-right: 45px"
            class="btn btn-success"
            @click="followUser(user.username)"
          >
            + follow
          </b-button>
          <b-button
            style="margin-right: 45px"
            :class="circleOne ? 'btn btn-danger' : 'btn btn-success'"
            v-b-modal="user.username + '1'"
            @click="
              circleOne
                ? removeFromCircle(user._id, 1)
                : addToCircle(user._id, 1)
            "
          >
            {{ circleOne ? "- remove from circle one" : "+ add to circle one" }}
          </b-button>
          <b-button
            style="margin-right: 45px"
            :class="circleTwo ? 'btn btn-danger' : 'btn btn-success'"
            v-b-modal="user.username + '2'"
            @click="
              circleTwo
                ? removeFromCircle(user._id, 2)
                : addToCircle(user._id, 2)
            "
          >
            {{ circleTwo ? "- remove from circle two" : "+ add to circle two" }}
          </b-button>

          <b-button
            style="margin-right: 45px"
            :class="circleThree ? 'btn btn-danger' : 'btn btn-success'"
            v-b-modal="user.username + '2'"
            @click="
              circleThree
                ? removeFromCircle(user._id, 3)
                : addToCircle(user._id, 3)
            "
          >
            {{
              circleThree
                ? "- remove from circle three"
                : "+ add to circle three"
            }}
          </b-button>
        </b-card-footer>
      </b-card>
      <b-card v-else>
        <b-card-body> your profile! </b-card-body>
        <b-card-footer>
          <p>username: {{ user.username }}</p>
          <p>date you joined Fritter: {{ user.dateJoined }}</p>
          <b-card>
            <b-tabs card>
              <b-tab title="your freets">
                <article v-for="freet of freets">
                  <FreetComponent :freet="freet" />
                </article>
                <article v-if="!freets">
                  no freets yet. make your first one!
                </article>
              </b-tab>
              <b-tab title="following">
                <article v-for="followUser of profileFollowing">
                  <b-card>
                    {{ followUser.username }}
                  </b-card>
                </article>
                <article v-if="!profileFollowing.length">
                  your not following anyone. follow your first friend
                </article>
              </b-tab>
              <b-tab title="followers">
                <article v-for="followedBy of profileFollowers">
                  <b-card>
                    {{ followedBy.username }}
                  </b-card>
                </article>
                <article v-if="!profileFollowers.length">
                  no followers
                </article></b-tab
              >
            </b-tabs>
          </b-card>
        </b-card-footer>
      </b-card>
    </article>
  </main>
</template>
<script>
import GetUsers from "@/components/Follow/GetUsers.vue";
import FreetComponent from "@/components/Freet/FreetComponent.vue";

export default {
  name: "ProfilePage",
  data() {
    return {
      user: {},
      profileFollowing: [],
      profileFollowers: [],
      following: false,
      circleOne: false,
      circleTwo: false,
      circleThree: false,
    };
  },
  components: {
    GetUsers,
    FreetComponent,
  },
  computed: {
    freets() {
      return this.$store.state.freets.filter(
        (freet) => freet.author === this.$store.state.username
      );
    },
  },
  beforeCreate() {
    fetch(`/api/users?filter=${this.$route.params.username}`)
      .then((res) => res.json())
      .then((res) => {
        this.user = res.users[0];

        fetch(`/api/circles/${this.$store.state.userId}/${this.user._id}/1`)
          .then((res) => res.json())
          .then((res) => {
            this.circleOne = !!res.circle;
          });
        fetch(`/api/circles/${this.$store.state.userId}/${this.user._id}/2`)
          .then((res) => res.json())
          .then((res) => {
            this.circleTwo = !!res.circle;
          });
        fetch(`/api/circles/${this.$store.state.userId}/${this.user._id}/3`)
          .then((res) => res.json())
          .then((res) => {
            this.circleThree = !!res.circle;
          });
        fetch(`/api/follows/${this.$route.params.username}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin", // Sends express-session credentials with request
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res.following);
            this.profileFollowing = res.following;
            this.profileFollower = res.followers;
            return res.following;
          });
      });
  },

  methods: {
    followUser: function async(username) {
      fetch(`/api/follows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        credentials: "same-origin", // Sends express-session credentials with request
      })
        .then((res) => res.json())
        .then((res) => {
          this.following = res.follow;
        });
    },
    unfollowUser: function async(username) {
      fetch(`/api/follows/${username}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        credentials: "same-origin", // Sends express-session credentials with request
      })
        .then((res) => res.json())
        .then((res) => {
          this.following = !res.removed;
        });
    },

    addToCircle: function async(userId, rank) {
      console.log(userId, rank, "to add to circle");
      fetch(`/api/circles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, rank }),
        credentials: "same-origin", // Sends express-session credentials with request
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          rank === 1
            ? (this.circleOne = res.circle.rank)
            : rank === 2
            ? (this.circleTwo = res.circle.rank)
            : (this.circleThree = res.circle.rank);
        });
    },

    removeFromCircle: function async(userId, rank) {
      fetch(`/api/circles`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: this.$store.state.userId,
          userId,
          rank,
        }),
        credentials: "same-origin", // Sends express-session credentials with request
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          switch (rank) {
            case 1:
              this.circleOne = !res.removed;
              break;
            case 2:
              this.circleTwo = !res.removed;
              break;

            case 3:
              this.circleThree = !res.removed;
              break;
            default:
            // do nothing else
          }
        });
    },
  },
};
</script>
