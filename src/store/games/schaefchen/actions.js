import * as fb from '@/firebase'

export default
    {
        accusePlayer({ dispatch, rootState }, { room: room, user: user }) {
            const player = fb.auth.currentUser
            if (room.roles[user].accuse == undefined) {
                room.roles[user].accuse = []
            }

            let index = room.roles[user].accuse.indexOf(player.uid);
            if (index == -1) {
                for (let p of rootState.games.members.filter(x => x.room.uid == room.uid)) {
                    let idx = room.roles[p.uid].accuse.indexOf(player.uid)
                    if (idx != -1) {
                        room.roles[p.uid].accuse.splice(idx, 1);
                    }
                }
                room.roles[user].accuse.push(player.uid);
            } else {
                room.roles[user].accuse.splice(index, 1);
            }

            return fb.roomCollection.doc(room.id).update(room, { merge: true }).then(() => {
                dispatch("checkKill", room)
            })
        },
        checkKill({ dispatch, rootState }, room) {
            let role = room.time == "night" ? "Wolf" : "Schaf"
            let player = Object.entries(room.roles).filter(x => x[1].role == role)
            let mehrzahl = Math.floor(player.length / 2);
            for (let role in room.roles) {
                if (room.roles[role].accuse.length >= mehrzahl) {
                    room.roles[role].dead = true;
                    dispatch("checkWin", { room: room })
                }
            }
        },
        checkWin({ dispatch, rootState }, { room }) {
            let schaf = Object.entries(room.roles).filter(x => x[1].role == "Schaf" && x[1].dead)
            let wolf = Object.entries(room.roles).filter(x => x[1].role == "Wolf" && x[1].dead)
            if (schaf.length <= 0) {
                room.win = "Schafe haben gewonnen"
                room.start = false;
            }
            if (wolf.length <= 0) {
                room.win = "Wölfe haben gewonnen"
                room.start = false;
            }
            dispatch("updateRoom", { room: room })
        },
        start({ dispatch, rootState }, { room }) {
            let roles = {};

            let anzahl = Math.floor(rootState.games.members.length / 3);
            anzahl = anzahl == 0 ? 1 : anzahl;

            let wolf = rootState.games.members[Math.floor(Math.random() * rootState.games.members.length)]
                .uid;

            for (let member of rootState.games.members) {
                if (member.uid == wolf) {
                    roles[member.uid] = { accuse: [], role: "Wolf", dead: false };
                } else {
                    roles[member.uid] = { accuse: [], role: "Schaf", dead: false };
                }
            }

            room.time = "night"
            room.ort = null;
            room.stamp = +new Date();

            dispatch("games/startGame", { room: room, roles: roles }, { root: true })
        },
        updateRoom({ rootState }, { room }) {
            fb.roomCollection.doc(room.id).set(room, { merge: true })
        },
        nextDay({ rootState, dispatch }, { room }) {
            for (let p of rootState.games.members.filter(x => x.room.uid == room.uid)) {
                room.roles[p.uid].accuse = []
            }

            room.stamp = +new Date();
            room.time = room.time == "night" ? "day" : "night"
            dispatch("updateRoom", { room: room })
        }
    }
