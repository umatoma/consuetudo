import { RouteComponentProps, RouteProps } from 'react-router-dom'
import Home from '../home/Home'
import SignIn from '../signIn/SignIn'
import PostHabit from '../postHabit/PostHabit'
import ViewHabit from '../viewHabit/ViewHabit'
import React from 'react'

interface AppRouteProps extends RouteProps {
    path: string
}

interface AppRoutePath<Params> {
    createEmbeddedPath(params: Params): string
}


class HomeRouteProps implements AppRouteProps {
    path = '/home'
    component = Home
    exact = true
}


export class SignInRouteProps implements AppRouteProps {
    path = '/signIn'
    component = SignIn
    exact = true
}


export class PostHabitRouteProps implements AppRouteProps {
    path = '/postHabit'
    component = PostHabit
    exact = true
}


export interface ViewHabitRouteParams {
    habitId: string
}
export class ViewHabitRouteProps implements AppRouteProps, AppRoutePath<ViewHabitRouteParams> {
    path = '/viewHabit/:habitId'
    render = (props: RouteComponentProps<ViewHabitRouteParams>) => (
        <ViewHabit habitId={props.match.params.habitId} />
    )
    exact = true

    createEmbeddedPath(params: ViewHabitRouteParams): string {
        return `/viewHabit/${params.habitId}`
    }
}


export class AppRoutePropsFactory {
    private static instance: AppRoutePropsFactory = new AppRoutePropsFactory()

    static getInstance(): AppRoutePropsFactory {
        return AppRoutePropsFactory.instance
    }

    private constructor(
        private _home: HomeRouteProps = new HomeRouteProps(),
        private _signIn: SignInRouteProps = new SignInRouteProps(),
        private _postHabit: PostHabitRouteProps = new PostHabitRouteProps(),
        private _viewHabit: ViewHabitRouteProps = new ViewHabitRouteProps()
    ) {}

    home(): HomeRouteProps { return this._home }
    signIn(): SignInRouteProps { return this._signIn }
    postHabit(): PostHabitRouteProps { return this._postHabit }
    viewHabit(): ViewHabitRouteProps { return this._viewHabit }
}
