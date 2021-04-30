<template>
  <div class="fix">
    <div
      @click="joinRoom(room)"
      class="kiste"
      :key="room.id"
      v-for="room in rooms"
    >
      {{ room.name }}
    </div>
    <button class="btn" @click="createRoom">create Room</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { roomCollection } from "../firebase";

export default {
  name: "Rooms",
  computed: {
    ...mapState("games", ["rooms"]),
    ...mapState("account", ["user"]),
  },
  created() {
    roomCollection.orderBy("id", "desc").onSnapshot((doc) => {
      if (!doc.empty) {
        let roomArray = [];
        doc.forEach((doc) => {
          let post = doc.data();
          post.id = doc.id;
          roomArray.push(post);
        });
        this.$store.commit("games/setRooms", roomArray);
      }
    });
  },
  methods: {
    createRoom() {
      let room = {};
      room.id = (+new Date()).toString();
      room.name = this.user.name + "'s Room";
      room.host = this.user;
      this.$store.dispatch("games/createRoom", { room: room, user: this.user });
    },
    joinRoom(room) {
      this.$store.dispatch("games/joinRoom", { room: room, user: this.user });
    },
  },
};
</script>



<style lang="scss" scoped>
.kiste {
  border: 1px solid black;
  margin: 10px 0px;
  padding: 10px;
  background: lightgrey;
  cursor: pointer;
  &:hover {
    background: grey;
  }
}
</style>