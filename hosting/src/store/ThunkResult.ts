import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'

type ThunkResult<R> = ThunkAction<R, any, undefined, Action>

export default ThunkResult
