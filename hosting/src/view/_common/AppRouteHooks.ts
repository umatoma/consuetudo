import { useContext } from 'react'
import { AppContext } from './AppContext'
import { AppRouteFactory, HomeRoute, PostHabitRoute, SignInRoute, ViewHabitRoute } from './AppRoute'

export function useAppRouteFactory(): AppRouteFactory {
    return useContext(AppContext).appRouteFactory
}

export function useHomeRoute(): HomeRoute {
    return useAppRouteFactory().home()
}

export function useSignInRoute(): SignInRoute {
    return useAppRouteFactory().signIn()
}

export function usePostHabitRoute(): PostHabitRoute {
    return useAppRouteFactory().postHabit()
}

export function useViewHabitRoute(): ViewHabitRoute {
    return useAppRouteFactory().viewHabit()
}
