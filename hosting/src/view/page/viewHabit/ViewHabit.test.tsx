import React from 'react'
import { ReactWrapper } from 'enzyme'
import sinon from 'sinon'
import { createMemoryHistory } from 'history'
import { createTestStore, mountWithTestWrapper } from '../../../testing/TestUtil'
import { UserActions } from '../../../store/user/UserActions'
import ViewHabit from './ViewHabit'
import { HomeRoute, PutHabitRoute } from '../../routing/AppRoute'
import { Habit } from '../../../domain/user/Habit'
import { HabitRecord } from '../../../domain/user/HabitRecord'
import { HabitRecordDate } from '../../../domain/user/HabitRecordDate'
import User from '../../../domain/user/User'

describe('<ViewHabit/>', () => {

    let page: ReactWrapper
    let deleteUserHabitStub: sinon.SinonStub<[Habit], Promise<void>>

    const testUser = new User({ id: 'user-id' })
    const testHabitList = [
        new Habit({
            id: 'habit-id-1',
            name: 'habit-name-1',
            recordList: [
                new HabitRecord({
                    habitId: 'habit-id-1',
                    recordDate: new HabitRecordDate({ year: 2999, month: 1, date: 15, })
                }),
                new HabitRecord({
                    habitId: 'habit-id-1',
                    recordDate: new HabitRecordDate({ year: 2999, month: 1, date: 23, })
                }),
            ]
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

    const testHabitId = 'habit-id-1'

    beforeEach(() => {
        sandbox.useFakeTimers(new Date('2999-01-01T00:00+0900'))
        deleteUserHabitStub = sandbox.stub(userActions, 'deleteUserHabit')
        page = mountWithTestWrapper(<ViewHabit habitId={testHabitId}/>, { store, userActions, history })
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('on display', () => {
        it('should display habit name', () => {
            expect(page).toIncludeText(testHabitList[0].name)
        })

        it('should highlight recorded date', () => {
            const buttonsInCalendar = page.find('Calendar button')

            expect(
                buttonsInCalendar.filterWhere(wrapper => (
                    wrapper.hasClass('react-calendar__tile--is-recorded') &&
                    wrapper.text() === '15'
                ))
            ).toExist()

            expect(
                buttonsInCalendar.filterWhere(wrapper => (
                    wrapper.hasClass('react-calendar__tile--is-recorded') &&
                    wrapper.text() === '23'
                ))
            ).toExist()
        })
    })

    describe('on click put habit button', () => {
        beforeEach(() => {
            page.findWhere(wrapper => (
                wrapper.type() === 'button' &&
                wrapper.text() === '習慣を編集'
            )).simulate('click')
        })

        it('should display put habit page', () => {
            const path = new PutHabitRoute().createPath({ habitId: testHabitId })
            expect(history.location.pathname).toBe(path)
        })
    })

    describe('on click delete habit button', () => {
        beforeEach(() => {
            deleteUserHabitStub.resolves()

            page.findWhere(wrapper => (
                wrapper.type() === 'button' &&
                wrapper.text() === '習慣を削除'
            )).simulate('click')
        })

        it('should call deleteUserHabit action', () => {
            expect(deleteUserHabitStub.calledOnceWithExactly(testHabitList[0])).toBeTruthy()
        })

        it('should display home page', () => {
            const path = new HomeRoute().createPath()
            expect(history.location.pathname).toBe(path)
        })
    })
})