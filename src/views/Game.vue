<template>
  <div class="fix" v-if="room">
    <h1 class="change">{{ room.name }}</h1>
    <div v-if="!room.start">
      <h2 v-if="room.win">{{ room.win }}</h2>
      <div>
        <h4>Players</h4>
        <p :key="member.uid" v-for="member in members">
          <span>{{ member.name }}</span>
          <span v-if="room.host.uid == member.uid">(host)</span>
        </p>
      </div>
    </div>

    <Spyfall v-else-if="room.game == 'spyfall'" />
    <div v-if="admin">
      <div v-if="!room.start">
        <h3>Game:</h3>
        <button
          @click="selectGame(game.id)"
          class="btn unselected"
          :class="{ selected: game.id == room.game }"
          :key="game.id"
          v-for="game in games"
        >
          {{ game.name }}
        </button>
      </div>
      <h3>Server:</h3>
      <button v-if="!room.start" @click="deleteRoom" class="btn danger">
        Löschen
      </button>
      <button v-if="!room.start" @click="startGame" class="btn">Starten</button>
      <button v-else @click="stop" class="btn">Stop</button>
      <span v-show="members.length < 3"
        >Mindestens 3 Spieler zum starten erforderlich</span
      >
    </div>
    <div v-else>
      <button @click="leaveRoom" class="btn">Verlassen</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { roomCollection, usersCollection } from "../firebase";
import games from "@/assets/games.json";
import Spyfall from "@/components/Spyfall";

export default {
  name: "Game",
  props: {
    id: [String, Number],
  },
  data() {
    return {
      games: games,
      changing: false,
    };
  },
  computed: {
    ...mapState("games", ["room", "admin", "members"]),
    ...mapState("account", ["user"]),
  },
  components: {
    Spyfall,
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

    /*    addEventListener(
      "beforeunload",
      () => {
        this.checkClose();
      },
      { capture: true }
    ); */
  },
  mounted() {
    /* setTimeout(() => {
      if (this.members.find((x) => x.uid == this.user.uid) == undefined) {
        this.$router.push("/");
      }
    }, 1000); */
  },
  methods: {
    stop() {
      this.$store.dispatch("games/stopGame", {
        room: this.room,
      });
    },
    selectGame(game) {
      this.$store.dispatch("games/changeGame", {
        room: this.room,
        game: game,
      });
    },
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
    startGame() {
      this.$store.dispatch("games/" + this.room.game + "/start", {
        room: this.room,
      });
    },
    checkClose() {
      if (this.admin) {
        this.deleteRoom();
      } else {
        this.leaveRoom();
      }
    },
  },
  /*  beforeDestroy() {
    this.checkClose();
  }, */
};
</script>

<style lang="scss" scoped>
.btn {
  margin: 1rem 0.5rem;
}
.unselected {
  background: lightgrey;
}
.selected {
  background: rgb(88, 226, 88);
}
</style>
