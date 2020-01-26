const key = 'cybersrikanth'
const express = require('express');
const cors = require('cors')
const app = express();
const User = require('./model/User')
const Group = require('./model/Group')
const Grpmsg = require('./model/Grpmsg')
const Messages = require('./model/Message')
const fs = require('fs')
const base_url=require('./config/host')

const Message = Messages.Message
const getContacts = Messages.contacts
const initialfetch = Messages.initialfetch
const markAsRead = Messages.markAsRead

var multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./Images')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
        // fileName=''
    }
})
// var fileName;
var upload = multer({storage:storage});

require('express-ws')(app);
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080)
console.log('listining in port 8080')

const jwt= require('jsonwebtoken')

app.use( express.json({limit:'1mb'}));
app.use(express.urlencoded({ extended: false }))
app.use('/images', express.static(__dirname + '/Images'));
app.use(cors())


var sockets={}
init=()=>{
    const user = new User()
    user.getAllPhone().then(res=>{
        res.details.forEach(element=>{
            createSocket(element.phone)
        })
    })
}
init()

createSocket=(phone)=>{
    if(!sockets[phone])
            {
                console.log('creating socket for',phone)
                sockets[phone]=io.of(phone).on('connection', function (socket) {
                    console.log('connection got',phone)

                    socket.on('init',(data)=>{
                        getInit(data.token).then(res => {
                            socket.emit('initial-response',res)
                        })
                    })

                    socket.on('chat-message',(data)=>{
                        console.log('recived payload',data)
                        if(Number(data.msg.to)){
                            newmessage(data).then(res =>{
                                console.log('...',res)
                                socket.emit('chat-message-response',res)
                            })
                        }
                        else{
                            newGroupMessage(data).then(res=>{
                                if(res){
                                    socket.emit('chat-message-response',{status:res})
                                }
                            })
                        }

                    })
                    socket.on('newchat',(data)=>{
                        console.log('new chat',data)
                        newchat(data).then(res => {
                            console.log('response for new chat',res)
                            socket.emit('newchat-response',res)
                        }
                        )
                    })

                    socket.on('set-flag-2',(data)=>{
                        sockets[data.to].emit('set-flag-2',data.from)
                    })
                    socket.on('create-group',(data)=>{
                        createGroup(data).then(res => {
                            socket.emit('create-group-response',res.status)
                        })
                    })
                    socket.on('add-member-to-group',(data)=>{
                        addMembers(data).then(res =>{
                            socket.emit('add-to-group-response',res)
                            if(res.status){
                                getnewgrp(data).then(res=>{
                                    sockets[data.phone].emit('new-incoming-group',res)
                                })
                            }
                        })
                    })
                    // socket.on('i-recived',(data)=>{

                    // })
                  });
            }
}



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

app.post('/signup',upload.single('img'),(req,res)=>{
    user= new User();
    user.name=req.body.name;
    user.phone=req.body.phone;
    user.password=req.body.password;
    if(req.file)
    user.profile=req.file.originalname;
    user.create().then(
        log =>{
            // phone = req.body.phone
            if(log.status) createSocket(req.body.phone)
            res.send(log)
        });

})

newGroupMessage=(data)=>{
    let dt;
    return new Promise((resolve,reject)=>{
        try{
            const from = jwt.verify(data.token,key)
            var msg = new Grpmsg()
            var grp = new Group()
            // console.log(data.msg.to)
            grp.grpid = data.msg.grpto
            msg.grpFrom = from.userid
            msg.grpTo = data.msg.grpto
            data.msg.payload.groupFrm = from.phone
            grp.get().then(res=>{
                if(data.msg.payload.media){
                    dt = new Date().getTime().toString()
                    fs.appendFileSync('Images/msg/'+dt, new Buffer(data.msg.payload.media));
                }
                
                msg.message = data.msg.payload.message
                msg.media = (dt)?dt:''
                data.msg.payload.media = msg.media
                res.id.forEach(element=>{
                    sockets[element.phone].emit('chat-message',data.msg)
                })
                msg.send().then(out =>{
                    resolve (out)
                })
            })

        }
        catch{
            resolve({status:false,details:'token verify failed'})
        }
    })
}

getnewgrp=(data)=>{
    return new Promise((resolve,reject)=>{
        var grp = new Group()
        grp.getGrp(data.grpid,data.phone).then(res=>
            resolve(res)
        )
    })
}

createGroup= (data)=>{
    return new Promise((resolve,reject)=>{
        try{
            const from = jwt.verify(data.token,key)
            var grp = new Group()
            grp.admin = from.userid
            grp.name = data.group
            grp.create().then(log=>
                resolve(log))
        }
        catch{
            reject ({status:false,details:'cannot verify token'})
        }
    })
}

addMembers = (data) =>{
    try{
        const from = jwt.verify(data.token,key)
        return new Promise((resolve,reject)=>{
            var user = new User()
            user.phone = data.phone
            user.get().then(res =>{
                if(res.status){
                    // data[id=res.data.userid
                    user.userid=res.userid
                    if(res.data.phone==from.phone){
                        resolve({status:false,details:'You already in group'})
                    }
                    else{
                        user.addToGroup(data.grpid,res.data.userid).then( out=>
                            resolve(out)
                        )
                    }
                }
                else{
                    resolve ({status:false,details:'cannot find user'})
                }
            })
        })
    }
    catch{
        resolve({status:false,details:'token verify failed'})
    }

}

newchat = (data)=>{
    return new Promise((resolve,reject)=>{
        var user = new User()
        try{
            const from = jwt.verify(data.token,key)
            console.log('token verified')
            user.phone = data.phone
            user.id = data.id
            console.log(data)
            if (data.phone!=from.phone)
            {
                user.get().then((log) =>{
                    if(log.status)
                    resolve ({
                        status:true,
                        data:{
                        userid:log.data.userid,
                        phone:log.data.phone,
                        name:log.data.name,
                        profile:log.data.profile
                    }})
                    else{
                        resolve (log)
                    }
                })
            }
            else{
            resolve ({status:false,details:'you cannot send message to yourself'})
            }
        }
        catch{
            resolve ({status:false, details:'could not verify token'})
        }
    })
   
}

getInit=(token)=>{
    return new Promise((resolve,reject)=>{
        try{
            const from = jwt.verify(token,key)
            console.log('token verified')
            let user = new User()
            user.userid = from.userid
            user.getContacts().then(res=>{
                if(res.status){
                    user.getGroups().then((res1)=>{
                        if(res1.status){
                            const contacts = {status:true,data:res.data.concat(res1.data)}
                            let prom=[]
                            let chat = {}
                            contacts.data.forEach((element)=>{
                                if(element.userid){
                                    prom.push(
                                    initialfetch(from.userid,element.userid,0,0).then(res=>{
                                        chat[element.phone] = res.reverse()
                                        // console.log(res,chat)
                                    }))
                                }
                                else if(element.grpid){
                                    const grp = new Grpmsg()
                                    prom.push(
                                        grp.get(0,element.grpid,0).then(res=>{
                                            chat[element.grpid] = res.reverse()
                                        })
                                    )
                                }
                                

                            })
                            Promise.all(prom).then(res=>{
                                resolve({status:true,data:{contacts:contacts.data,messages:chat}})
                            })
                        }
                    })
                }
            })
        }
        catch{
            resolve ({status:false,details:'cannot verify token'})
        }
    })
    
}

// app.post('/getcontacts',(req,res)=>{
//     try{
//         const from = jwt.verify(req.body.token,key)
//         getContacts(from.userid).then(log =>{
//             res.send({contacts:log})
//                 //creating socket
//                 log.forEach(element=>{

//                     var socketId=(Number(from.phone)<Number(element.phone))?String(from.phone)+'and'+String(element.phone):
//                     String(element.phone)+'and'+String(from.phone)
//                     if(!sockets[socketId])
//                     sockets[socketId]=io.of(socketId).on('connection', function (socket) {
//                         console.log('connection got',socketId)
//                         socket.on('message',(data)=>{
//                             socket.emit('chat-message',data)
//                             console.log('message',socketId,data)
//                         })
//                       });
                    

//                 })
//         })

//     }
//     catch{
//         res.send({status:false,details:'cannot verify'})
//     }
// })
// app.post('/getgroups',(req,res)=>{
//     try{
//         const from = jwt.verify(req.body.token,key)
//         var user = new User()
//         // user.phone = from.phone
//         user.getGroups(from.userid).then(out=> {
//             res.send(out)})
//     }
//     catch{
//         res.send({status:false,details:'cannot verify token'})
//     }
// })

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

app.post('/search',(req,res)=>{
    try{
        const from = jwt.verify(req.body.token,key)
        const to = req.body.id
        if(String(to.length)>5){
            let msg = new Message()
            msg.msgFrm = from.userid
            msg.msgTo = to
            msg.search(req.body.search).then(out=>{
                res.send(out)
            })
        }
    }
    catch{
        res.send({status:false,details:'token cannot be verified'})
    }
})

app.post('/getmedia',(req,res)=>{
    try{
        const from = jwt.verify(req.body.token,key)
        const to = req.body.id
        if(String(to).length>5){
            let msg = new Message()
            msg.msgFrm=from.userid
            msg.msgTo=to
            msg.getmedia().then(out =>{
                res.send(out)
            })
        }
        else{
            let msg = new Grpmsg()
            msg.grpFrom=from.userid
            msg.grpTo=to
            msg.getmedia().then(out =>{
                res.send(out)
            })
        }
    }
    catch{
        res.send({status:false,details:'cannot verify token'})
    }
})

// app.post('/grpmsgfetch',(req,res)=>{
//     try{
//         const from = jwt.verify(req.body.token,key)
//         grp = new Grpmsg()
//         grp.get(req.body.start,req.body.grpid,req.body.msgid).then(out=>
//             res.send(out))
//     }
//     catch{
//         res.send({status:false,details:'cannot verify token'})
//     }
// })


app.post('/markasread',(req,res)=>{
    try{
        const from = jwt.verify(req.body.token,key)
        markAsRead(from.userid,req.body.to)
        
    }
    catch{
        console.log('token cannot be verified')
    }
})



newmessage = (msg)=>{
    let dt;
    // console.log(msg)
    return new Promise((resolve,reject)=>{
        try{
            const from = jwt.verify(msg.token,key)
            var to = new User()
            to.phone = msg.msg.to
            to.get().then(log =>{
                if(msg.msg.payload.media){
                    dt = new Date().getTime().toString()
                    fs.appendFileSync('Images/msg/'+dt, new Buffer(msg.msg.payload.media));
                }
                if(log.status && log.data.userid!=from.userid){
                    message = new Message()
                    message.msgFrm = from.userid
                    message.msgTo = log.data.userid
                    message.message = msg.msg.payload.message
                    message.media = (dt)?dt:''
                    message.send().then(log=>{
                        // var socketId=(Number(from.phone)<Number(msg.phone))?String(from.phone)+'and'+String(msg.phone):
                        // String(msg.phone)+'and'+String(from.phone)
                        // sockets[socketId].send(log)
                        // console.log(log)
                        if(log.status){
                            const temp ={
                                from:from.phone,
                                msg:message.message,
                                timestamp:msg.msg.payload.timestamp,
                                flag:1
                            }
                            msg.msg.payload.media=message.media
                            sockets[msg.msg.to].emit('chat-message',msg.msg)
                        }
                        resolve (log)
                    })
                }
                else{
                    resolve ({status:false,details:'invalid source or destination'})
                }
            })
        }
        catch{
            reject ({status:false,details:'token error'})
        }
    })
    
}


