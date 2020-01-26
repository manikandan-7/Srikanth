"use strict";
const conn = require('../config/myDb')

const insert = (grpFrom,grpTo,media,message,flag)=>{
    return new Promise((resolve,reject)=>{
        var q = `insert into grpmsg (grpFrom, grpTo,media, message, flag) values ("${grpFrom}","${grpTo}","${media}","${message}","${flag}")`
        conn.query(q,(err)=>{
            if(err) reject(err)
            else resolve(true)
        })
    }).catch((err)=>{
        console.log('error while creating message',err)
    })
}

class Grpmsg{
    constructor(){
        this.grpFrom=''
        this.grpTo=''
        this.media=''
        this.message=''
        this.flag=1
    }
    async send(){
        var out = insert(this.grpFrom,this.grpTo,this.media,this.message,this.flag).then(res =>{
            console.log('res',res)
            return res
        })
        return await out
    }
    async get(start=0,grpid,msgid=0){
        console.log(msgid)
        return new Promise((resolve,reject)=>{
            var q = (!Number(msgid)>0)?`select grpmsg.*,auth.phone as groupFrm from grpmsg inner join auth on grpmsg.grpFrom=auth.userid  where grpTo=${grpid} order by timestamp desc limit ${start},10`
            : `select * from grpmsg where grpTo=${grpid} and msgid<${msgid} order by timestamp desc limit  10`
            console.log(q)
            conn.query(q,(err,result)=>{
                if(err) resolve(err)
                else {
                    resolve(result)
                }
            })
        })
    }
    getmedia(){
        return new Promise((resolve,reject)=>{
            conn.query(`select grpmsg.media from auth join grpmsg on grpmsg.grpFrom=auth.userid where (grpTo=${this.grpTo}) && media!=''`,(err,res)=>{
                if(err) {
                    console.log(err)
                    resolve('cannot get media',err)
                }
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

module.exports = Grpmsg