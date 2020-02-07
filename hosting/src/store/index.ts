import { applyMiddleware, combineReducers, createStore as _createStore } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import userReducer from './user/UserReducer'
import firebaseReducer from './firebase/FirebaseReducer'
import StoreState from './StoreState'
import ThunkStore from './ThunkStore'


export function createStore(
    useLogger: boolean = false
): ThunkStore<StoreState> {
    const reducer = combineReducers({
        user: userReducer,
        firebase: firebaseReducer
    })

    const middlewares = []
    if (useLogger) { middlewares.push(logger) }
    middlewares.push(thunk)
    const middleware = applyMiddleware(...middlewares)

    return _createStore(reducer, middleware)
}

export default createStore(true)
