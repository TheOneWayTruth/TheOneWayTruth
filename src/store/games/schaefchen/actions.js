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
        checkKill({ dispatch, rootState }, room) {
            let mehrzahl = Math.ceil(Object.keys(room.roles).length / 2);
            for (let role in room.roles) {
                if (room.roles[role].accuse.length >= mehrzahl) {
                    if (room.roles[role].role == "Spion") {
                        let message = rootState.games.members.find(x => x.uid == role).name + " wurde als Spion entlarft!";
                        dispatch("win", { room: room, message: message })
                    } else {
                        let message = rootState.games.members.find(x => x.uid == role).name + " wurde fälschlich als Spion beschuldigt!";
                        dispatch("win", { room: room, message: message })
                    }
                }
            }
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
                let message = user.name + " hat den falschen Ort(" + ort + ") gerraten! (Richtig wäre" + room.ort + ")";
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

            let wolf = rootState.games.members[Math.floor(Math.random() * rootState.games.members.length)]
                .uid;

            for (let member of rootState.games.members) {
                roles[member.uid] = { role: "Schaf" };
                if (member.uid == wolf) {
                    roles[member.uid] = { role: "Wolf" };
                }
            }

            dispatch("games/startGame", { room: room, roles: roles }, { root: true })
        },
    }

