import { Action, Reducer } from 'redux'
import AppState from './AppState'

const initialState = {
    count: 0
}

const appStateReducer: Reducer = (state: AppState = initialState, action: Action) => {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 }
        case 'decrement':
            return { count: state.count - 1 }
        default:
            return state
    }
}

export default appStateReducer
