import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCQVFOylsVyn6PPSKCXSpA8_772a9GWTgg",
    authDomain: "weraapp-6a5f4.firebaseapp.com",
    databaseURL: "https://weraapp-6a5f4.firebaseio.com",
    projectId: "weraapp-6a5f4",
    storageBucket: "weraapp-6a5f4.appspot.com",
    messagingSenderId: "263838255411",
    appId: "1:263838255411:web:5e778f09dfa05078d35646",
    measurementId: "G-ZMMDY3GF2T"
};

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()

auth.languageCode = "de"

const gprovider = new firebase.auth.GoogleAuthProvider();
const fprovider = new firebase.auth.FacebookAuthProvider();
const usersCollection = db.collection('users')
const roomCollection = db.collection('rooms')

export {
    db,
    auth,
    usersCollection,
    roomCollection,
    gprovider,
    fprovider
}

auth
    .getRedirectResult()
    .then((result) => {
        if (result.user != null) {
            if (result.additionalUserInfo.isNewUser) {
                let info = result.additionalUserInfo.profile
                info.provider = [result.user.providerData[0].providerId];
                if (typeof info.picture != "string") {
                    info.image = info.picture.data.url
                } else {
                    info.image = info.picture
                }
                usersCollection.doc(result.user.uid).set(info)
            }
        }
    })
