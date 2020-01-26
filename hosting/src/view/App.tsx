import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { FirebaseAuthState } from '../store/firebase/FirebaseState'
import { useAuthStateEffect, useFirebaseSelector } from './_common/Hooks'
import { useAppRouteFactory } from './_common/AppRouteHooks'

const AppInner: React.FC = props => {
    const appRouteFactory = useAppRouteFactory()
    const authState = useFirebaseSelector<FirebaseAuthState>(state => state.authState)
    useAuthStateEffect(authState)

    if (authState == FirebaseAuthState.Loading) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <Switch>
            <Route {...appRouteFactory.signIn()} />
            <Route {...appRouteFactory.home()} />
            <Route {...appRouteFactory.postHabit()} />
            <Route {...appRouteFactory.viewHabit()} />
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
