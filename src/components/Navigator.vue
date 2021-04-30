<template>
  <header v-if="user.name">
    <section>
      <div class="col1">
        <router-link
          v-if="user.room"
          :to="{ name: 'GameId', params: { id: user.room.id } }"
        >
          {{ user.room.name }}</router-link
        >
        <router-link v-else to="/">Rooms</router-link>
        <ul class="inline">
          <li>
            <router-link to="/profile">Profile</router-link>
          </li>
          <li><a @click="logout()">logout</a></li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Navigator",
  computed: {
    ...mapState("account", ["user"]),
  },
  methods: {
    logout() {
      this.$store.dispatch("account/logout");
    },
  },
};
</script>

<style lang="scss">
$white: #fff;
$dark: #555;
header {
  position: relative;
  background: $white;
  box-shadow: 0 0 5px 0 rgba($dark, 0.5);
  z-index: 10;

  h3 {
    display: inline-block;
  }

  ul {
    float: right;
    text-align: right;

    li {
      margin-top: 4px;
      margin-left: 6px;

      a {
        display: block;
        padding: 5px;
      }
    }
  }

  @media screen and (max-width: 742px) {
    h3 {
      display: block;
      text-align: center;
    }

    ul {
      float: none;
      text-align: center;
    }
  }
}
</style>


