
import * as fb from '@/firebase'
import places from "@/assets/places.json";


export default
    {
        accusePlayer({ dispatch }, { room: room, user: user }) {
            const player = fb.auth.currentUser
            if (room.roles[user].accuse == undefined) {
                room.roles[user].accuse = []
            }
            let index = room.roles[user].accuse.indexOf(player.uid);
            if (index == -1) {
                room.roles[user].accuse.push(player.uid);
            } else {
                room.roles[user].accuse.splice(index, 1);
            }
            return fb.roomCollection.doc(room.id).update(room, { merge: true }).then(() => {
                dispatch("checkKill", room)
            })
        },
        checkKill({ dispatch }, room) {
            let mehrzahl = Math.ceil(Object.keys(room.roles).length);
            for (let role in room.roles) {
                if (room.roles[role].accuse.length >= mehrzahl) {
                    dispatch("kill", { room: room, user: role })
                }
            }
        },
        kill({ dispatch }, { room, user }) {
            room.roles[user].dead = true;
            return fb.roomCollection.doc(room.id).update(room, { merge: true }).then(() => {
                dispatch("checkWin", { room: room })
            })
        },
        checkWin({ dispatch, rootState }, { room }) {
            for (let player in room.roles) {
                if (room.roles[player].role == "Spion") {
                    if (room.roles[player].dead) {
                        let message = rootState.games.members.find(x => x.uid == player).name + " wurde als Spion entlarft!";
                        dispatch("win", { room: room, message: message })
                    }
                }
            }
        },
        checkOrt({ dispatch, rootState }, { room: room, ort: ort }) {
            let uid = fb.auth.currentUser.uid
            let user = rootState.games.members.find(x => x.uid == uid)

            if (room.ort == ort) {
                let message = user.name + " hat den Ort " + room.ort + " erraten!";
                dispatch("win", { room: room, message: message })
            } else {
                let message = user.name + " hat den falschen Ort gerraten! (" + room.ort + ")";
                dispatch("win", { room: room, message: message })
            }
        },
        win({ rootState }, { message: message, room: room }) {
            room.start = false;
            room.win = message
            return fb.roomCollection.doc(room.id).update(room, { merge: true });
        },
        start({ dispatch, rootState }, { room }) {
            let roles = {};
            let place = places[Math.floor(Math.random() * places.length)];
            let spy = rootState.games.members[Math.floor(Math.random() * rootState.games.members.length)]
                .uid;

            room.ort = place;
            for (let member of rootState.games.members) {
                roles[member.uid] = { accuse: [] };
                if (member.uid == spy) {
                    roles[member.uid] = { role: "Spion", accuse: [] };
                }
            }

            dispatch("games/startGame", { room: room, roles: roles }, { root: true })
        },
    }