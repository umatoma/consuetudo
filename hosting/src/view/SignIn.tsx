import * as React from 'react'
import { useDispatch } from 'react-redux'
import { signIn } from '../store/firebase/FirebaseActions'

const SignIn: React.FC = props => {
    const dispatch = useDispatch()

    return (
        <div>
            <h1>SignIn</h1>
            <button onClick={() => dispatch(signIn())}>SignIn</button>
        </div>
    )
}

export default SignIn
