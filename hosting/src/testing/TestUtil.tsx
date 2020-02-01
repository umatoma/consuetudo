import { AppContext, AppContextProps } from '../view/AppContext'
import { Provider } from 'react-redux'
import React, { ReactElement } from 'react'
import { createStore, Reducer, Store } from 'redux'
import { mount } from 'enzyme'
import { AppRoutes, createAppRoutes } from '../view/AppRoute'
import { FirebaseActions } from '../store/firebase/FirebaseActions'
import { UserActions } from '../store/user/UserActions'

export interface TestWrapperProps {
    store: Store,
    appContextProps: AppContextProps
}

export const TestWrapper: React.FC<TestWrapperProps> = props => {
    return (
        <Provider store={props.store}>
            <AppContext.Provider value={props.appContextProps}>
                {props.children}
            </AppContext.Provider>
        </Provider>
    )
}

export function createTestStore(): Store {
    const reducer: Reducer = (state => state)
    return createStore(reducer, {})
}

export function mountWithTestWrapper(
    node: ReactElement,
    options: {
        store?: Store,
        appRoutes?: AppRoutes,
        firebaseActions?: FirebaseActions,
        userActions?: UserActions
    } = {}
) {
    const store = options.store || createTestStore()
    const appContextProps: AppContextProps = {
        appRoutes: options.appRoutes || createAppRoutes(),
        firebaseActions: options.firebaseActions || null as any,
        userActions: options.userActions || null as any,
    }

    return mount(
        <TestWrapper store={store} appContextProps={appContextProps}>
            {node}
        </TestWrapper>
    )
}
