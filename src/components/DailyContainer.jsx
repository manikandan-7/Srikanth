import React from 'react'
import ImageSelect from './ImageSelect'

class DailyContainer extends React.Component{
    constructor(props){
        super()
    }

    Day(temperature,date,desc,source){
        return(
            <div className='day'>
                <p>{date}</p>
                {source}
                <h4>{temperature}</h4>
                <p>{desc}</p>
            </div>
        )
    }

    render(){
        return(
            <div className='daily-container'>
                <div className='daily'>
                    {this.props.data.map(datum=>{
                        let temperature = Math.round(datum.main.temp-273.15);
                        let date = String(new Date(datum.dt_txt)).slice(0,10);
                        let desc = datum.weather[0].description;
                      
                        return this.Day(temperature,date,desc,<ImageSelect desc={desc}/>)
                    })}
                </div>
            </div>
        )
    }
}
export default DailyContainer