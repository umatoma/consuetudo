import ThunkResult from '../ThunkResult'
import { FirebaseUserRepository, UserRepository } from './UserRepository'
import { Habit } from './UserEntities'

const userRepository: UserRepository = new FirebaseUserRepository()

export enum UserActionType {
    SetHabitList = 'UserActions/SetHabitList'
}

export const loadUserState = (): ThunkResult<void> => {
    return async (dispatch, getState) => {
        const state = getState()

        const userId = state.firebase.user!!.uid
        const habitList = await userRepository.getUserHabitList(userId)

        dispatch({ type: UserActionType.SetHabitList, payload: habitList })
    }
}

export const postUserHabit = (): ThunkResult<void> => {
    return async (dispatch, getState) => {
        const state = getState()

        const userId = state.firebase.user!!.uid
        const habit = Habit.newEntity('水を飲む')
        await userRepository.postUserHabit(userId, habit)

        dispatch(loadUserState())
    }
}