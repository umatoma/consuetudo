import { Reducer } from 'redux'
import { FirebaseAuthState, FirebaseState } from './FirebaseStates'
import { FirebaseActionType } from './FirebaseActions'

const initialState: FirebaseState = {
    authState: FirebaseAuthState.Loading,
    user: null
}

const firebaseReducer: Reducer = (state: FirebaseState = initialState, action) => {
    switch (action.type) {
        case FirebaseActionType.SetAuthState:
            return {
                ...state,
                authState: action.authState,
                user: action.user || null
            }
        default:
            return state
    }
}

export default firebaseReducer
