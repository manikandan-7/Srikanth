"use strict";
const conn = require('../config/myDb')

// const getMyContacts=(userid,flag)=>{
//     var q = 
// }

const contacts = (userid)=>{
    return new Promise((resolve,reject)=>{
        var q = `select userid,phone,profile,name from auth where userid in (select msgFrm  from msg where msgTo=${userid} union select msgTo  from msg where msgFrm=${userid})`;
        conn.query(q,(err,result)=>{
            if(err) reject(err)
            else {
                resolve(result)
        }})
    }).catch((err)=>{
        console.log('error while getting contacts',err)
    })
}

const insert = (msgFrm,msgTo,message,flag)=>{
    return new Promise((resolve,reject)=>{
        var q = `insert into msg (msgFrm, msgTo, message, flag) values ('${msgFrm}','${msgTo}','${message}','${flag}')`
        conn.query(q,(err)=>{
            if(err) reject(false)
            else resolve(true)
        })
    }).catch((err)=>{
        console.log('error while creating message',err)
    })
}

const markAsRead =(from,to)=>{
        var q = `update msg set flag=3,timestamp=timestamp where (msgFrm=${to} and msgTo=${from})`;
        conn.query(q,(err)=>{
            if(err) console.log('cannot mark as read',err)
        })
   
}

const initialfetch=(userid,to,start=0,msgid=false)=>{
    return new Promise((resolve,reject)=>{
        if(!msgid){
            var delevered = `update msg set flag=2,timestamp=timestamp where (msgTo=${userid}) and flag<2`;
            conn.query(delevered,(err)=>{
                if(err) console.log('cannot mark as deleverd',err)
            })
        }
        var q = (!msgid)?`select * from msg where (msgFrm=${userid} and msgTo=${to}) or (msgFrm=${to} and msgTo=${userid}) order by timestamp desc limit ${start},10`
        : `select * from msg where ((msgFrm=${userid} and msgTo=${to}) or (msgFrm=${to} and msgTo=${userid})) and msgid<${msgid} order by timestamp desc limit  10`
            conn.query(q,(err,result)=>{
                if(err) reject(err)
                else {
                    resolve(result)
                }
            })
        })

    .catch(
        (err)=>{console.log('caught error while fetching initial message',err)}
    )
}

class Message{
    constructor(){
        this.msgFrm=''
        this.msgTo=''
        this.message=''
        this.flag=1
    }
    
    async send(){
        if(this.message!=undefined && this.message.trim().length)
        {
            var result = insert(this.msgFrm,this.msgTo,this.message,this.flag).then(res =>{
                if(res){
                    return {status:true}
                }
                else{
                    return {status:false}
                }
            })
            return await result
        }
        else{
            return {status:false}
        }
    }



}

module.exports = {Message,contacts,initialfetch,markAsRead}