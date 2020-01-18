import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import appStateReducer from './app/AppStateReducer'
import firebaseReducer from './firebase/FirebaseReducer'
import StoreState from './StoreState'
import ThunkStore from './ThunkStore'


const reducer = combineReducers({
    app: appStateReducer,
    firebase: firebaseReducer
})
const middleware = applyMiddleware(thunk)
const store: ThunkStore<StoreState> = createStore(reducer, middleware)

export default store
