<template>
  <div class="flexy">
    <div>
      <h4>Players</h4>
      <p :key="member.uid" v-for="member in members">
        <span>{{ member.name }}</span>
        <span v-show="room.roles[member.uid].dead">💀</span>
        <span v-if="room.start">
          <span
            @click="accuse(member.uid)"
            v-if="
              room.roles[user.uid].role == 'Wolf' &&
              room.time == 'night' &&
              member.uid != user.uid &&
              !room.roles[member.uid].dead
            "
            class="btn mini danger"
          >
            <span v-if="room.roles[member.uid].accuse.indexOf(user.uid) == -1"
              >töten</span
            >
            <span v-else>zurückziehen</span>
          </span>
          <span
            @click="accuse(member.uid)"
            v-if="
              room.time == 'day' &&
              member.uid != user.uid &&
              !room.roles[member.uid].dead
            "
            class="btn mini danger"
          >
            <span v-if="room.roles[member.uid].accuse.indexOf(user.uid) == -1"
              >abstimmen</span
            >
            <span v-else>zurückziehen</span>
          </span>
          <span v-show="room.roles[member.uid].accuse.length > 0">{{
            room.roles[member.uid].accuse.length
          }}</span>
        </span>
      </p>
    </div>

    <div class="eck">
      <span class="rol" v-if="room.time == 'day'">Tag ☀️</span>
      <span class="rol" v-else>Nacht 🌙</span>
      <span v-if="counter" class="rol">{{ counter | MinuteSek }}</span>
    </div>
    <h3>Rolle:</h3>

    <h4 v-if="hidden" class="rol">
      <span>{{ room.roles[user.uid].role }}</span>
    </h4>
    <button v-else @click="showBtn" class="btn">Anzeigen</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      hidden: false,
      time: null,
      counter: 60,
    };
  },
  computed: {
    ...mapState("games", ["room", "admin", "members"]),
    ...mapState("account", ["user"]),
  },
  filters: {
    MinuteSek(seconds) {
      const format = (val) => `0${Math.floor(val)}`.slice(-2);
      const minutes = (seconds % 3600) / 60;

      return [minutes, seconds % 60].map(format).join(":");
    },
  },
  mounted() {
    this.update();
    setInterval(() => this.update(), 1000);
  },
  methods: {
    accuse(user) {
      this.$store.dispatch("games/" + this.room.game + "/accusePlayer", {
        room: this.room,
        user: user,
      });
    },
    update() {
      if (!this.room.start) {
        return;
      }
      this.time = Math.round(((this.room.stamp - +new Date()) / 1000) * -1);
      this.counter = this.room.timer - this.time;
      if (this.user.uid == this.room.host.uid) {
        if (this.counter <= 0) {
          this.$store.dispatch("games/schaefchen/nextDay", {
            room: this.room,
          });
        }
      }
    },
    showBtn() {
      this.hidden = true;
      setTimeout(() => {
        this.hidden = false;
      }, 3000);
    },
  },
};
</script>


<style lang="scss" scoped>
.eck {
  position: fixed;
  top: 120px;
  right: 50px;
}

.rol {
  margin: 1rem 0.5rem;
  padding: 0.8rem 1rem;
  font-size: 20px;
}

.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-leave-active {
  transition: opacity 0s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>