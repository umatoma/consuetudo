import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import TopAppBar from '../_common/TopAppBar'
import { postUserHabit } from '../../store/user/UserActions'
import { useThunkDispatch } from '../_common/Hooks'


const PostHabit: React.FC = props => {
    const dispatch = useThunkDispatch()
    const history = useHistory()
    const [habitName, setHabitName] = useState('')

    return (
        <TopAppBar>
            <div className="top-nav">
                <div className="top-nav__row">
                    <div className="top-app-bar__section top-nav__section--center">
                        <div className="top-nav__title">習慣を追加</div>
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
                                value={habitName}
                                onChange={e => setHabitName(e.target.value)}/>
                        </div>
                    </div>
                    <div className="layout-grid__cell layout-grid__cell--bottom-buttons">
                        <div className="layout-grid__inner">
                            <div className="layout-grid__cell layout-grid__cell--span-2">
                                <button
                                    className="button button--cancel"
                                    onClick={() => history.push('/home')}
                                >
                                    キャンセル
                                </button>
                            </div>
                            <div className="layout-grid__cell layout-grid__cell--span-2">
                                <button
                                    className="button button--confirm"
                                    onClick={() => {
                                        dispatch(postUserHabit(habitName))
                                            .then(() => history.push('/home'))
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

export default PostHabit
