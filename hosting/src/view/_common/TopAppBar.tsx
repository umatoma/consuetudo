import React, { ReactElement, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { signOut } from '../../store/firebase/FirebaseActions'
import { useHomeRoute } from './AppRouteHooks'

interface TopAppBarProps {
    iconButtonList?: ReactElement[]
}

const defaultProps: TopAppBarProps = {
    iconButtonList: []
}

const TopAppBar: React.FC<TopAppBarProps> = props => {
    const dispatch = useDispatch()
    const history = useHistory()
    const homeRoute = useHomeRoute()
    const [isOpenMenu, setIsOpenMenu] = useState(false)

    return (
        <div>
            <header className="top-app-bar">
                <div className="top-app-bar__row">
                    <section className="top-app-bar__section top-app-bar__section--align-start">
                        <span
                            className="top-app-bar__title"
                            onClick={() => history.push(homeRoute.createPath())}
                        >
                            Consuetudo
                        </span>
                    </section>
                    <section className="top-app-bar__section top-app-bar__section--align-end">
                        {props.iconButtonList}
                        <button
                            className="icon-button"
                            onClick={() => setIsOpenMenu(!isOpenMenu)}
                        >
                            more_vert
                        </button>
                    </section>
                </div>
                <div className={`menu menu--top-app-bar menu-surface ${isOpenMenu ? 'menu-surface--open' : ''}`}>
                    <ul className="list" role="menu" aria-hidden="true" aria-orientation="vertical" tabIndex={-1}>
                        <li
                            className="list-item"
                            role="menuitem"
                            onClick={() => dispatch(signOut())}
                        >
                            <span className="list-item__text">ログアウト</span>
                        </li>
                    </ul>
                </div>
            </header>
            <div className="top-app-bar--fixed-adjust">
                {props.children}
            </div>
        </div>
    )
}

TopAppBar.defaultProps = defaultProps

export default TopAppBar
