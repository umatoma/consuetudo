import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import TopAppBar from '../../element/TopAppBar'
import { useUserActions, useUserHabit } from '../../hook/StateHooks'
import { useHomeRoute } from '../../hook/AppRouteHooks'

interface PutHabitProps {
    habitId: string
}

const PutHabit: React.FC<PutHabitProps> = props => {
    const userActions = useUserActions()
    const history = useHistory()
    const homeRoute = useHomeRoute()
    const habit = useUserHabit(props.habitId)
    const [updatedHabit, setUpdatedHabit] = useState(habit)

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
                        <div className="top-nav__title">習慣を編集</div>
                    </div>
                </div>
            </div>
            <div className="layout-grid layout-grid--post-habit">
                <div className="layout-grid__inner">
                    <div className="layout-grid__cell">
                        <div className="text-field text-field--fullwidth">
                            <input
                                className="text-field__input"
                                type="text"
                                name="name"
                                value={updatedHabit?.name}
                                onChange={e => setUpdatedHabit(updatedHabit?.setName(e.target.value))}/>
                        </div>
                    </div>
                    <div className="layout-grid__cell layout-grid__cell--bottom-buttons">
                        <div className="layout-grid__inner">
                            <div className="layout-grid__cell layout-grid__cell--span-2">
                                <button
                                    className="button button--cancel"
                                    onClick={() => history.push(homeRoute.createPath())}
                                >
                                    キャンセル
                                </button>
                            </div>
                            <div className="layout-grid__cell layout-grid__cell--span-2">
                                <button
                                    className="button button--confirm"
                                    onClick={() => {
                                        userActions.putUserHabit(updatedHabit!!)
                                            .then(() => history.push(homeRoute.createPath()))
                                            .catch(e => window.alert(e.message))
                                    }}
                                >
                                    決定
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TopAppBar>
    )
}

export default PutHabit
