import React, { useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { FirebaseAuthState } from '../store/firebase/FirebaseState'
import { useFirebaseSelector, useUserActions } from './hook/StateHooks'
import { useAppRoutes, useHomeRoute, useSignInRoute } from './hook/AppRouteHooks'
import User from '../domain/user/User'


const App: React.FC = props => {
    const history = useHistory()
    const homeRoute = useHomeRoute()
    const signInRoute = useSignInRoute()
    const userActions = useUserActions()

    const appRoutes = useAppRoutes()
    const authState = useFirebaseSelector<FirebaseAuthState>(state => state.authState)
    const authUser = useFirebaseSelector(state => state.user)

    useEffect(() => {
        switch (authState) {
            case FirebaseAuthState.Error:
            case FirebaseAuthState.SignedOut:
                history.push(signInRoute.createPath())
                break;
            case FirebaseAuthState.SignedIn:
                const user = new User({ id: authUser!!.uid })
                userActions.setUser(user)
                userActions.loadUserState()
                    .then(() => history.push(homeRoute.createPath()))
                break;
            case FirebaseAuthState.Loading:
                break;
        }
    }, [authState])

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
