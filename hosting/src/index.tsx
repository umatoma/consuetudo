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
import { AppContext, AppContextProps } from './view/_common/AppContext'
import { AppRouteFactory } from './view/_common/AppRoute'


firebase.initializeApp(firebaseConfig)

store.dispatch(initializeFirebase())

const appContextProps: AppContextProps = {
    appRouteFactory: new AppRouteFactory()
}

ReactDOM.render(
    <Provider store={store}>
        <AppContext.Provider value={appContextProps}>
            <App/>
        </AppContext.Provider>
    </Provider>,
    document.getElementById('root')
)
