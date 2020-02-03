import { AppContext, AppContextProps } from '../view/AppContext'
import { Provider } from 'react-redux'
import React, { ReactElement } from 'react'
import { createStore, Reducer, Store } from 'redux'
import { mount } from 'enzyme'
import { AppRoutes, createAppRoutes } from '../view/routing/AppRoute'
import { FirebaseActions } from '../store/firebase/FirebaseActions'
import { UserActions } from '../store/user/UserActions'
import { Router } from 'react-router-dom'
import StoreState from '../store/StoreState'
import { FirebaseState } from '../store/firebase/FirebaseState'
import UserState from '../store/user/UserState'
import { createMemoryHistory, History } from 'history'

export interface TestWrapperProps {
    store: Store,
    appContextProps: AppContextProps,
    history: History
}

export const TestWrapper: React.FC<TestWrapperProps> = props => {
    return (
        <Provider store={props.store}>
            <AppContext.Provider value={props.appContextProps}>
                <Router history={props.history}>
                    {props.children}
                </Router>
            </AppContext.Provider>
        </Provider>
    )
}

export function createTestStore(
    preloadedState: {
        firebase?: FirebaseState,
        user?: UserState,
    } = {}
): Store {
    const reducer: Reducer = (state => state)
    return createStore(reducer, {
        firebase: preloadedState.firebase || null as any,
        user: preloadedState.user || null as any,
    } as StoreState)
}

export function mountWithTestWrapper(
    node: ReactElement,
    options: {
        store?: Store,
        appRoutes?: AppRoutes,
        firebaseActions?: FirebaseActions,
        userActions?: UserActions
        history?: History
    } = {}
) {
    const memoryHistory = createMemoryHistory()

    const store = options.store || createTestStore()
    const appContextProps: AppContextProps = {
        appRoutes: options.appRoutes || createAppRoutes(),
        firebaseActions: options.firebaseActions || null as any,
        userActions: options.userActions || null as any,
    }
    const history = options.history || memoryHistory

    return mount(
        <TestWrapper
            store={store}
            appContextProps={appContextProps}
            history={history}
        >
            {node}
        </TestWrapper>
    )
}

export function createChangeEvent(target: any) {
    return {
        target: target
    }
}
