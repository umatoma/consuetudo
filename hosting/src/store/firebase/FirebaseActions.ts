import { FirebaseAuthState } from './FirebaseStates'
import * as firebase from 'firebase/app'
import ThunkResult from '../ThunkResult'

export enum FirebaseActionType {
    SetAuthState
}

export const initializeFirebase = (): ThunkResult<void> => {
    return (dispatch, getState) => {
        dispatch({ type: FirebaseActionType.SetAuthState, authState: FirebaseAuthState.Loading })

        firebase
            .auth()
            .onAuthStateChanged(user => {
                if (user) {
                    dispatch({ type: FirebaseActionType.SetAuthState, authState: FirebaseAuthState.SignedIn, user: user })
                } else {
                    dispatch({ type: FirebaseActionType.SetAuthState, authState: FirebaseAuthState.SignedOut })
                }
            })
    }
}

export const signIn = (): ThunkResult<void> => {
    return () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider)
    }
}

export const signOut = (): ThunkResult<void> => {
    return () => {
        firebase.auth().signOut()
    }
}
