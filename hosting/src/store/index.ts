import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import userReducer from './user/UserReducer'
import firebaseReducer from './firebase/FirebaseReducer'
import StoreState from './StoreState'
import ThunkStore from './ThunkStore'


const reducer = combineReducers({
    user: userReducer,
    firebase: firebaseReducer
})
const middleware = applyMiddleware(
    logger,
    thunk
)
const store: ThunkStore<StoreState> = createStore(reducer, middleware)

export default store
