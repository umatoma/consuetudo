import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import StoreState from '../store/StoreState'
import { FirebaseAuthState } from '../store/firebase/FirebaseState'
import SignIn from './signIn/SignIn'
import { loadUserState } from '../store/user/UserActionType'
import Home from './home/Home'

function useAuthStateEffect(authState: FirebaseAuthState) {
    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(() => {
        switch (authState) {
            case FirebaseAuthState.Loading:
                break;
            case FirebaseAuthState.Error:
            case FirebaseAuthState.SignedOut:
                history.push('/signIn')
                break;
            case FirebaseAuthState.SignedIn:
                dispatch(loadUserState())
                history.push('/home')
                break;
        }
    }, [authState])
}

const AppSwitch: React.FC = props => {
    const authState = useSelector<StoreState, FirebaseAuthState>(state => state.firebase.authState)
    useAuthStateEffect(authState)

    if (authState == FirebaseAuthState.Loading) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <Switch>
            <Route path="/signIn" exact>
                <SignIn/>
            </Route>
            <Route path="/home" exact>
                <Home/>
            </Route>
            <Route path="*">
                <div>Not Found</div>
            </Route>
        </Switch>
    )
}

const App: React.FC = props => {
    return (
        <BrowserRouter>
            <AppSwitch/>
        </BrowserRouter>
    )
}

export default App
