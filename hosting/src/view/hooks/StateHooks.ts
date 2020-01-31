import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import StoreState from '../../store/StoreState'
import { FirebaseAuthState, FirebaseState } from '../../store/firebase/FirebaseState'
import { useHistory } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import UserState from '../../store/user/UserState'
import { useHomeRoute, useSignInRoute } from './AppRouteHooks'
import { UserActions } from '../../store/user/UserActions'
import { AppContext } from '../AppContext'
import { Habit } from '../../domain/user/Habit'
import { FirebaseActions } from '../../store/firebase/FirebaseActions'

export function useThunkDispatch(): ThunkDispatch<any, any, Action> {
    return useDispatch()
}

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

export function useAuthStateEffect(authState: FirebaseAuthState) {
    const dispatch = useThunkDispatch()
    const history = useHistory()
    const homeRoute = useHomeRoute()
    const signInRoute = useSignInRoute()
    const userActions = useUserActions()

    useEffect(() => {
        switch (authState) {
            case FirebaseAuthState.Loading:
                break;
            case FirebaseAuthState.Error:
            case FirebaseAuthState.SignedOut:
                history.push(signInRoute.createPath())
                break;
            case FirebaseAuthState.SignedIn:
                dispatch(userActions.loadUserState())
                    .then(() => history.push(homeRoute.createPath()))
                break;
        }
    }, [authState])
}
