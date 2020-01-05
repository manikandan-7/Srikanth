import React from 'react'
import Today from './Today'
import TodayRight from './TodayRight'
import DailyContainer from './DailyContainer'


class Contents extends React.Component{

    constructor(props){
        super(props)
        this.state={
            weather:props.weather
        }
        
    }


    render(){
        if(this.props.weather.city)
        return(
            <div className='flex-column'>
                <Today city={`${this.props.weather.city.name} ${this.props.weather.city.country}`} 
                    tempc={Math.round(this.props.weather.list[1].main.temp-273.15)} 
                    tempf={Math.round((this.props.weather.list[1].main.temp - 273.15) * 9/5 + 32)} 
                    day={this.props.weather.list[1].weather[0].description}
                />

                <TodayRight 
                    humidity= {Math.round(this.props.weather.list[1].main.humidity)}
                    wind={Math.round(Number(this.props.weather.list[1].wind.speed *2.237))}
                />
                
                <DailyContainer data={
                    [this.props.weather.list[8],
                    this.props.weather.list[16],
                    this.props.weather.list[24],
                    this.props.weather.list[32],
                    this.props.weather.list[39]]}/>
            </div>
        )
        return(<img src='/res/35771931234507.564a1d2403b3a.gif' alt='cant load' style={{position:'absolute',top:'50%',left:'50%'}}/>)
    }

}

export default Contents

