import React, { Component } from 'react';

class Hello extends Component{
    constructor(props){
        super(props)
        this.state={
            name : 'Cyber',
            description:'Hacker',
            count:0
        }
    }
    change() {
        this.setState((prevState)=>({
            count: prevState.count+1
        }));
    }
    change3(){
        this.change();
        this.change();
        this.change();
    }
    logout(){
        localStorage.removeItem('current')
        window.location.replace('/signup')
    }
    render(){
        var user = JSON.parse(localStorage.getItem('current'))
        if (user!=null){
            return (
                <>
            <h1>Hello {user[0]}</h1>
            <p>Your email: {user[2]}</p>
            <button onClick={this.logout}>logout</button>
                </>
            )
        }
        else{
            return(
                <h1>Access Denied</h1>
            )
        }
    }
}
export default Hello;