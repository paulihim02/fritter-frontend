<!-- Default page that also displays freets, refreets, and shared freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <br />
      <main style="margin-bottom: 0px; padding-bottom: 12px">
        <CreateFreetForm style="margin-bottom: 0px; padding-bottom: 12px" />
      </main>
    </section>

    <section>
      <main style="margin-bottom: 0px; padding-bottom: 16px">
        <div style="padding: 0px 10px">
          <h2>
            <div v-if="$store.state.freetsFilter">
              viewing freets and refreets by @{{ $store.state.freetsFilter }}
            </div>
            <div v-else>viewing feed</div>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 filter by author (optional)"
            button="🔄 get freets"
          />
        </div>
      </main>
      <FreetsPage style="margin-bottom: 0px; padding-bottom: 0px" />
      <p class="text-center">•••---•••</p>

      <RefreetsPage style="margin-top: 0px; padding-top: 2px" />

      <article
        v-if="!$store.state.freets.length && !$store.state.refreets.length"
      >
        <br />
        <h3>no freets found !</h3>
      </article>
    </section>
  </main>
</template>

<script>
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";
import GetFreetsForm from "@/components/Freet/GetFreetsForm.vue";
import FreetsPage from "@/components/Freet/FreetsPage.vue";
import RefreetsPage from "@/components/Refreet/RefreetsPage.vue";

export default {
  name: "HomePage",
  components: {
    GetFreetsForm,
    CreateFreetForm,
    FreetsPage,
    RefreetsPage,
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
