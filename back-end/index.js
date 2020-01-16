const key = 'cybersrikanth'
const express = require('express');
const cors = require('cors')
const app = express();
const User = require('./model/User')
const Messages = require('./model/Message')
const Message = Messages.Message
const getContacts = Messages.contacts
const initialfetch = Messages.initialfetch
const markAsRead = Messages.markAsRead

const jwt= require('jsonwebtoken')

app.use( express.json({limit:'1mb'}));
app.use(express.urlencoded({ extended: false }))
app.use('/images', express.static(__dirname + '/Images'));
app.use(cors())
// app.use((req,res)=>{
//     res.header('Access-Controll-Allow-Origin','*')
//     res.header('Access-Controll-Allow-Headers','*')
// })



app.post('/login',(req,res)=>{
    user = new User();
    user.phone = req.body.phone
    user.password = req.body.password
    user.get().then(log=>{  
        if(log.status){
            const token = jwt.sign({
                userid:log.data.userid,
                phone:log.data.phone,
                name:log.data.name,
                profile:log.data.profile
            },key)
            res.send(
                {
                    status:true,
                    data:token

                });
        }

        else
            res.send(log)
    })
})

app.post('/signup',(req,res)=>{
    user= new User();
    user.name=req.body.name;
    user.phone=req.body.phone;
    user.password=req.body.password;
    user.profile=req.body.profile;
    user.create().then(
        log =>{
            res.send(log)
        });

})

app.post('/newchat',(req,res)=>{
    var user = new User()
    try{
        const from = jwt.verify(req.body.token,key)
        user.phone = req.body.phone
        if (req.body.phone!=from.phone)
        {
            user.get().then(log =>{
                if(log.status)
                res.send({
                    status:true,
                    data:{
                    userid:log.data.userid,
                    phone:log.data.phone,
                    name:log.data.name,
                    profile:log.data.profile
                }})
                else
                res.send(log)
            })
        }
        else{
        res.send({status:false,details:'you cannot send message to yourself'})
        }
    }
    catch{
        res.send({status:false, details:'could not verify token'})
    }
})

app.post('/getcontacts',(req,res)=>{
    try{
        const from = jwt.verify(req.body.token,key)
        getContacts(from.userid).then(log =>{
            res.send({contacts:log})
        })
    }
    catch{
        res.send({status:false,details:'cannot verify'})
    }
})

app.post('/initialfetch',(req,res)=>{
    try{
        const from = jwt.verify(req.body.token,key)
        initialfetch(from.userid,req.body.to,req.body.start,req.body.msgid).then(log=>
            res.send(log))
    }
    catch{
        res.send({status:false,details:'cannot fetch message'})
    }
})

app.post('/markasread',(req,res)=>{
    try{
        const from = jwt.verify(req.body.token,key)
        markAsRead(from.userid,req.body.to)
        
    }
    catch{
        console.log('token cannot be verified')
    }
})

app.post('/newmessage',(req,res)=>{
    try{
        const from = jwt.verify(req.body.token,key)
        var to = new User()
        to.phone = req.body.phone
        to.get().then(log =>{
            if(log.status && log.data.userid!=from.userid){
                message = new Message()
                message.msgFrm = from.userid
                message.msgTo = log.data.userid
                message.message = req.body.message
                message.send().then(log=>{
                    res.send(log)
                })
            }
            else{
                res.send({status:false,details:'invalid source or destination'})
            }
        })
    }
    catch{
        res.send({status:false,details:'token error'})
    }
})


app.listen(8080)
console.log('listining in port 8080')