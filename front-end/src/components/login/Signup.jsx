import React,{Component} from 'react'
// import axios from 'axios'
import './Login.css'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'


// const image2base64 = require('image-to-base64')

class Signup extends Component {
    constructor(){
        super()
        this.state={
            phone:'',
            password:'',
            confirm:'',
            name:'',
            profile:'',
            loginPhone:'',
            loginPassword:''
        }
    }



    login=(e)=>{
        fetch(this.props.host+'/login',{
            method:'POST',
            mode:'cors',
            headers:{'Content-Type': 'application/json; charset=utf-8'},
            body:JSON.stringify({
                'phone':this.state.loginPhone,
                'password':this.state.loginPassword
            })
            
        }).then(res => res.json())
        .then(data => {
            if (data.status){
                localStorage.setItem('whatsapp',JSON.stringify(data.data))
                this.props.history.push('/')
                // (<Redirect to="/"/>)
            }
            else{
                alert('invalid credentials')
            }
        })
    }
    

    signup=(e)=>{
        let data = new FormData()
        data.append('phone',this.state.phone)
        data.append('password',this.state.password)
        data.append('name',this.state.name)
        if(this.state.profile)
        data.append('img',this.state.profile,this.state.phone)
        fetch(this.props.host+'/signup',{
            method:'POST',
            mode:'cors',
            // file:{
            //     img:this.state.profile
            // },
           
            body:data
            
        }).then(res => res.json())
        .then(data => {
            if(data.status){
                alert('signup successful')
            }
            else{
                alert('signup failed', data.details)
            }
        })    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    // toBase64 = file => new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => resolve(reader.result);
    //     reader.onerror = error => reject(error);
    // });

    handleProfileChange=(e)=>{

    
        this.setState({
            profile:e.target.files[0]
        })
        // this.toBase64(e.target.files[0]).then(
        //     res=>{
        //         this.setState({
        //             profile: res
        //         })

        //     }
        // )l
    }

    render() { 
        if(localStorage.getItem('whatsapp')){
            return(
                <Redirect to='/'/>
            )
        }
        return ( 
            <>
                <div className='WhatsappWeb'>
                    <div>
                        <i class="fab fa-whatsapp"></i>
                        <span>Whatsapp Web</span>
                    </div>
                     
                    <form class='LoginForm'>
                        <input type='text' name='loginPhone' value={this.state.loginPhone} onChange={this.handleChange} placeholder='Mobile Number'/>
                        <input type='password' name='loginPassword' value={this.state.loginPassword} onChange={this.handleChange} placeholder='password'/>
                        <input type='button' onClick={this.login} value='Login'/>
                    </form>
                </div> 
                <form className='SignUpForm'>
                    <h3>SignUp</h3>
                    <input type='text' name='phone' value={this.state.phone} onChange={this.handleChange} placeholder='Mobile Number' required/>
                    <input type='password' name='password' value={this.state.password} onChange={this.handleChange} placeholder='password' required/>
                    <input type='password' name='confirm' value={this.state.confirm} onChange={this.handleChange} placeholder='confirm password' required/>
                    <input type='text' name='name' value={this.state.name} onChange={this.handleChange} placeholder='name'/>
                    <input type='file' name='profile'  onChange={this.handleProfileChange} />
                    <input type='button' value='SignUp' onClick={this.signup}/>
                </form>
            </>
         );
    }
}
const mapStateToProps = (state) => { return { host:state.host }}
export default connect(mapStateToProps) (Signup);