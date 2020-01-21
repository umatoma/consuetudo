import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import StoreState from '../store/StoreState'
import { FirebaseAuthState } from '../store/firebase/FirebaseStates'
import SignIn from './signIn/SignIn'
import Home from './home/Home'

function renderChildComponent(authState: FirebaseAuthState): ReactElement | null {
    switch (authState) {
        case FirebaseAuthState.Loading:
            return <div>Loading</div>
        case FirebaseAuthState.SignedIn:
            return <Home/>
        case FirebaseAuthState.SignedOut:
        case FirebaseAuthState.Error:
            return <SignIn/>
    }
}

const App: React.FC = props => {
    const authState = useSelector<StoreState, FirebaseAuthState>(state => state.firebase.authState)

    return renderChildComponent(authState)
}

export default App
