import React from 'react'

class SearchContact extends React.Component {
    constructor(){
        super()
        this.state={
            search:''
        }
    }

    handleChange=(e)=>{
        this.props.handleChange(e.target.value)
    }

    render() { 
        return ( 
            <div className='SearchContact'>
                <i class="fas fa-search"></i>
                <input type='text' name='search' value={this.props.search} onChange={this.handleChange} placeholder='Search contact'/>
            </div>
         );
    }
}
 
export default SearchContact;