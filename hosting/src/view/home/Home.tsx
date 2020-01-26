import React, { ChangeEvent } from 'react'
import { useHistory } from 'react-router-dom'
import TopAppBar from '../_common/TopAppBar'
import { usePostHabitRoute, useViewHabitRoute } from '../_common/AppRouteHooks'
import { useThunkDispatch, useUserHabitList } from '../_common/Hooks'
import { pushUserHabitRecord, removeUserHabitRecord } from '../../store/user/UserActions'
import { Habit, HabitRecord } from '../../store/user/UserEntities'

const Home: React.FC = props => {
    const dispatch = useThunkDispatch()
    const history = useHistory()
    const postHabitRoute = usePostHabitRoute()
    const viewHabitRoute = useViewHabitRoute()
    const habitList = useUserHabitList()

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate()

    const handleChangeHabitCheckbox = (habit: Habit) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const record = new HabitRecord({ habitId: habit.id, year, month, date })
            console.log(e.target.checked, record)

            if (e.target.checked) {
                dispatch(pushUserHabitRecord(record))
                    .catch((e) => window.alert(e.message))
            } else {
                dispatch(removeUserHabitRecord(record))
                    .catch((e) => window.alert(e.message))
            }
        }
    }

    return (
        <TopAppBar
            iconButtonList={[
                <button
                    key="post-user-habit"
                    className="icon-button"
                    onClick={() => history.push(postHabitRoute.createPath())}
                >
                    add
                </button>
            ]}
        >
            <div className="top-nav">
                <div className="top-nav__row">
                    <div className="top-app-bar__section top-nav__section--left">
                        <button className="icon-button icon-button__to-prev-day">keyboard_arrow_left</button>
                    </div>
                    <div className="top-app-bar__section top-nav__section--center">
                        <div className="top-nav__title">習慣を記録</div>
                    </div>
                    <div className="top-app-bar__section top-nav__section--right">
                        <button className="icon-button icon-button__to-next-day">keyboard_arrow_right</button>
                    </div>
                </div>
                <div className="top-nav__row top-nav__row--half-colored">
                    <div className="top-nav__section top-nav__section--full">
                        <div className="top-nav__panel">01/23(月)</div>
                    </div>
                </div>
            </div>
            <ul className="list" role="group">
                {habitList.map((habit) => (
                    <li
                        className="list-item list-item--habit"
                        role="checkbox"
                        aria-checked="false"
                        key={habit.id}
                        onClick={() => history.push(viewHabitRoute.createPath({ habitId: habit.id }))}
                    >
                        {habit.name}
                        <div
                            className="checkbox list-item__meta"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <input
                                type="checkbox"
                                className="checkbox__native-control"
                                checked={habit.isRecordedOn(year, month, date)}
                                onChange={handleChangeHabitCheckbox(habit)}
                            />
                            <div className="checkbox__background">
                                <svg className="checkbox__checkmark" viewBox="0 0 24 24">
                                    <path
                                        className="checkbox__checkmark-path"
                                        fill="none"
                                        d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                                </svg>
                                <div className="checkbox__mixedmark"/>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </TopAppBar>
    )
}

export default Home
