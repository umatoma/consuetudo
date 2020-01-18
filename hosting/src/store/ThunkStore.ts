import { Action, AnyAction, Store } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

export default interface ThunkStore<S = any, A extends Action = AnyAction> extends Store<S, A> {
    dispatch: ThunkDispatch<any, any, Action>
}
