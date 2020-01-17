import React,{Component} from 'react'
// import axios from 'axios'

class Login extends Component {
    constructor(){
        super()
        this.state={
            phone:'',
            password:''
        }
    }
    

    submitForm=(e)=>{
        fetch('http://localhost:8080/login',{
            method:'POST',
            mode:'cors',
            headers:{'Content-Type': 'application/json; charset=utf-8'},
            body:JSON.stringify({
                'phone':this.state.phone,
                'password':this.state.password
            })
            
        }).then(res => res.json())
        .then(data => {
            if (data.status){
                localStorage.setItem('whatsapp',JSON.stringify(data.data))
            }
            else{
                alert('invalid credentials')
            }
        })
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    render() { 
        return ( 
            <form method='post'>
                <input type='text' name='phone' value={this.state.phone} onChange={this.handleChange} placeholder='Mobile Number'/>
                <input type='password' name='password' value={this.state.password} onChange={this.handleChange} placeholder='password'/>
                <input type='button' value='submit' onClick={this.submitForm}/>
            </form>
         );
    }
}
 
export
 default Login;