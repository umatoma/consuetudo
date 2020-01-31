import { useContext } from 'react'
import { AppContext } from '../AppContext'
import { HomeRoute, PostHabitRoute, SignInRoute, ViewHabitRoute } from '../AppRoute'

export function useHomeRoute(): HomeRoute {
    return useContext(AppContext).appRoutes.home
}

export function useSignInRoute(): SignInRoute {
    return useContext(AppContext).appRoutes.signIn
}

export function usePostHabitRoute(): PostHabitRoute {
    return useContext(AppContext).appRoutes.postHabit
}

export function useViewHabitRoute(): ViewHabitRoute {
    return useContext(AppContext).appRoutes.viewHabit
}
