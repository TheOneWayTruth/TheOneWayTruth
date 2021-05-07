<template>
  <div>
    <div>
      <h4>Players</h4>
      <p :key="member.uid" v-for="member in members">
        <span>{{ member.name }}</span>
        <span v-if="room.start">
          <span
            @click="accuse(member.uid)"
            v-if="member.uid != user.uid"
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
</template>

<script>
import places from "@/assets/places.json";
import { mapState } from "vuex";

export default {
  data() {
    return {
      places: places,
      hidden: false,
    };
  },
  computed: {
    ...mapState("games", ["room", "admin", "members"]),
    ...mapState("account", ["user"]),
  },
  methods: {
    showBtn() {
      this.hidden = true;
      setTimeout(() => {
        this.hidden = false;
      }, 3000);
    },
    checkOrt(ort) {
      if (this.room.roles[this.user.uid].role == "Spion") {
        this.$store.dispatch("games/" + this.room.game + "/checkOrt", {
          room: this.room,
          ort: ort,
        });
      }
    },
    accuse(user) {
      this.$store.dispatch("games/" + this.room.game + "/accusePlayer", {
        room: this.room,
        user: user,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
.wrap {
  flex-wrap: wrap;
}

.mini {
  margin: 0.5rem;
  padding: 0.4rem 0.5rem;
  min-width: unset;
  font-size: 14px;
}

.rol {
  margin: 1rem 0.5rem;
  padding: 0.8rem 1rem;
}
</style>