import React from 'react'
import { HomeRoute, PostHabitRoute, SignInRoute, ViewHabitRoute } from './AppRoute'
import { UserActions } from '../store/user/UserActions'
import { FirebaseActions } from '../store/firebase/FirebaseActions'

export interface AppContextProps {
    appRoutes: {
        home: HomeRoute,
        signIn: SignInRoute,
        postHabit: PostHabitRoute,
        viewHabit: ViewHabitRoute,
    },
    firebaseActions: FirebaseActions,
    userActions: UserActions
}

export const AppContext = React.createContext<AppContextProps>(null as any)
