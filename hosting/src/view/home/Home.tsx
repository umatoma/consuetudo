import React from 'react'
import { useHistory } from 'react-router-dom'
import TopAppBar from '../_common/TopAppBar'
import { useSelector } from 'react-redux'
import StoreState from '../../store/StoreState'
import { Habit } from '../../store/user/UserEntities'
import { AppRoutePropsFactory } from '../_common/AppRoute'

const Home: React.FC = props => {
    const history = useHistory()
    const habitList = useSelector<StoreState, Habit[]>(state => state.user.habitList)
    const routeFactory = AppRoutePropsFactory.getInstance()

    return (
        <TopAppBar
            iconButtonList={[
                <button
                    key="post-user-habit"
                    className="icon-button"
                    onClick={() => history.push('/postHabit')}
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
                        onClick={() => {
                            const path = routeFactory.viewHabit().createEmbeddedPath({ habitId: habit.id })
                            history.push(path)
                        }}
                    >
                        {habit.name}
                        <div className="checkbox list-item__meta">
                            <input type="checkbox" className="checkbox__native-control"/>
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
