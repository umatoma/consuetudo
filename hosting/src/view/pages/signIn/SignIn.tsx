import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useFirebaseActions } from '../../hooks/StateHooks'

const SignIn: React.FC = props => {
    const dispatch = useDispatch()
    const firebaseActions = useFirebaseActions()

    return (
        <div>
            <div className="image image--sign-in-app"/>
            <h1 className="text text--sign-in-title">Consuetudo</h1>
            <button
                className="button button--sign-in-google"
                onClick={() => dispatch(firebaseActions.signIn())}
            >
                <span className="button__label">
                    Sign in with Google
                </span>
            </button>
        </div>
    )
}

export default SignIn
