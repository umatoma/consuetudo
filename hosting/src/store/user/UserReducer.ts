import { Reducer } from 'redux'
import UserState from './UserState'
import { UserAction, UserActionType } from './UserActions'

const initialState: UserState = {
    user: null,
    habitList: []
}

const userReducer: Reducer<UserState, UserAction> = (state = initialState, action) => {
    if (action.type === UserActionType.ReplaceState) {
        return action.payload
    } else {
        return state
    }
}

export default userReducer
