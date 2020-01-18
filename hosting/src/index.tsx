import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig.json' // Git管理外
import store from './store'
import App from './view/App'
import { initializeFirebase } from './store/firebase/FirebaseActions'


firebase.initializeApp(firebaseConfig)

store.dispatch(initializeFirebase())

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
)
