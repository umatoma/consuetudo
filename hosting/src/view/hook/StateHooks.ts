import { useContext } from 'react'
import { useSelector } from 'react-redux'
import StoreState from '../../store/StoreState'
import { FirebaseState } from '../../store/firebase/FirebaseState'
import UserState from '../../store/user/UserState'
import { UserActions } from '../../store/user/UserActions'
import { AppContext } from '../AppContext'
import { Habit } from '../../domain/user/Habit'
import { FirebaseActions } from '../../store/firebase/FirebaseActions'


export function useFirebaseActions(): FirebaseActions {
    return useContext(AppContext).firebaseActions
}

export function useUserActions(): UserActions {
    return useContext(AppContext).userActions
}

export function useFirebaseSelector<T>(
    selector: (state: FirebaseState) => T
) {
    return useSelector<StoreState, T>(state => selector(state.firebase))
}

export function useUserSelector<T>(
    selector: (state: UserState) => T
) {
    return useSelector<StoreState, T>(state => selector(state.user))
}

export function useUserHabitList(): Habit[] {
    return useUserSelector<Habit[]>(state => {
        return state.habitList
    })
}

export function useUserHabit(habitId: string): Habit | undefined {
    return useUserHabitList().find(habit => habit.id === habitId)
}
