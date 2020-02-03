import React from 'react'
import sinon from 'sinon'
import { ReactWrapper } from 'enzyme'
import PostHabit from './PostHabit'
import { createTestStore, mountWithTestWrapper } from '../../../testing/TestUtil'
import { UserActions } from '../../../store/user/UserActions'
import { createMemoryHistory } from 'history'
import { HomeRoute } from '../../routing/AppRoute'

describe('<PostHabit/>', () => {

    let page: ReactWrapper
    let postUserHabitStub: sinon.SinonStub<[string], Promise<void>>

    const sandbox = sinon.createSandbox()
    const store = createTestStore()
    const userActions = new UserActions(store.dispatch, null as any)
    const history = createMemoryHistory()

    beforeEach(() => {
        postUserHabitStub = sandbox.stub(userActions, 'postUserHabit')
        page = mountWithTestWrapper(<PostHabit/>, { store, userActions, history })
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('on click confirm button', () => {
        beforeEach(() => {
            postUserHabitStub.resolves()

            page.find('input[name="name"]')
                .simulate('change', { target: { value: 'new-habit-name' } })

            page.findWhere(wrapper => (
                wrapper.type() === 'button' &&
                wrapper.text() === '決定'
            )).simulate('click')
        })

        it('should call postUserHabit action', () => {
            expect(postUserHabitStub.calledOnceWithExactly('new-habit-name'))
        })

        it('should display home page', () => {
            expect(history.location.pathname).toBe(new HomeRoute().createPath())
        })
    })

    describe('on click cancel button', () => {
        beforeEach(() => {
            page.findWhere(wrapper => (
                wrapper.type() === 'button' &&
                wrapper.text() === 'キャンセル'
            )).simulate('click')
        })

        it('should display home page', () => {
            expect(history.location.pathname).toBe(new HomeRoute().createPath())
        })
    })
})
