"use strict";
const conn = require('../config/myDb')
const base_url=require('../config/host')
const fs = require('fs')
const insert = (phone,password,profile,name)=>{
    return new Promise((resolve, reject) => {
        const q = `INSERT INTO auth (phone,password,profile,name) VALUES ('${phone}','${password}','${profile}','${name}')`;
        console.log(q)
        conn.query(q,(err)=>{
            if(err) {
                reject(false)}
            else 
            resolve(true);
        })
        
    }).catch((err)=>{console.log('catched error in insert',err)}
    )










}

const getUser = (phone,password,id) =>{
    return new Promise((resolve,reject)=> {
        const q = (password!='')?`select * from auth where phone='${phone}' and password='${password}'`:`select * from auth where phone='${phone}' || userid='${id}'`
        console.log(q)
        conn.query(q, (err,result)=>{
            if(err) reject(false)
            else resolve(result)
        })
    }).catch((err)=>{console.log('catch in get user',err)})
}

class User{
    constructor(){
        this.id=''
        this.password=''
        this.phone=''
        this.profile=''
        this.name=''
}

    updateName(){
        const q = `update auth set name='${this.name}' where userid='${this.id}'`
        return new Promise((resolve)=>{
            conn.query(q,(err,res)=>{
                if(err) resolve ({status:false,details:'error in updating name'})
                else resolve ({status:true})
            })
        })
    }
    async getGroups(){
        const q = ` select grp.grpid,grp.name,grpdetails.admin from grp inner join grpdetails on grp.grpid=grpdetails.grp where grpdetails.usr='${this.userid}'`
        return new Promise((resolve,reject)=>{
            conn.query(q,(err,res)=>{
                if(err) console.log('cannot fetch group list')
                else{
                    resolve({status:true,data:res})
                        
                    }
                }
            )}
        )
    }

    async create(){
        if(this.password.length>4 && String(Number(this.phone)).length>5){
            const dp = (this.profile.length)? this.phone : 'nodp.webp'
          var g= insert(this.phone,this.password,dp,this.name).then((data) => {
                if(data){
              
                    return {status:true}

                }
                else{
                    return {status:false,details:'user already exist'}
                }
          })
          return await g
        }
        else{
            return {status:false, details:'please check password and phone number'}
        }
    }

    async get(){
        var userObj = getUser(this.phone,this.password,this.id).then(data =>{
            if (data.length){
                return {status:true, data:data[0]}
            }
            else{
                return {status:false,details:'cannot find user'}
            }
        })
        return await userObj
    }
    async addToGroup(grpid,usrid){
        return new Promise((resolve,reject)=>{
            conn.query(`select * from grpdetails where usr=${usrid} && grp=${grpid}`,(err,res)=>{
                if (err) console.log('error occured',err)
                else{
                    if(!res.length){
                        conn.query(`insert into grpdetails (grp,usr,admin) values (${grpid},${usrid},${false})`,(err,res)=>{
                            if(err) console.log('error caught....',err)
                            else {
                                console.log('user added to group...')
                                resolve({status:true})
                            }
                        })
                    }
                    else{
                        resolve({status:false,details:'user already in group'})
                    }
                }
            })
        })
    }
    async getusers(ids){
        return new Promise((resolve,reject)=>{
            conn.query(`select phone from auth where userid in (${String(ids)})`,(err,res)=>{
                console.log(`select phone from auth where userid in (${String(ids)})`)
                if(err) resolve ({status:false,details:'error'})
                else{
                    var temp=[]
                    res.forEach(element => {
                        temp.push(element.phone)
                    });
                    resolve({status:true,users:temp})
            }})
        })
    }

    getAllPhone(){
        return new Promise((resolve,reject)=>{
            conn.query('select phone from auth where userid>0',(err,res)=>{
                if(err) resolve({status:false,details:'error in getAllPhone'})
                else resolve({status:true,details:res})
            })
        })
    }

    getContacts(){
        return new Promise((resolve,reject)=>{
            // const q = `select distinct auth.* from auth inner join msg on (msg.msgFrm=auth.userid || msg.msgTo=auth.userid) where (msg.msgFrm=${this.userid} || msg.msgTo=${this.userid}) && auth.userid!=${this.userid};`
            const q = `select distinct auth.userid,auth.phone,auth.profile,contacts.name,contacts.theme from auth inner join msg on (msg.msgFrm=auth.userid || msg.msgTo=auth.userid) inner join contacts on (contacts.contactFor=auth.userid || contacts.contactWith=auth.userid) where (msg.msgFrm=${this.userid} || msg.msgTo=${this.userid}) && auth.userid!=${this.userid} && contacts.contactFor=${this.userid};`
            conn.query(q,(err,res)=>{
                if (err) resolve({status:false,details:err})
                else resolve({status:true,data:res})
            })
        })
    }

}

module.exports = User