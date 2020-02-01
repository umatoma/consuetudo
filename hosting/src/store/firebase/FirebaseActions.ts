import { FirebaseAuthState } from './FirebaseState'
import * as firebase from 'firebase/app'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'

export enum FirebaseActionType {
    SetAuthState = 'FirebaseAction/SetAuthState'
}

export class FirebaseActions {

    constructor(private dispatch: ThunkDispatch<any, any, Action>) {
    }

    initializeFirebase(): void {
        return this.dispatch((dispatch, getState) => {
            dispatch({ type: FirebaseActionType.SetAuthState, authState: FirebaseAuthState.Loading })

            firebase
                .auth()
                .onAuthStateChanged(user => {
                    if (user) {
                        dispatch({
                            type: FirebaseActionType.SetAuthState,
                            authState: FirebaseAuthState.SignedIn,
                            user: user
                        })
                    } else {
                        dispatch({ type: FirebaseActionType.SetAuthState, authState: FirebaseAuthState.SignedOut })
                    }
                })
        })
    }

    signIn(): void {
        return this.dispatch((dispatch) => {
            const provider = new firebase.auth.GoogleAuthProvider()
            firebase
                .auth()
                .signInWithRedirect(provider)
                .catch(error => {
                    dispatch({
                        type: FirebaseActionType.SetAuthState,
                        authState: FirebaseAuthState.Error,
                        error: error
                    })
                })
        })
    }

    signOut(): void {
        return this.dispatch((dispatch) => {
            firebase
                .auth()
                .signOut()
                .catch(error => {
                    dispatch({
                        type: FirebaseActionType.SetAuthState,
                        authState: FirebaseAuthState.Error,
                        error: error
                    })
                })
        })
    }
}
