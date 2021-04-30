import Vue from 'vue'
import Vuex from 'vuex'
import games from "./games/module.js";
import account from "./account/module.js";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    games: games,
    account: account
  }
})

export default store