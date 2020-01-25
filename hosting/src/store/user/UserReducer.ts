import { AnyAction, Reducer } from 'redux'
import UserState from './UserState'
import { UserActionType } from './UserActions'
import { Habit } from './UserEntities'

const initialState: UserState = {
    habitList: []
}

const userReducer: Reducer = (state: UserState = initialState, action: AnyAction) => {
    switch (action.type) {
        case UserActionType.SetHabitList:
            return { ...state, habitList: action.payload as Habit[] }
        default:
            return state
    }
}

export default userReducer
