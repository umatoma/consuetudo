import ThunkResult from '../ThunkResult'
import { FirebaseUserRepository, UserRepository } from './UserRepository'
import { Habit, HabitRecord } from './UserEntities'

const userRepository: UserRepository = new FirebaseUserRepository()

export enum UserActionType {
    SetHabitList = 'UserActions/SetHabitList'
}

export const loadUserState = (): ThunkResult<Promise<void>> => {
    return async (dispatch, getState) => {
        const state = getState()

        const userId = state.firebase.user!!.uid
        const habitList = await userRepository.getUserHabitList(userId)

        dispatch({ type: UserActionType.SetHabitList, payload: habitList })
    }
}

export const postUserHabit = (name: string): ThunkResult<Promise<void>> => {
    return async (dispatch, getState) => {
        const state = getState()

        const userId = state.firebase.user!!.uid
        const habit = Habit.newEntity(name)
        await userRepository.postUserHabit(userId, habit)

        await dispatch(loadUserState())
    }
}

export const deleteUserHabit = (habit: Habit): ThunkResult<Promise<void>> => {
    return async (dispatch, getState) => {
        const state = getState()

        const userId = state.firebase.user!!.uid
        await userRepository.deleteUserHabit(userId, habit)

        await dispatch(loadUserState())
    }
}

export const pushUserHabitRecord = (habitRecord: HabitRecord): ThunkResult<Promise<void>> => {
    return async (dispatch, getState) => {
        const state = getState()

        const habitList = state.user.habitList
        const newHabitList = habitList.map(habit => {
            if (habit.id === habitRecord.habitId) {
                return habit.pushRecord(habitRecord)
            }
            return habit
        })

        // TODO: DB更新 -> データ再読み込み

        dispatch({ type: UserActionType.SetHabitList, payload: newHabitList })
    }
}

export const removeUserHabitRecord = (habitRecord: HabitRecord): ThunkResult<Promise<void>> => {
    return async (dispatch, getState) => {
        const state = getState()

        const habitList = state.user.habitList
        const newHabitList = habitList.map(habit => {
            if (habit.id === habitRecord.habitId) {
                return habit.removeRecord(habitRecord)
            }
            return habit
        })

        // TODO: DB更新 -> データ再読み込み

        dispatch({ type: UserActionType.SetHabitList, payload: newHabitList })
    }
}
