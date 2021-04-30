import actions from './actions';

export default {
    namespaced: true,
    state: {
        rooms: [],
        room: {},
        admin: false,
    },
    mutations: {
        setRooms(state, val) {
            state.rooms = val
        },
        setRoom(state, val) {
            state.room = val
        },
        setAdmin(state, val) {
            state.admin = val;
        },
    },
    actions,
}
