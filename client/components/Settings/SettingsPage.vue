<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Settings @{{ $store.state.username }}</h2>
      </header>

      <ChangeUsernameForm />
      <ChangePasswordForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from "@/components/Settings/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Settings/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Settings/DeleteAccountForm.vue";
import LogoutForm from "@/components/Settings/LogoutForm.vue";
import CommonModal from "@/components/common/CommonModal.vue";

export default {
  name: "SettingsPage",
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    CommonModal,
  },

  methods: {
    showLogoutModal() {
      console.log("logging out?");
      this.$refs.logoutModal.showModal();
    },
    hideLogoutModal() {
      console.log("logging out innn?");
      this.$refs.logoutModal.hideModal();
    },
  },
};
</script>
