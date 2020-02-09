import React from 'react'
import sinon from 'sinon'
import { ReactWrapper } from 'enzyme'
import PutHabit from './PutHabit'
import { createTestStore, mountWithTestWrapper } from '../../../testing/TestUtil'
import { UserActions } from '../../../store/user/UserActions'
import { createMemoryHistory } from 'history'
import { ViewHabitRoute } from '../../routing/AppRoute'
import { Habit } from '../../../domain/user/Habit'
import User from '../../../domain/user/User'

describe('<PutHabit/>', () => {

    let page: ReactWrapper
    let putUserHabitStub: sinon.SinonStub<[Habit], Promise<void>>

    const testUser = new User({ id: 'user-id' })
    const testHabitId = 'habit-id-1'
    const testHabitList = [
        new Habit({
            id: 'habit-id-1',
            name: 'habit-name-1',
            recordList: []
        }),
    ]

    const sandbox = sinon.createSandbox()
    const store = createTestStore({
        user: {
            user: testUser,
            habitList: testHabitList
        }
    })
    const userActions = new UserActions(store.dispatch, null as any)
    const history = createMemoryHistory()

    beforeEach(() => {
        putUserHabitStub = sandbox.stub(userActions, 'putUserHabit')
        page = mountWithTestWrapper(<PutHabit habitId={testHabitId}/>, { store, userActions, history })
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('on display', () => {
        it('should display input with default value', () => {
            expect(
                page.find('input[name="name"]').props().value
            ).toBe('habit-name-1')
        })
    })

    describe('on click confirm button', () => {
        beforeEach(() => {
            putUserHabitStub.resolves()

            page.find('input[name="name"]')
                .simulate('change', { target: { value: 'new-habit-name' } })

            page.findWhere(wrapper => (
                wrapper.type() === 'button' &&
                wrapper.text() === '決定'
            )).simulate('click')
        })

        it('should call putUserHabit action', () => {
            expect(putUserHabitStub.calledOnce).toBeTruthy()
            expect(putUserHabitStub.firstCall.args[0].name).toBe('new-habit-name')
        })

        it('should display viewHabit page', () => {
            const path = new ViewHabitRoute().createPath({ habitId: testHabitId })
            expect(history.location.pathname).toBe(path)
        })
    })

    describe('on click cancel button', () => {
        beforeEach(() => {
            page.findWhere(wrapper => (
                wrapper.type() === 'button' &&
                wrapper.text() === 'キャンセル'
            )).simulate('click')
        })

        it('should display viewHabit page', () => {
            const path = new ViewHabitRoute().createPath({ habitId: testHabitId })
            expect(history.location.pathname).toBe(path)
        })
    })
})
