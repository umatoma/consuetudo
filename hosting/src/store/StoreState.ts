import UserState from './user/UserState'
import { FirebaseState } from './firebase/FirebaseState'

type StoreState = {
    user: UserState,
    firebase: FirebaseState
}

export default StoreState
