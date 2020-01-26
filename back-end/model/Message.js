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

const insert = (msgFrm,msgTo,message,flag,media)=>{
    return new Promise((resolve,reject)=>{
        var q = `insert into msg (msgFrm, msgTo, message, flag, media) values ('${msgFrm}','${msgTo}','${message}','${flag}','${media}')`
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
        this.media=''
        this.msgFrm=''
        this.msgTo=''
        this.message=''
        this.flag=1
    }
    
    async search(search){
        return new Promise((resolve,reject)=>{
            // const q = `select * from msg where ((msgFrm=${this.msgFrm} and msgTo=${this.msgTo}) || (msgFrm=${this.msgTo} and msgTo=${this.msgFrm})) and message like '%${search}%' order by timestamp`
            const q = `select * from msg inner join auth on (msg.msgFrm=auth.userid or msg.msgTo=auth.userid) where ((msgFrm=${this.msgFrm} and auth.phone=${this.msgTo}) || (auth.phone=${this.msgTo} and msgTo=${this.msgFrm})) and message like '%${search}%' order by timestamp`
            conn.query(q,(err,res)=>{
                // console.log(q)
                if(err) resolve({status:false,details:'error in search'})
                else resolve({status:true,details:res})
            })
        })
    }

    async send(){
        if(this.message!=undefined)
        {
            var result = insert(this.msgFrm,this.msgTo,this.message,this.flag,this.media).then(res =>{
                if(res){
                    return {status:true,to:this.msgTo}
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

    getmedia(){
        return new Promise((resolve,reject)=>{
            conn.query(`select msg.media from msg inner join auth on (msg.msgFrm=auth.userid || msg.msgTo=auth.userid) where ((msg.msgFrm=${this.msgFrm} && auth.phone=${this.msgTo}) ||(auth.phone=${this.msgTo} && msg.msgTo=${this.msgFrm})) && media!=''`,(err,res)=>{
                if(err) resolve('cannot get media',err)
                else{
                    
                    var arr=[];
                    res.forEach(element => {
                        arr.push(element.media)
                    });
                    resolve (arr)
                }
            })
        })
    }

}

module.exports = {Message,contacts,initialfetch,markAsRead}