<template>
  <div id="app">
    <md-toolbar class="md-primary">
      <h3 class="md-title" style="flex: 1">MG Motors</h3>
      <md-button @click="route('/')">Home</md-button>
      <md-button @click="route('/broadcast')" class="md-primary">Broadcast</md-button>
      <md-button @click="route('/quiz')" class="md-primary">Quiz</md-button>
      <md-button v-if="isLoggedIn" @click="logout" class="md-primary">Logout</md-button>
      <md-button v-else @click="route('/login')" class="md-primary">Login</md-button>
      <md-button v-if="!isLoggedIn" @click="route('/register')" class="md-primary">Register</md-button>
    </md-toolbar>

    <div>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    route(path) {
      this.$router.push(path);
    },
    logout() {
      localStorage.removeItem("user-token");
      this.$store.commit("LOGOUT");
      this.$router.push("/login");
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn;
    }
  }
};
</script>

<style>
</style>
