import ThunkResult from '../ThunkResult'
import UserRepository from './UserRepository'
import { Habit } from '../../domain/user/Habit'
import { HabitRecord } from '../../domain/user/HabitRecord'

export enum UserActionType {
    SetHabitList = 'UserActions/SetHabitList'
}

export class UserActions {
    constructor(private userRepository: UserRepository) {
    }

    loadUserState(): ThunkResult<Promise<void>> {
        return async (dispatch, getState) => {
            const state = getState()

            const userId = state.firebase.user!!.uid
            const habitList = await this.userRepository.getUserHabitList(userId)

            dispatch({ type: UserActionType.SetHabitList, payload: habitList })
        }
    }

    postUserHabit(name: string): ThunkResult<Promise<void>> {
        return async (dispatch, getState) => {
            const state = getState()

            const userId = state.firebase.user!!.uid
            const habit = Habit.newInstance(name)
            await this.userRepository.postUserHabit(userId, habit)

            await dispatch(this.loadUserState())
        }
    }

    deleteUserHabit(habit: Habit): ThunkResult<Promise<void>> {
        return async (dispatch, getState) => {
            const state = getState()

            const userId = state.firebase.user!!.uid
            await this.userRepository.deleteUserHabit(userId, habit)

            await dispatch(this.loadUserState())
        }
    }

    pushUserHabitRecord(habitRecord: HabitRecord): ThunkResult<Promise<void>> {
        return async (dispatch, getState) => {
            const state = getState()

            const habitList = state.user.habitList
            const habit = habitList.find(habit => habit.id === habitRecord.habitId)
            if (!habit) {
                throw new Error('Failed to pushUserHabitRecord()')
            }

            const userId = state.firebase.user!!.uid
            const newHabit = habit?.pushRecord(habitRecord)
            await this.userRepository.putUserHabit(userId, newHabit)

            await dispatch(this.loadUserState())
        }
    }

    removeUserHabitRecord(habitRecord: HabitRecord): ThunkResult<Promise<void>> {
        return async (dispatch, getState) => {
            const state = getState()

            const habitList = state.user.habitList
            const habit = habitList.find(habit => habit.id === habitRecord.habitId)
            if (!habit) {
                throw new Error('Failed to pushUserHabitRecord()')
            }

            const userId = state.firebase.user!!.uid
            const newHabit = habit?.removeRecord(habitRecord)
            await this.userRepository.putUserHabit(userId, newHabit)

            await dispatch(this.loadUserState())
        }
    }

}

