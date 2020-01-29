import React from 'react'

class Datestamp extends React.Component {
    state = {  }

    isToday = (someDate) => {
        const today = new Date()
        return someDate.getDate() === today.getDate() &&
          someDate.getMonth() === today.getMonth() &&
          someDate.getFullYear() === today.getFullYear()
      }

      isYesterday = (someDate) => {
        let yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        return someDate.getDate() === yesterday.getDate() &&
          someDate.getMonth() === yesterday.getMonth() &&
          someDate.getFullYear() === yesterday.getFullYear()
      }

    render() { 
        let date = new Date(this.props.date).toDateString()
        if(this.isToday(new Date(date))){
            date = 'Today'
        }
        else if(this.isYesterday(new Date(date))){
            date = 'Yesterday'
        }
        return ( 
            <div className='dateStamp'>
                <div className='insideDatestamp'>
                {date}
                </div>
            </div>
         );
    }
}
 
export default Datestamp;