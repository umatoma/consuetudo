import React from 'react'
import sinon from 'sinon'
import { createTestStore, mountWithTestWrapper } from '../../../testing/TestUtil'
import Home from './Home'
import TopAppBar from '../../element/TopAppBar'
import { Habit } from '../../../domain/user/Habit'
import { HabitRecord } from '../../../domain/user/HabitRecord'
import { HabitRecordDate } from '../../../domain/user/HabitRecordDate'
import { ReactWrapper } from 'enzyme'
import { ViewHabitRoute } from '../../AppRoute'

const historyPushMock = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: historyPushMock
    })
}))

describe('<Home/>', () => {

    let page: ReactWrapper

    const sandbox = sinon.createSandbox()
    const store = createTestStore({
        user: {
            habitList: [
                new Habit({
                    id: 'habit-id-1',
                    name: 'habit-name-1',
                    recordList: [
                        new HabitRecord({
                            habitId: 'habit-id-1',
                            recordDate: new HabitRecordDate({ year: 2999, month: 1, date: 23, })
                        })
                    ]
                }),
                new Habit({
                    id: 'habit-id-2',
                    name: 'habit-name-2',
                    recordList: [
                        new HabitRecord({
                            habitId: 'habit-id-2',
                            recordDate: new HabitRecordDate({ year: 2999, month: 12, date: 11, })
                        })
                    ]
                }),
            ]
        }
    })

    beforeEach(() => {
        sandbox.useFakeTimers(new Date('2999-01-23T00:00+0900'))
        page = mountWithTestWrapper(<Home/>, { store })
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('on display', () => {
        it('display app bar', () => {
            expect(page.find(TopAppBar)).toExist()
        })

        it('display top nav', () => {
            expect(page).toIncludeText('習慣を記録')
            expect(page).toIncludeText('1月23日')
        })

        it('display habit list', () => {
            const habit1 = page.findWhere(wrapper => (
                wrapper.type() === 'li' &&
                wrapper.text().includes('habit-name-1')
            ))
            const habit2 = page.findWhere(wrapper => (
                wrapper.type() === 'li' &&
                wrapper.text().includes('habit-name-2')
            ))

            expect(habit1).toExist()
            expect(habit1.find('input')).toBeChecked()

            expect(habit2).toExist()
            expect(habit2.find('input')).not.toBeChecked()
        })
    })

    describe('on click prev date button', () => {
        beforeEach(() => {
            page.findWhere(wrapper => (
                wrapper.type() === 'button' &&
                wrapper.text() === 'keyboard_arrow_left'
            )).simulate('click')
        })

        it('display previous date', () => {
            expect(page).toIncludeText('1月22日')
        })
    })

    describe('on click next date button', () => {
        beforeEach(() => {
            page.findWhere(wrapper => (
                wrapper.type() === 'button' &&
                wrapper.text() === 'keyboard_arrow_right'
            )).simulate('click')
        })

        it('display next date', () => {
            expect(page).toIncludeText('1月24日')
        })
    })

    describe('on click habit item', () => {
        beforeEach(() => {
            page.findWhere(wrapper => (
                wrapper.type() === 'li' &&
                wrapper.text().includes('habit-name-1')
            )).simulate('click')
        })

        it('display viewHabit page', () => {
            const viewHabitRoute = new ViewHabitRoute()
            const path = viewHabitRoute.createPath({ habitId: 'habit-id-1' })
            expect(historyPushMock).toHaveBeenCalledWith(path)
        })
    })
})
