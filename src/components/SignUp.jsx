import React,{Component} from 'react'
import '../signup.css'
// import Hello from '../Hello'

class SignUp extends Component {
    constructor(){
        super()
        this.state=({
            loginUserName:'',
            loginPassword:'',
            signUpUserName:'',
            signUpEmail:'',
            signUpPassword:'',
            signUpConfirm:'',
            flag:true
        })
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.id]:e.target.value
        })

    }
    LoginPage(){
        return(
            <div className='login-form'  id='login-form'>
                <h2>Login</h2>
                <form className='login-form' onSubmit={this.loginSubmit}>
                    <div>
                        <label>UserName</label>
                        <input type="text" placeholder="User Name" id='loginUserName' value={this.state.loginUserName} onChange={this.handleChange} required/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" placeholder="password" id='loginPassword' value={this.state.loginPassword} onChange={this.handleChange} required/>
                    </div>
                    <input className='submit-button' type="submit" value="Login"/>
                </form>
                
            </div>
        )
    }
    loginSubmit = event =>{
        var jwt = require('jsonwebtoken');
        var temp = JSON.parse(localStorage.getItem('credentials'))

        var f=null
        temp.forEach(element => {
            try{
                var decoded = jwt.verify(String(element[1]), String(this.state.loginPassword))
            }
            catch(err){
                decoded ={user:'none'}
            }
            if(this.state.loginUserName===decoded.user && element[0]===decoded.user){
                f=element
                localStorage.setItem('current',JSON.stringify(f));
                
            } 
        });
        if(f){
            window.location.replace('/hello')
            
            event.preventDefault()
        }
        else{
            alert('invalid credentials')
        }

    }

    
    signUpSubmit = event =>{
        var jwt = require('jsonwebtoken');
        var f=0;
        if(localStorage.getItem('credentials')==null){
            localStorage.setItem('credentials',JSON.stringify([]))
        }
        var temp = JSON.parse(localStorage.getItem('credentials'))
        if(this.state.signUpPassword === this.state.signUpConfirm){
            temp.forEach(element => {
                if (element[0] === this.state.signUpUserName){
                    f=1;
                }
            });
            if (!f){
                var token = jwt.sign({ user:this.state.signUpUserName }, this.state.signUpPassword);
                temp.push([this.state.signUpUserName,token,this.state.signUpEmail])
                localStorage.setItem('credentials',JSON.stringify(temp))
                alert('SignUp Successfull')
            }
            else{
                alert('username already taken')
            }
        }
        else{
            alert('Password dosent match')
        }
    }

    SignUpPage(){
        return (
            <div className='login-form' id='signup-form'>
                <h2>Sign Up</h2>
                <form className='login-form' onSubmit={this.signUpSubmit} >
                    <div>
                        <label>UserName</label>
                        <input type="text" placeholder="User Name" id='signUpUserName' minLength='3' value={this.state.signUpUserName} onChange={this.handleChange} required/>
                    </div>
                    <div>
                        <label>E-mail</label>
                        <input type="email" placeholder="E-mail" id='signUpEmail' value={this.state.signUpEmail} onChange={this.handleChange} required/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" placeholder="password" id='signUpPassword' minLength='3' value={this.state.signUpPassword} onChange={this.handleChange} required/>
                    </div>
                    <div>
                        <label>confirm Password</label>
                        <input type="password" placeholder="password" id='signUpConfirm' minLength='3' value={this.state.signUpConfirm} onChange={this.handleChange} required/>
                    </div>
                    <input className="submit-button" type="submit" value='SignUp'/>
                </form>
                
            </div>
        )
    }


    render() { 
        return ( 
            <div className='form-container'>
            <h1>React Loginpage</h1>
            <div className='select'>
                <button id='switch-login' onClick={()=>{this.setState({flag:true})}}>Log in</button>
                <button id='switch-signup' onClick={()=> {this.setState({flag:false})}}>Sign UP</button>
            </div>
                {this.state.flag ? this.LoginPage():this.SignUpPage()}
        </div>
         );
    }
}
 
export default SignUp;