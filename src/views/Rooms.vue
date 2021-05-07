<template>
  <div class="fix">
    <button
      @click="joinRoom(room)"
      class="kiste"
      :key="room.id"
      v-for="room in rooms"
      :disabled="disabled(room)"
    >
      <span>{{ room.name }}</span>
      <span v-show="room.start"> (bereits im Spiel)</span>
      <span v-show="room.members"> {{ room.members }}</span>
    </button>
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
      let roomArray = [];
      doc.forEach((doc) => {
        let post = doc.data();
        post.id = doc.id;
        roomArray.push(post);
      });
      this.$store.commit("games/setRooms", roomArray);
    });
  },
  mounted() {
    /*    let timer = null;
    timer = setInterval(() => {
      if (this.user.room) {
        this.$router.push({
          name: "GameId",
          params: { id: this.user.room.id },
        });
        clearInterval(timer);
      }
    }, 500); */
  },
  methods: {
    disabled(room) {
      return room.start;
    },
    createRoom() {
      let room = {};
      room.id = (+new Date()).toString();
      room.name = this.user.name + "'s Room";
      room.host = this.user;
      room.game = "schaefchen";
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
  background: lightcyan;
  cursor: pointer;
  &:hover {
    background: rgb(174, 255, 255);
  }
  width: 100%;
}
</style>