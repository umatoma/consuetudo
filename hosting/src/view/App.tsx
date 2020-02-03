import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { FirebaseAuthState } from '../store/firebase/FirebaseState'
import { useAuthStateEffect, useFirebaseSelector } from './hook/StateHooks'
import { useAppRoutes } from './hook/AppRouteHooks'


const App: React.FC = props => {
    const appRoutes = useAppRoutes()
    const authState = useFirebaseSelector<FirebaseAuthState>(state => state.authState)
    useAuthStateEffect(authState)

    if (authState == FirebaseAuthState.Loading) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <div className="app">
            <div className="app__container">
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
            </div>
            <div className="app__footer">
                <div className="app__footer-title">Consuetudo</div>
            </div>
        </div>
    )
}

export default App
