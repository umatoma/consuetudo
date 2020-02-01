import React from 'react'
import sinon from 'sinon'
import SignIn from './SignIn'
import { createTestStore, mountWithTestWrapper } from '../../../testing/TestUtil'
import { FirebaseActions } from '../../../store/firebase/FirebaseActions'

describe('<SignIn/>', () => {

    const sandbox = sinon.createSandbox()

    afterEach(() => {
        sandbox.restore()
    })

    describe('on display', () => {
        it('should display title', () => {
            const page = mountWithTestWrapper(<SignIn/>)

            expect(
                page.findWhere(wrapper => (
                    wrapper.type() === 'h1' &&
                    wrapper.text() === 'Consuetudo'
                ))
            ).toExist()
        })
    })

    describe('on click sign in button', () => {
        it('should call signIn action', () => {
            const store = createTestStore()
            const firebaseActions = new FirebaseActions(store.dispatch)
            const signInStub = sandbox.stub(firebaseActions, 'signIn').returns()

            const page = mountWithTestWrapper(<SignIn/>, { store, firebaseActions })
            page.findWhere((wrapper => (
                wrapper.type() === 'button' &&
                wrapper.text() === 'Sign in with Google'
            ))).simulate('click')

            expect(signInStub.calledOnceWithExactly()).toBeTruthy()
        })
    })
})
