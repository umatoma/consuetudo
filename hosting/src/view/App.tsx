import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { FirebaseAuthState } from '../store/firebase/FirebaseState'
import { useAuthStateEffect, useFirebaseSelector } from './hooks/StateHooks'
import { useHomeRoute, usePostHabitRoute, useSignInRoute, useViewHabitRoute } from './hooks/AppRouteHooks'

const AppInner: React.FC = props => {
    const signInRoute = useSignInRoute()
    const homeRoute = useHomeRoute()
    const postHabitRoute = usePostHabitRoute()
    const viewHabitRoute = useViewHabitRoute()

    const authState = useFirebaseSelector<FirebaseAuthState>(state => state.authState)
    useAuthStateEffect(authState)

    if (authState == FirebaseAuthState.Loading) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <Switch>
            <Route {...signInRoute} />
            <Route {...homeRoute} />
            <Route {...postHabitRoute} />
            <Route {...viewHabitRoute} />
            <Route path="*">
                <div>Not Found</div>
            </Route>
        </Switch>
    )
}

const App: React.FC = props => {
    return (
        <BrowserRouter>
            <div className="app">
                <div className="app__container">
                    <AppInner/>
                </div>
                <div className="app__footer">
                    <div className="app__footer-title">Consuetudo</div>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App
