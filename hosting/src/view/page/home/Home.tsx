import React, { ChangeEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import TopAppBar from '../../element/TopAppBar'
import { usePostHabitRoute, useViewHabitRoute } from '../../hook/AppRouteHooks'
import { useUserActions, useUserHabitList } from '../../hook/StateHooks'
import { Habit } from '../../../domain/user/Habit'
import { HabitRecord } from '../../../domain/user/HabitRecord'
import { HabitRecordDate } from '../../../domain/user/HabitRecordDate'

const Home: React.FC = props => {
    const userActions = useUserActions()
    const history = useHistory()
    const postHabitRoute = usePostHabitRoute()
    const viewHabitRoute = useViewHabitRoute()
    const habitList = useUserHabitList()
    const [recordDate, setRecordDate] = useState<HabitRecordDate>(HabitRecordDate.fromDate(new Date()))

    const handleChangeHabitCheckbox = (habit: Habit) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const record = new HabitRecord({ habitId: habit.id, recordDate })

            if (e.target.checked) {
                userActions.pushUserHabitRecord(record)
                    .catch((e) => window.alert(e.message))
            } else {
                userActions.removeUserHabitRecord(record)
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
                        <button
                            className="icon-button icon-button__to-prev-day"
                            onClick={() => setRecordDate(recordDate.prevDate())}
                        >
                            keyboard_arrow_left
                        </button>
                    </div>
                    <div className="top-app-bar__section top-nav__section--center">
                        <div className="top-nav__title">習慣を記録</div>
                    </div>
                    <div className="top-app-bar__section top-nav__section--right">
                        <button
                            className="icon-button icon-button__to-next-day"
                            onClick={() => setRecordDate(recordDate.nextDate())}
                        >
                            keyboard_arrow_right
                        </button>
                    </div>
                </div>
                <div className="top-nav__row top-nav__row--half-colored">
                    <div className="top-nav__section top-nav__section--full">
                        <div className="top-nav__panel">
                            {recordDate.month}月{recordDate.date}日
                        </div>
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
                        onClick={() => {
                            history.push(viewHabitRoute.createPath({ habitId: habit.id }))
                        }}
                    >
                        {habit.name}
                        <div
                            className="checkbox list-item__meta"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <input
                                type="checkbox"
                                className="checkbox__native-control"
                                checked={habit.isRecordedOn(recordDate)}
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
