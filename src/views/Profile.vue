<template>
  <div class="fix" v-if="user">
    <h1>{{ user.name }}</h1>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  computed: {
    ...mapState("account", ["user"]),
  },
};
</script>
