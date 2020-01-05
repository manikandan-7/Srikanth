import React from 'react'

class TodayRight extends React.Component {
    constructor(props){
        super(props)
        this.state = {  }
    }
    render() { 
        return ( 
            <div className='today-right'>
                <div className='progress-circle'>
                    <p>Humidity</p>
                    <div >
                    <span >{this.props.humidity} %  </span>
                    <svg style={{left:'0px; top: 0px', width:'100', height:'100', viewBox:'0 0 100 100'}}>
                        <circle cx="50" cy="50" r="42" strokeDasharray={`${this.props.humidity*2.64} ${264-this.props.humidity*2.64}`} ></circle>   
                    </svg>
                </div >
                </div>
                <div className="progress-circle wind">
                <p>Wind</p>
                <div>
                    <span>{this.props.wind} mph</span>
                    <svg style={{left:' 0px; top: 0px', width:"100", height:"100", viewBox:"0 0 100 100"}}>
                        <circle id='win-cir' cx="50" cy="50" r="42" strokeDasharray={`${this.props.wind*5.28} ${264-this.props.wind*5.28}`} ></circle>   
                    </svg>
                </div>

              </div>
            </div>
         );
    }
}
 
export default TodayRight