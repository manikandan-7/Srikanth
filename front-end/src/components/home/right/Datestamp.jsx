import React from 'react'

class Datestamp extends React.Component {
    state = {  }
    render() { 
        return ( 
            <div className='dateStamp'>
                {this.props.date}
            </div>
         );
    }
}
 
export default Datestamp;