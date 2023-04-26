import { autorun, } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..';
import randcolor from '../../tools/colorText';
import checkPrize from '../../tools/slots';
import RandomItem from '../randomItem/RandomItem';
import './infoBar.css'

const InfoBar = observer(() => {


    const { user } = useContext(Context)
    const [value, setValue] = useState(0);
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
            'Time': 1100
        }
    ]

    useEffect(() => {
        if (user.getScores().length === data.length) {


            // обрабатываем ключи объекта
            // const result = Object.keys(countItems).filter((item) => countItems[item] > 1);
            if (user.getMoney() < 0) {
                alert('Сделайте ставку')
            }

            // if (user.getMoney() !== 0) {
            //     console.log(user.getRounds());
            //     checkPrize(countItems, user)
            // }

            if (user.getRounds() !== 0) {
                //checkPrize(countItems, user)
                //user.setClearScores()
            }




            user.setStart(false)

            if (user.sound) {
                if (user.getWinMoney() === 0) {
                    user.audioWinZero.play()
                }
                if (user.getWinMoney() < 0) {
                    user.audioWin00.play()
                }
                if (user.getWinMoney() > 0 && user.getWinMoney() <= 2) {
                    user.audioWin01.play()
                }
                if (user.getWinMoney() > 2) {
                    user.audioWin02.play()
                }
            }


        }
    }, [user.getScores().length])

    autorun(() => {
        if (user.getScores().length === 5) {
            user.audioRound.pause()
            user.audioRound.currentTime = 0;
        }

    })

    function settings() {
        user.sound ? user.setSound(false) : user.setSound(true)
    }

    function manyBid(event) {
        event.preventDefault();
        if (user.sound && value !== 0) {
            user.audioBid.play()
        }
        if (value === 0) {
            bidSignal()
        } else {
            let money = Number(user.getMoney()) + Number(value)
            user.setMoney(money)
            setValue(0)
        }
    }

    const startStopHandler = () => {
        setMyColor(randcolor())
        user.setClearScores()
        user.setClearWinMessage()

        if (user.getMoney() && user.sound) {
            user.audioPush.play();
            setTimeout(() => { user.audioRound.play() }, 750)
        }

        // let arrW = JSON.parse(JSON.stringify(user.getWinArr()))
        // console.log(arrW);

        if (user.getMoney() === 0) {
            bidSignal()
        } else {
            let money = Number(user.getMoney()) - 1
            user.setMoney(money)
            user.setClearScores()
            if (user.getStart()) {
                user.setStart(false)
                user.setClearScores()

            } else {
                if (!user.getStart()) {
                    user.setStart(true)
                    let rounds = user.getRounds()
                    user.setRounds(rounds + 1)
                    user.setWinMoney(0)

                    // user.setDelWinArr()
                }
            }
        }
    }


    const autoPlay = () => {
        user.setClearWinMessage()
        user.setWinMessage('Wait please...')
        setMyColor("#" + randcolor())
        if (user.getMoney() === 0) {
            bidSignal()
        } else {
            user.setAutoRounds(true)
            let auto
            auto = setInterval(() => {
                if (!user.getAutoRounds()) {
                    clearInterval(auto)
                }
                if (user.getMoney() === 0) {
                    clearInterval(auto)
                    user.setAutoRounds(false)
                }
                else {
                    startStopHandler()
                }
            }, 5000)
        }
    }

    const stopAuto = () => user.setAutoRounds(false)
    const bidSignal = () => alert('Ставка 0. Сделайте ставку!!!')

    return (
        <div className='info-bar'>

            <h3 style={{ color: myColor, margin: "5px" }}>I twist and turn, I want to fool you!</h3>
            <div className='myFlex'>
                <form className='myFlex myFlexInline' onSubmit={manyBid} >
                    <p>Cтавка $</p>
                    <input type={'number'} value={value} min={0}
                        onFocus={(event) => (event.target.value = "")}
                        onChange={(event) => {
                            setValue(event.target.value)
                        }}></input>
                    <button type="submit" >Ставка</button>
                </form>
                <div className='settings'>
                    <button className={user.sound ? 'settings-btn sound-on' : 'settings-btn sound-off'}
                        onClick={() => settings()}
                    ></button>
                </div>
            </div>

            <div className='divApp'>
                {data.map((item, index) => {
                    return <RandomItem key={index} timer={item.Time} arr={item.Arr} speed={2} color={myColor} ></RandomItem>
                })}

            </div>
            <div className='info-msg' style={{ color: myColor, height: '60px' }}>
                {user.getWinMessage().map(item => {
                    return (
                        <p key={Math.random() * Date.now() * Math.random()}>{item}
                        </p>)
                })}
            </div>

            <div className='myFlex btn'>
                {user.getAutoRounds() ?
                    <div className=''>
                        <button disabled={false}
                            onClick={() => stopAuto()}>
                            {"STOP AUTO"}
                        </button>

                    </div>
                    :
                    <div className=''>
                        <button disabled={user.getStart()}
                            onClick={() => startStopHandler()}>
                            {user.getStart() ? 'WAIT' : "START"}
                        </button>
                        <button disabled={user.getStart()}
                            onClick={() => autoPlay()}>
                            {user.getStart() ? 'WAIT' : "AUTO"}
                        </button>
                    </div>
                }

            </div>

            <div className='myFlex'>
                <p className='ml-mr-5'>Money $: {user.getMoney()}</p>
                <p className='ml-mr-5'>Now win $: {user.getWinMoney()}</p>
            </div>

            <div className='winArrS'>
                <div>
                    {user.getWinArr().length === 0 ? <h4>Winning combos...</h4> : user.getWinArr().map(item => {
                        return (
                            <div key={Math.random() * Date.now() * Math.random()} className='myFlexCenter'>
                                <p style={{ margin: 0 }}>#{item["round"]} {item["time"]}</p>
                                <img className={'minImg'} src={process.env.PUBLIC_URL + '/images/' + item['winImg'] + '.png'} alt="currentN" /> * {item['winAmount']} = {item['winMoney']}$
                            </div>
                        )
                    })}
                </div>

                <div>
                    <p className='ml-mr-5'>Rounds: {user.getRounds()}</p>
                    <p className='ml-mr-5'>All Win $: {user.getWinAllMoney()}</p>
                </div>


            </div>
        </div >
    )
})

export default InfoBar