<template>
  <main>
    <section v-if="!$store.state.username">
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <p>Please log in or create an account to get started!</p>
      <!-- Already logged in,they'll be routed to feed by backend! -->
    </section>
  </main>
</template>
