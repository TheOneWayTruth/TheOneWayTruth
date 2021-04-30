import * as fb from '../../firebase'
import router from '../../router/index'

export default
    {
        deleteAccount({ commit }) {
            const user = fb.auth.currentUser

            return fb.usersCollection.doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    fb.roomCollection.where("host.uid", "==", user.uid).get().then((rooms) => {
                        var promises = [];
                        rooms.forEach(room => {
                            promises.push(fb.roomCollection.doc(room.id).delete())
                        });
                        Promise.all(promises).then(() => {
                            doc.ref.delete().then(() => {
                                user.delete()
                                commit("setUserProfile", {});
                                router.push('/login')
                            })
                        })
                    })
                }
            })
        },
        login({ dispatch }, form) {
            return fb.auth.signInWithEmailAndPassword(form.email, form.password).then((user) => {
                dispatch('updateUser', user.user)
            })
        },
        facebookLogin({ dispatch }) {
            return fb.auth.signInWithRedirect(fb.fprovider).then((user) => {
                dispatch('updateUser', user)
            })
        },
        googleLogin({ dispatch }) {
            return fb.auth.signInWithRedirect(fb.gprovider).then((user) => {
                dispatch('updateUser', user)
            })
        },
        updateUser({ commit }, user) {
            return fb.usersCollection.doc(user.uid).get().then(userProfile => {
                commit('setUserProfile', userProfile)
                if (router.currentRoute.path === '/login') {
                    router.push('/')
                }
            })

        },
        signup({ dispatch }, form) {
            return fb.auth.createUserWithEmailAndPassword(form.email, form.password).then(user => {
                fb.usersCollection.doc(user.user.uid).set({
                    name: form.name,
                    username: form.username
                }).then(() => {
                    dispatch('updateUser', user.user)
                })

            })
        },
        logout({ commit }) {
            return fb.auth.signOut().then(() => {
                commit('setUserProfile', {})
                router.push('/login')
            })
        },
    }