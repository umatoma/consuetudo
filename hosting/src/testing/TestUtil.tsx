import { AppContext, AppContextProps } from '../view/AppContext'
import { Provider } from 'react-redux'
import React, { ChangeEvent, ReactElement } from 'react'
import { createStore, PreloadedState, Reducer, Store } from 'redux'
import { mount } from 'enzyme'
import { AppRoutes, createAppRoutes } from '../view/AppRoute'
import { FirebaseActions } from '../store/firebase/FirebaseActions'
import { UserActions } from '../store/user/UserActions'
import { MemoryRouter } from 'react-router-dom'
import StoreState from '../store/StoreState'
import { FirebaseState } from '../store/firebase/FirebaseState'
import UserState from '../store/user/UserState'
import Home from '../view/pages/home/Home'
import Mock = jest.Mock

export interface TestWrapperProps {
    store: Store,
    appContextProps: AppContextProps
}

export const TestWrapper: React.FC<TestWrapperProps> = props => {
    return (
        <Provider store={props.store}>
            <AppContext.Provider value={props.appContextProps}>
                <MemoryRouter>
                    {props.children}
                </MemoryRouter>
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

export function createChangeEvent(target: any) {
    return {
        target: target
    }
}
