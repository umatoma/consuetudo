import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import StoreState from '../../store/StoreState'
import { FirebaseAuthState, FirebaseState } from '../../store/firebase/FirebaseState'
import { useHistory } from 'react-router-dom'
import { AppRoutePropsFactory } from './AppRoute'
import { useEffect } from 'react'
import { loadUserState } from '../../store/user/UserActions'
import UserState from '../../store/user/UserState'
import { Habit } from '../../store/user/UserEntities'

export function useThunkDispatch(): ThunkDispatch<any, any, Action> {
    return useDispatch()
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

export function useUserHabit(habitId: string): Habit | undefined {
    return useUserSelector<Habit | undefined>(state => {
        return state.habitList.find(habit => habit.id === habitId)
    })
}

export function useAuthStateEffect(authState: FirebaseAuthState) {
    const dispatch = useThunkDispatch()
    const history = useHistory()
    const routePropsFactory = AppRoutePropsFactory.getInstance()
    useEffect(() => {
        switch (authState) {
            case FirebaseAuthState.Loading:
                break;
            case FirebaseAuthState.Error:
            case FirebaseAuthState.SignedOut:
                history.push(routePropsFactory.signIn().path)
                break;
            case FirebaseAuthState.SignedIn:
                dispatch(loadUserState())
                    .then(() => history.push(routePropsFactory.home().path))
                break;
        }
    }, [authState])
}
