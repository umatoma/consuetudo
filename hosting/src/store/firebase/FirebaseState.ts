import firebase from 'firebase'

export type FirebaseState = {
    authState: FirebaseAuthState,
    user: firebase.User | null
}

export enum FirebaseAuthState {
    Loading= 'Loading',
    SignedIn = 'SignedIn',
    SignedOut = 'SignedOut',
    Error = 'Error'
}
