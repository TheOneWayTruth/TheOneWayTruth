<template>
  <div class="fix" v-if="room">
    <h1 class="change">{{ room.name }}</h1>
    <h2 v-if="room.win && !room.start">{{ room.win }}</h2>
    <div v-if="room.host">
      <h4>Players</h4>
      <p :key="member.uid" v-for="member in members">
        <span>{{ member.name }}</span>
        <span v-if="room.host.uid == member.uid">(host)</span>
        <span v-if="room.start">
          <span
            @click="accuse(member.uid)"
            v-if="room.game == 'spyfall' && member.uid != user.uid"
            class="btn mini danger"
          >
            <span v-if="room.roles[member.uid].accuse.indexOf(user.uid) == -1"
              >verdächtigen</span
            >
            <span v-else>zurückziehen</span>
          </span>
          <span v-show="room.roles[member.uid].accuse.length > 0">{{
            room.roles[member.uid].accuse.length
          }}</span>
        </span>
      </p>
    </div>

    <div v-if="room.start && room.game == 'spyfall'">
      <div>
        <h3>Rolle:</h3>
        <transition name="fade">
          <h4 v-if="hidden" class="rol">
            <span v-show="room.roles[user.uid].role != 'Spion'">
              {{ room.ort }}</span
            >
            <span>({{ room.roles[user.uid].role }})</span>
          </h4>
          <button v-else @click="showBtn" class="btn">Anzeigen</button>
        </transition>
      </div>
      <div>
        <h3>Orte:</h3>
        <div class="flex wrap">
          <div
            @click="checkOrt(place)"
            class="kiste"
            :key="place"
            v-for="place in places"
          >
            {{ place }}
          </div>
        </div>
      </div>
    </div>
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
import places from "@/assets/places.json";

export default {
  name: "Game",
  props: {
    id: [String, Number],
  },
  data() {
    return {
      games: games,
      hidden: false,
      changing: false,
      places: places,
    };
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
    checkOrt(ort) {
      if (this.room.roles[this.user.uid]) {
        this.$store.dispatch("games/" + this.room.game + "/checkOrt", {
          room: this.room,
          ort: ort,
        });
      }
    },
    showBtn() {
      this.hidden = true;
      setTimeout(() => {
        this.hidden = false;
      }, 3000);
    },
    stop() {
      this.$store.dispatch("games/stopGame", {
        room: this.room,
      });
    },
    accuse(user) {
      this.$store.dispatch("games/" + this.room.game + "/accusePlayer", {
        room: this.room,
        user: user,
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
    setSchaefchen() {
      let roles = {};

      let wolf = this.members[Math.floor(Math.random() * this.members.length)]
        .uid;

      for (let member of this.members) {
        roles[member.uid] = { role: "Schaf" };
        if (member.uid == wolf) {
          roles[member.uid] = { role: "Wolf" };
        }
      }
      return roles;
    },
    startGame() {
      this.$store.dispatch("games/" + this.room.game + "/start", {
        room: this.room,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.rol {
  margin: 1rem 0.5rem;
  padding: 0.8rem 1rem;
}
.btn {
  margin: 1rem 0.5rem;
}
.unselected {
  background: lightgrey;
}
.selected {
  background: rgb(88, 226, 88);
}
.mini {
  padding: 0.4rem 0.5rem;
  min-width: unset;
  font-size: 14px;
}
.wrap {
  flex-wrap: wrap;
}
.kiste {
  margin: 0.2rem;
  padding: 0.4rem;
  background: rgb(88, 226, 88);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #48abf0;
  }
}
</style>
