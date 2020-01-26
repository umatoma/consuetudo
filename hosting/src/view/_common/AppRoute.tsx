import { RouteComponentProps, RouteProps } from 'react-router-dom'
import Home from '../home/Home'
import SignIn from '../signIn/SignIn'
import PostHabit from '../postHabit/PostHabit'
import ViewHabit from '../viewHabit/ViewHabit'
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


export class AppRouteFactory {
    constructor(
        private _home: HomeRoute = new HomeRoute(),
        private _signIn: SignInRoute = new SignInRoute(),
        private _postHabit: PostHabitRoute = new PostHabitRoute(),
        private _viewHabit: ViewHabitRoute = new ViewHabitRoute()
    ) {}

    home(): HomeRoute { return this._home }
    signIn(): SignInRoute { return this._signIn }
    postHabit(): PostHabitRoute { return this._postHabit }
    viewHabit(): ViewHabitRoute { return this._viewHabit }
}
