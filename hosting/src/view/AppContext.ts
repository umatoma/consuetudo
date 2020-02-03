import React from 'react'
import { AppRoutes } from './routing/AppRoute'
import { UserActions } from '../store/user/UserActions'
import { FirebaseActions } from '../store/firebase/FirebaseActions'

export interface AppContextProps {
    appRoutes: AppRoutes,
    firebaseActions: FirebaseActions,
    userActions: UserActions
}

export const AppContext = React.createContext<AppContextProps>(null as any)
