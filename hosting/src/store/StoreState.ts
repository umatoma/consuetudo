import AppState from './app/AppState'
import { FirebaseState } from './firebase/FirebaseStates'

type StoreState = {
    app: AppState,
    firebase: FirebaseState
}

export default StoreState
