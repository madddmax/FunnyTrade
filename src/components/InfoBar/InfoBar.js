import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..';
import randcolor from '../../tools/colorText';
import RandomItem from '../randomItem/RandomItem';
import './infoBar.css'

const InfoBar = observer(() => {

    const { user } = useContext(Context)
    const [clientId, setClientId] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [myColor, setMyColor] = useState('white')

    const data = [
        {
            'Arr': ['TQBR:ALRS', 'TQBR:GAZP', 'TQBR:GMKN', 'TQBR:LKOH', 'TQBR:VTBR', 'TQTF:LQDT'],
            'Time': 900
        },
        {
            'Arr': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '1000'],
            'Time': 1050
        },
        {
            'Arr': ['Buy', 'Sell'],
            'Time': 1200
        }
    ]

    useEffect(() => {
        if (user.getScores().length === data.length) {

            if (user.sound) {
                user.audioWin01.play()
            }

            user.setStart(false)
        }
    }, [user.getScores().length])

    function settings() {
        user.sound ? user.setSound(false) : user.setSound(true)
    }

    const startStopHandler = () => {
        setMyColor(randcolor())
        user.setClearScores()

        if (user.sound) {
            user.audioPush.play();
        }

        user.setStart(true)
    }

    return (
        <div className='info-bar' >
            <h1 style={{ color: myColor, margin: "5px" }}>One button one trade</h1>

            <div className='myFlex'>
                <div className='myFlexInline'>
                    <p>Client Id</p>
                    <input value={clientId}
                        style={{width: '100px', textAlign: 'left'}}
                        onChange={(event) => {
                            setClientId(event.target.value)
                        }}></input>
                    <p>API Token</p>
                    <input value={apiKey}
                        type={'password'}
                        style={{width: '210px', textAlign: 'left'}}
                        onChange={(event) => {
                            setApiKey(event.target.value)
                        }}></input>
                    <a href='https://docs.comon.ru/trade-api/' target='_blank' rel="noreferrer" style={{ color: 'white' }}>Get Api Token</a>
                </div>

                <div className='settings'>
                    <button className={user.sound ? 'settings-btn sound-on' : 'settings-btn sound-off'}
                        onClick={() => settings()}
                    ></button>
                </div>
            </div>

            <div className='divApp'> 
                {data.map((item) => {
                    return <RandomItem timer={item.Time} arr={item.Arr} speed={2} color={myColor}></RandomItem>
                })}
            </div>

            <div className='myFlex btn'>
                {
                    <div className=''>
                        <button disabled={user.getStart()}
                            onClick={() => startStopHandler()}>
                            {user.getStart() ? 'WAIT' : "START"}
                        </button>
                    </div>
                }
            </div>

            <div className='winArrS' style={{ borderColor: myColor }}>

            </div>
        </div>
    )
})

export default InfoBar