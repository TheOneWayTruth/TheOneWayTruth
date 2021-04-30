import * as fb from '../../firebase'
import router from '../../router/index'


export default
    {
        checkAdmin({ commit }, room) {
            let user = fb.auth.currentUser;
            commit("setAdmin", room.host.uid == user.uid);
        },
        createRoom({ dispatch }, { room: room, user: user }) {
            fb.roomCollection.doc(room.id).set(room).then(() => {
                dispatch("joinRoom", { room: room, user: user })
            })
        },
        joinRoom({ dispatch }, { room: room, user: user }) {

            fb.usersCollection.doc(user.uid).set({ room: room }, { merge: true }).then(() => {
                dispatch("account/updateUser", user, { root: true })
                router.push({ name: 'GameId', params: { id: room.id } })
            })
        },
        leaveRoom({ dispatch }, { room: room, user: user }) {
            fb.usersCollection.doc(user.uid).set({ room: null }, { merge: true }).then(() => {
                dispatch("account/updateUser", user, { root: true })
                router.push("/")
            })
        },
        deleteRoom({ dispatch, rootState }, { room: room }) {
            fb.usersCollection.where("room.id", "==", room.id).get().then((users) => {
                var promises = [];
                users.forEach(user => {
                    promises.push(fb.usersCollection.doc(user.id).set({ room: null }, { merge: true }))
                });
                Promise.all(promises).then(() =>
                    fb.roomCollection.doc(room.id).delete().then(() => {
                        dispatch("account/updateUser", rootState.account.user, { root: true })
                        router.push("/")
                    })
                );
            })
        }
    }