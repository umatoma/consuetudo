import UserRepository from './UserRepository'
import { Habit } from '../../domain/user/Habit'
import { HabitRecord } from '../../domain/user/HabitRecord'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import StoreState from '../StoreState'
import UserState from './UserState'
import User from '../../domain/user/User'

export interface UserAction extends Action<UserActionType> {
    payload: UserState
}

export enum UserActionType {
    ReplaceState = 'UserActionType/ReplaceState'
}

export class UserActions {
    constructor(
        private dispatch: ThunkDispatch<StoreState, any, UserAction>,
        private userRepository: UserRepository
    ) {
    }

    setUser(user: User): void {
        return this.dispatch((dispatch, getState) => {
            const state = getState()
            const userState = { ...state.user, user: user }

            dispatch({ type: UserActionType.ReplaceState, payload: userState })
        })
    }

    loadUserState(): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const userId = state.user.user!!.id
            const habitList = await this.userRepository.getUserHabitList(userId)

            const userState = { ...state.user, habitList: habitList }

            dispatch({ type: UserActionType.ReplaceState, payload: userState })
        })
    }

    postUserHabit(name: string): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const userId = state.user.user!!.id
            const habit = Habit.newInstance(name)
            await this.userRepository.postUserHabit(userId, habit)

            await this.loadUserState()
        })
    }

    putUserHabit(habit: Habit): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const userId = state.user.user!!.id
            await this.userRepository.putUserHabit(userId, habit)

            await this.loadUserState()
        })
    }

    deleteUserHabit(habit: Habit): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const userId = state.user.user!!.id
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

            const newHabit = habit?.pushRecord(habitRecord)
            await this.putUserHabit(newHabit)
        })
    }

    removeUserHabitRecord(habitRecord: HabitRecord): Promise<void> {
        return this.dispatch(async (dispatch, getState) => {
            const state = getState()

            const habitList = state.user.habitList
            const habit = habitList.find(habit => habit.id === habitRecord.habitId)
            if (!habit) {
                throw new Error('Failed to removeUserHabitRecord()')
            }

            const newHabit = habit?.removeRecord(habitRecord)
            await this.putUserHabit(newHabit)
        })
    }
}
