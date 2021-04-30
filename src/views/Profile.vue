<template>
  <div class="fix" v-if="user">
    <h1>{{ user.name }}</h1>
    <button class="btn danger" @click="deleteAccount">delete</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  computed: {
    ...mapState("account", ["user"]),
  },
  methods: {
    deleteAccount() {
      this.$store.dispatch("account/deleteAccount");
    },
  },
};
</script>
