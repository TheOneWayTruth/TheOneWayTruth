<template>
  <div class="fix" v-if="user">
    <h1 class="change" @click="selectHeader" v-if="!changing">
      {{ user.name }}
    </h1>
    <div @focusout="changeUsername" v-else class="flex">
      <input ref="name" v-model="user.name" />
    </div>
    <p>{{ user.email }}</p>
    <button class="btn danger" @click="deleteAccount">Delete User</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      changing: false,
    };
  },
  computed: {
    ...mapState("account", ["user"]),
  },
  methods: {
    selectHeader() {
      this.changing = true;
      this.$nextTick(() => {
        this.$refs.name.focus();
      });
    },
    deleteAccount() {
      this.$store.dispatch("account/deleteAccount");
    },
    changeUsername() {
      this.$store.dispatch("account/changeUsername", this.user.name);
      this.changing = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  margin: 0em 1rem;
}

.flex {
  justify-content: space-between;
}

input {
  margin-bottom: 0px;
  font-size: 2rem;
}
h1 {
  padding: 1rem;
}
.danger {
  margin: 1rem 0px;
}
</style>