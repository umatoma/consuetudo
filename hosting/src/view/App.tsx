import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { FirebaseAuthState } from '../store/firebase/FirebaseState'
import { useAuthStateEffect, useFirebaseSelector } from './_common/Hooks'
import { AppRoutePropsFactory } from './_common/AppRoute'

const AppInner: React.FC = props => {
    const authState = useFirebaseSelector<FirebaseAuthState>(state => state.authState)
    useAuthStateEffect(authState)

    if (authState == FirebaseAuthState.Loading) {
        return (
            <div>Loading</div>
        )
    }

    const routePropsFactory = AppRoutePropsFactory.getInstance()
    return (
        <Switch>
            <Route {...routePropsFactory.signIn()} />
            <Route {...routePropsFactory.home()} />
            <Route {...routePropsFactory.postHabit()} />
            <Route {...routePropsFactory.viewHabit()} />
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
