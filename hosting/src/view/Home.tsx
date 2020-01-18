import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import firebase from 'firebase'
import { signOut } from '../store/firebase/FirebaseActions'
import StoreState from '../store/StoreState'

const Home: React.FC = props => {
    const user = useSelector<StoreState, firebase.User>(state => state.firebase.user!!)
    const dispatch = useDispatch()

    return (
        <div>
            <h1>Home</h1>
            <div>{user.displayName}</div>
            <div>{user.email}</div>
            <div>{user.photoURL}</div>
            <div>{user.providerId}</div>
            <div>{user.uid}</div>
            <button onClick={() => dispatch(signOut())}>SignOut</button>
        </div>
    )
}

export default Home
