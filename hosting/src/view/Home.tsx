import React from 'react'
import TopAppBar from './TopAppBar'

const Home: React.FC = props => {
    return (
        <TopAppBar
            iconButtonList={[
                <button
                    className="icon-button"
                    onClick={() => { window.alert('ADD') }}
                >
                    add
                </button>
            ]}
        >
            HOGE
        </TopAppBar>
    )
}

export default Home
