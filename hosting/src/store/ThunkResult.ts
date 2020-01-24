import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import StoreState from './StoreState'

type ThunkResult<R> = ThunkAction<R, StoreState, undefined, Action>

export default ThunkResult
