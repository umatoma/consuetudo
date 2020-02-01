import UserRepository from './UserRepository'
import { Habit } from '../../domain/user/Habit'
import { HabitRecord } from '../../domain/user/HabitRecord'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import StoreState from '../StoreState'

export enum UserActionType {
    SetHabitList = 'UserActions/SetHabitList'
}

export class UserActions {
    constructor(
        private dispatch: ThunkDispatch<StoreState, any, Action>,
        private userRepository: UserRepository
    ) {
    }

    loadUserState(): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const userId = state.firebase.user!!.uid
            const habitList = await this.userRepository.getUserHabitList(userId)

            dispatch({ type: UserActionType.SetHabitList, payload: habitList })
        })
    }

    postUserHabit(name: string): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const userId = state.firebase.user!!.uid
            const habit = Habit.newInstance(name)
            await this.userRepository.postUserHabit(userId, habit)

            await this.loadUserState()
        })
    }

    putUserHabit(habit: Habit): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const userId = state.firebase.user!!.uid
            await this.userRepository.putUserHabit(userId, habit)

            await this.loadUserState()
        })
    }

    deleteUserHabit(habit: Habit): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const userId = state.firebase.user!!.uid
            await this.userRepository.deleteUserHabit(userId, habit)

            await this.loadUserState()
        })
    }

    pushUserHabitRecord(habitRecord: HabitRecord): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const habitList = state.user.habitList
            const habit = habitList.find(habit => habit.id === habitRecord.habitId)
            if (!habit) {
                throw new Error('Failed to pushUserHabitRecord()')
            }

            const userId = state.firebase.user!!.uid
            const newHabit = habit?.pushRecord(habitRecord)
            await this.userRepository.putUserHabit(userId, newHabit)

            await this.loadUserState()
        })
    }

    removeUserHabitRecord(habitRecord: HabitRecord): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const habitList = state.user.habitList
            const habit = habitList.find(habit => habit.id === habitRecord.habitId)
            if (!habit) {
                throw new Error('Failed to pushUserHabitRecord()')
            }

            const userId = state.firebase.user!!.uid
            const newHabit = habit?.removeRecord(habitRecord)
            await this.userRepository.putUserHabit(userId, newHabit)

            await this.loadUserState()
        })
    }

}

