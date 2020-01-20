import * as React from 'react'
import { useDispatch } from 'react-redux'
import { signIn } from '../store/firebase/FirebaseActions'

const SignIn: React.FC = props => {
    const dispatch = useDispatch()

    return (
        <div>
            <div className="image image--sign-in-app"/>
            <h1 className="text text--sign-in-title">Consuetudo</h1>
            <button
                className="button button--sign-in-google"
                onClick={() => dispatch(signIn())}
            >
                <span className="button__label">
                    Sign in with Google
                </span>
            </button>
        </div>
    )
}

export default SignIn
