import React from 'react'
import { useHistory } from 'react-router-dom'
import Calendar, { MonthView } from 'react-calendar'
import TopAppBar from '../_common/TopAppBar'
import { useThunkDispatch, useUserHabit } from '../_common/Hooks'
import { deleteUserHabit } from '../../store/user/UserActions'
import { useHomeRoute } from '../_common/AppRouteHooks'
import { HabitRecordDate } from '../../store/user/UserEntities'

interface ViewHabitProps {
    habitId: string
}

const ViewHabit: React.FC<ViewHabitProps> = props => {
    const dispatch = useThunkDispatch()
    const history = useHistory()
    const homeRoute = useHomeRoute()

    const habitId = props.habitId
    const habit = useUserHabit(habitId)

    if (!habit) {
        return (
            <div>Error</div>
        )
    }

    return (
        <TopAppBar>
            <div className="top-nav">
                <div className="top-nav__row">
                    <div className="top-app-bar__section top-nav__section--center">
                        <div className="top-nav__title">習慣の記録</div>
                    </div>
                </div>
                <div className="top-nav__row top-nav__row--half-colored">
                    <div className="top-nav__section top-nav__section--full">
                        <div className="top-nav__panel">{habit?.name}</div>
                    </div>
                </div>
            </div>
            <div className="layout-grid">
                <div className="layout-grid__inner">
                    <div className="layout-grid__cell">
                        <Calendar
                            maxDetail="month"
                            minDetail="month"
                            tileClassName={({ date, view }) => {
                                const recordDate = HabitRecordDate.fromDate(date)
                                return habit?.isRecordedOn(recordDate) ? 'react-calendar__tile--is-recorded' : ''
                            }}
                        />
                    </div>
                    <div className="layout-grid__cell">
                        <button
                            className="button button--put-habit"
                            onClick={() => window.alert('編集')}
                        >
                            習慣を編集
                        </button>
                    </div>
                    <div className="layout-grid__cell">
                        <button
                            className="button button--delete-habit"
                            onClick={() => {
                                dispatch(deleteUserHabit(habit))
                                    .then(() => history.push(homeRoute.createPath()))
                            }}
                        >
                            習慣を削除
                        </button>
                    </div>
                </div>
            </div>
        </TopAppBar>
    )
}

export default ViewHabit
