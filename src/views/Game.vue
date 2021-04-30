<template>
  <div class="fix" v-if="room">
    <h1>{{ room.name }}</h1>
    <div>
      <h4>Players</h4>
      <div :key="member.uid" v-for="member in members">
        <span>{{ member.name }}</span>
        <span v-if="room.host.uid == member.uid"> (host)</span>
      </div>
    </div>
    <div v-if="admin">
      <button @click="deleteRoom" class="btn danger">Delete</button>
    </div>
    <div v-else>
      <button @click="leaveRoom" class="btn">Leave</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { roomCollection, usersCollection } from "../firebase";

export default {
  name: "Game",
  props: {
    id: [String, Number],
  },
  computed: {
    ...mapState("games", ["room", "admin", "members"]),
    ...mapState("account", ["user"]),
  },
  created() {
    roomCollection.doc(this.id).onSnapshot((doc) => {
      if (doc.exists) {
        let el = doc.data();
        el.id = doc.id;
        this.$store.dispatch("games/checkAdmin", el);
        this.$store.commit("games/setRoom", el);
      } else {
        this.$router.push("/");
      }
    });
    usersCollection
      .where("room.id", "==", this.id.toString())
      .onSnapshot((doc) => {
        let members = [];
        doc.forEach((doc) => {
          let user = doc.data();
          user.uid = doc.id;
          members.push(user);
        });
        this.$store.commit("games/setMembers", members);
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
