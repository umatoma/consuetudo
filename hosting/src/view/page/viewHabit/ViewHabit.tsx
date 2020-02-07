import React from 'react'
import { useHistory } from 'react-router-dom'
import ViewHabitCalendar from './ViewHabitCalendar'
import TopAppBar from '../../element/TopAppBar'
import { useUserActions, useUserHabit } from '../../hook/StateHooks'
import { useHomeRoute, usePutHabitRoute } from '../../hook/AppRouteHooks'

interface ViewHabitProps {
    habitId: string
}

const ViewHabit: React.FC<ViewHabitProps> = props => {
    const userActions = useUserActions()
    const history = useHistory()
    const homeRoute = useHomeRoute()
    const putHabitRoute = usePutHabitRoute()
    const habit = useUserHabit(props.habitId)

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
                        <div className="top-nav__panel">{habit.name}</div>
                    </div>
                </div>
            </div>
            <div className="layout-grid">
                <div className="layout-grid__inner">
                    <div className="layout-grid__cell">
                        <ViewHabitCalendar habit={habit}/>
                    </div>
                    <div className="layout-grid__cell">
                        <button
                            className="button button--put-habit"
                            onClick={() => history.push(putHabitRoute.createPath({ habitId: habit.id }))}
                        >
                            習慣を編集
                        </button>
                    </div>
                    <div className="layout-grid__cell">
                        <button
                            className="button button--delete-habit"
                            onClick={() => {
                                userActions.deleteUserHabit(habit)
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
