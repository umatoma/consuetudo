import { FirebaseAuthState } from './FirebaseState'
import * as firebase from 'firebase/app'
import ThunkResult from '../ThunkResult'

export enum FirebaseActionType {
    SetAuthState = 'FirebaseAction/SetAuthState'
}

export class FirebaseActions {
    initializeFirebase(): ThunkResult<void> {
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

    signIn(): ThunkResult<void> {
        return (dispatch) => {
            const provider = new firebase.auth.GoogleAuthProvider()
            firebase
                .auth()
                .signInWithRedirect(provider)
                .catch(error => {
                    dispatch({ type: FirebaseActionType.SetAuthState, authState: FirebaseAuthState.Error, error: error })
                })
        }
    }

    signOut(): ThunkResult<void> {
        return (dispatch) => {
            firebase
                .auth()
                .signOut()
                .catch(error => {
                    dispatch({ type: FirebaseActionType.SetAuthState, authState: FirebaseAuthState.Error, error: error })
                })
        }
    }

}

