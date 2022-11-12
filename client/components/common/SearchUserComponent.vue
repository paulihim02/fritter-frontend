<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <article>
    <a :href="`#/profile/${user.username}`">
      <b-card style="border-radius: 4px; z-index: 10">
        {{
          user.username === $store.state.username
            ? user.username + " (me)"
            : user.username
        }}
      </b-card>
    </a>
  </article>
</template>

<script>
export default {
  name: "SearchUserComponent",
  props: {
    user: { type: Object, required: true },
  },
  data() {
    return { value: "" };
  },
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
}
</style>
