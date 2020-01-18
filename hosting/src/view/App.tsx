import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import StoreState from '../store/StoreState'
import { FirebaseAuthState } from '../store/firebase/FirebaseStates'
import SignIn from './SignIn'
import Home from './Home'

function renderChildComponent(authState: FirebaseAuthState): ReactElement | null {
    switch (authState) {
        case FirebaseAuthState.Loading:
            return null
        case FirebaseAuthState.SignedIn:
            return <Home/>
        case FirebaseAuthState.SignedOut:
            return <SignIn/>
    }
}

const App: React.FC = props => {
    const authState = useSelector<StoreState, FirebaseAuthState>(state => state.firebase.authState)

    return (
        <div className="app">
            {renderChildComponent(authState)}
        </div>
    )
}

export default App
