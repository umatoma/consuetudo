import { RouteComponentProps, RouteProps } from 'react-router-dom'
import Home from './pages/home/Home'
import SignIn from './pages/signIn/SignIn'
import PostHabit from './pages/postHabit/PostHabit'
import ViewHabit from './pages/viewHabit/ViewHabit'
import React from 'react'


interface AppRoute<Params = void> extends RouteProps {
    path: string
    render: (props: RouteComponentProps<any>) => React.ReactNode
    createPath(params: Params): string
}


export class HomeRoute implements AppRoute {
    path = '/home'
    exact = true
    render = () => <Home/>
    createPath(params: void): string { return this.path }
}


export class SignInRoute implements AppRoute {
    path = '/signIn'
    exact = true
    render = () => <SignIn/>
    createPath(params: void): string { return this.path }
}


export class PostHabitRoute implements AppRoute {
    path = '/postHabit'
    exact = true
    render = () => <PostHabit/>
    createPath(params: void): string { return this.path }
}


export interface ViewHabitRouteParams {
    habitId: string
}
export class ViewHabitRoute implements AppRoute<ViewHabitRouteParams> {
    path = '/viewHabit/:habitId'
    exact = true
    render = (props: RouteComponentProps<ViewHabitRouteParams>) => (
        <ViewHabit habitId={props.match.params.habitId} />
    )
    createPath(params: ViewHabitRouteParams): string { return `/viewHabit/${params.habitId}` }
}
