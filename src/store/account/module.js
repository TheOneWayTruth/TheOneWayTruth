import actions from './actions';

export default {
    namespaced: true,
    state: {
        user: {},
    },
    mutations: {
        setUserProfile(state, val) {
            if (Object.keys(val).length > 0) {
                let el = val.data()
                el.uid = val.id;
                state.user = el
            } else {
                state.user = val
            }

        },
    },
    actions
}
