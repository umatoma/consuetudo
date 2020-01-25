import React from 'react'
import { useHistory } from 'react-router-dom'
import Calendar from 'react-calendar'
import TopAppBar from '../_common/TopAppBar'
import { useThunkDispatch, useUserHabit } from '../_common/Hooks'
import { deleteUserHabit } from '../../store/user/UserActions'
import { AppRoutePropsFactory } from '../_common/AppRoute'

interface ViewHabitProps {
    habitId: string
}

const ViewHabit: React.FC<ViewHabitProps> = props => {
    const dispatch = useThunkDispatch()
    const history = useHistory()

    const habitId = props.habitId
    const habit = useUserHabit(habitId)

    const routeFactory = AppRoutePropsFactory.getInstance()

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
                        <div className="top-nav__title">習慣の成果</div>
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
                        <Calendar/>
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
                                    .then(() => history.push(routeFactory.home().path))
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
