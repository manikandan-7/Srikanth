import React from 'react'
import ContactCard from './ContactCard'
import { connect } from 'react-redux';

class ContactList extends React.Component {
    // componentDidMount(){
    //     this.setState({
    //         contactList:this.props.contactList
    //     })
    // }
    render() { 
        return ( 
            <div className='ContactList'>
                {
                    this.props.mycontacts.contacts &&
                    this.props.mycontacts.contacts.map(element=>(
                        // (element.phone && (element.phone.includes(this.props.search)) || element.name.includes(this.props.search))&&
                        <ContactCard details={element}/>
                     ))
                }
            </div>
         );
    }
}

const mapStateToProps = (state) => { return { mycontacts: state }}
 
export default connect(mapStateToProps)(ContactList);