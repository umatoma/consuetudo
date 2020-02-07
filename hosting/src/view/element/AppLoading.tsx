import React from 'react'

const AppLoading: React.FC = props => {
    return (
        <div className="app__loading">
            <div role="progressbar" className="linear-progress linear-progress--indeterminate linear-progress--fixed">
                <div className="linear-progress__buffering-dots"/>
                <div className="linear-progress__buffer"/>
                <div className="linear-progress__bar linear-progress__primary-bar">
                    <span className="linear-progress__bar-inner"/>
                </div>
                <div className="linear-progress__bar linear-progress__secondary-bar">
                    <span className="linear-progress__bar-inner"/>
                </div>
            </div>
            <div>
                Loading...
            </div>
        </div>
    )
}

export default AppLoading
