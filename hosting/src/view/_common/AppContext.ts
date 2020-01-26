import React from 'react'
import { AppRouteFactory } from './AppRoute'

export interface AppContextProps {
    appRouteFactory: AppRouteFactory
}

export const AppContext = React.createContext<AppContextProps>(null as any)
