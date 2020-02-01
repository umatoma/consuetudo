import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { FirebaseAuthState } from '../store/firebase/FirebaseState'
import { useAuthStateEffect, useFirebaseSelector } from './hooks/StateHooks'
import { useAppRoutes } from './hooks/AppRouteHooks'

const AppInner: React.FC = props => {
    const appRoutes = useAppRoutes()
    const authState = useFirebaseSelector<FirebaseAuthState>(state => state.authState)
    useAuthStateEffect(authState)

    if (authState == FirebaseAuthState.Loading) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <Switch>
            <Route {...appRoutes.signIn} />
            <Route {...appRoutes.home} />
            <Route {...appRoutes.postHabit} />
            <Route {...appRoutes.viewHabit} />
            <Route {...appRoutes.putHabit} />
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
