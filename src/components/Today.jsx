import React from 'react'
import ImageSelect from './ImageSelect'

class Today extends React.Component{
    constructor(props){
        super(props)
        this.state={isCel:true}
    }

    ShowC=()=>{
        this.setState({isCel:true})
    }
    ShowF=()=>{
        this.setState({isCel:false})
    }
    render(){
        return(
            <div className='today'>
                <div className='today-center'>
                    <div className='city'>
                        {this.props.city}
                    </div>
                    <div className='temp'>
                        <div className='degree'>
                            {this.state.isCel?this.props.tempc:this.props.tempf}
                        </div>
                        <div className='celOrFar'>
                            <div className='cel' onClick={this.ShowC} style={{fontWeight:this.state.isCel?'bold':'',fontSize:this.state.isCel?'larger':''}}>
                                C
                            </div>
                            <div className="far" onClick={this.ShowF} style={{fontWeight:!this.state.isCel?'bold':'',fontSize:!this.state.isCel?'larger':''}}>
                                F
                            </div>
                        </div>
                    </div>
                    <ImageSelect desc={this.props.day}/>
                    <div className='dayType'>
                        {this.props.day}
                    </div>
                </div>
            </div>
        )
    }
    
}

export default Today