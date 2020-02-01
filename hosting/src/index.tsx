import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig.json' // Git管理外
import store from './store'
import App from './view/App'
import { FirebaseActions } from './store/firebase/FirebaseActions'
import { AppContext, AppContextProps } from './view/AppContext'
import { createAppRoutes } from './view/AppRoute'
import { UserActions } from './store/user/UserActions'
import { FirebaseUserRepository } from './data/firebase/FirebaseUserRepository'


firebase.initializeApp(firebaseConfig)

const firebaseActions = new FirebaseActions()
const userActions = new UserActions(new FirebaseUserRepository())
const appContextProps: AppContextProps = {
    appRoutes: createAppRoutes(),
    firebaseActions,
    userActions,
}

store.dispatch(firebaseActions.initializeFirebase())

ReactDOM.render(
    <Provider store={store}>
        <AppContext.Provider value={appContextProps}>
            <App/>
        </AppContext.Provider>
    </Provider>,
    document.getElementById('root')
)
