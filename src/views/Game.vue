<template>
  <div class="fix" v-if="room">
    <h1>{{ room.name }}</h1>
    <div v-if="room.host">
      <span>Host: </span>
      <span>{{ room.host.name }}</span>
    </div>
    <button v-if="admin" @click="deleteRoom" class="btn">Delete</button>
    <button v-else @click="leaveRoom" class="btn">Leave</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { roomCollection } from "../firebase";

export default {
  name: "Game",
  props: {
    id: [String, Number],
  },
  computed: {
    ...mapState("games", ["room", "admin"]),
    ...mapState("account", ["user"]),
  },
  created() {
    roomCollection.doc(this.id).onSnapshot((doc) => {
      if (doc.exists) {
        let el = doc.data();
        el.id = doc.id;
        this.$store.dispatch("games/checkAdmin", el);
        this.$store.commit("games/setRoom", el);
      }
    });
  },
  methods: {
    leaveRoom() {
      this.$store.dispatch("games/leaveRoom", {
        room: this.room,
        user: this.user,
      });
    },
    deleteRoom() {
      this.$store.dispatch("games/deleteRoom", {
        room: this.room,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  margin: 10px 5px;
}
</style>
