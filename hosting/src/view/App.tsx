import React, { useEffect } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { FirebaseAuthState } from '../store/firebase/FirebaseState'
import { useFirebaseSelector, useUserActions, useUserSelector } from './hook/StateHooks'
import { useAppRoutes } from './hook/AppRouteHooks'
import User from '../domain/user/User'
import AppFooter from './element/AppFooter'
import AppLoading from './element/AppLoading'


const AppContainer: React.FC = props => {
    return (
        <div className="app">
            <div className="app__container">
                {props.children}
            </div>
            <AppFooter/>
        </div>
    )
}

const App: React.FC = props => {
    const history = useHistory()
    const userActions = useUserActions()
    const appRoutes = useAppRoutes()

    const authState = useFirebaseSelector(state => state.authState)
    const authUser = useFirebaseSelector(state => state.user)
    const appUser = useUserSelector(state => state.user)

    useEffect(() => {
        if (authState === FirebaseAuthState.SignedIn) {
            userActions.setUser(new User({ id: authUser!!.uid }))
            history.push(appRoutes.home.createPath())
            userActions.loadUserState()
                .catch((e) => window.alert(e.message))
        }
    }, [authState])

    if (authState === FirebaseAuthState.Loading) {
        return (
            <AppContainer>
                <AppLoading/>
            </AppContainer>
        )
    }

    if (authState !== FirebaseAuthState.SignedIn) {
        return (
            <AppContainer>
                <Switch>
                    <Route {...appRoutes.signIn} />
                    <Route path="*">
                        <Redirect to={appRoutes.signIn.createPath()}/>
                    </Route>
                </Switch>
            </AppContainer>
        )
    }

    if (authState === FirebaseAuthState.SignedIn && !appUser) {
        return (
            <AppContainer>
                <AppLoading/>
            </AppContainer>
        )
    }

    return (
        <AppContainer>
            <Switch>
                <Route {...appRoutes.home} />
                <Route {...appRoutes.postHabit} />
                <Route {...appRoutes.viewHabit} />
                <Route {...appRoutes.putHabit} />
                <Route path="*">
                    <div>Not Found</div>
                </Route>
            </Switch>
        </AppContainer>
    )
}

export default App
