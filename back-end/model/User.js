"use strict";
const conn = require('../config/myDb')
const fs = require('fs')
const insert = (phone,password,profile,name)=>{
    return new Promise((resolve, reject) => {
        const q = `INSERT INTO auth (phone,password,profile,name) VALUES ('${phone}','${password}','http://localhost:8080/images/${profile}','${name}')`;
        conn.query(q,(err)=>{
            if(err) {
                reject(false)}
            else 
            resolve(true);
        })
        
    }).catch((err)=>{console.log('catched error in insert',err)}
    )
}
const getUser = (phone,password) =>{
    return new Promise((resolve,reject)=> {
        const q = (password!='')?`select * from auth where phone='${phone}' and password='${password}'`:`select * from auth where phone='${phone}'`
        conn.query(q, (err,result)=>{
            if(err) reject(false)
            else resolve(result)
        })
    }).catch((err)=>{console.log('catch in get user',err)})
}

class User{
    constructor(){
        this.password=''
        this.phone=''
        this.profile=''
        this.name=''
}


    async create(){
        if(this.password.length>4 && String(Number(this.phone)).length>5){
            const dp = (this.profile.length)? this.phone+'.jpg' : 'nodp.webp'
          var g= insert(this.phone,this.password,dp,this.name).then((data) => {
                if(data){
                    if (this.profile.length>0)
                    {
                        var base64Data = this.profile.replace(/^data:image\/jpeg;base64,/, "");

                        fs.writeFile('Images/'+this.phone+'.jpg', base64Data, 'base64', function(err) {
                          if (err) console.log('saving pic error........',err)
    
                        });
                    }
              
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
        var userObj = getUser(this.phone,this.password).then(data =>{
            if (data.length){
                return {status:true, data:data[0]}
            }
            else{
                return {status:false,details:'cannot find user'}
            }
        })
        return await userObj
    }


}

module.exports = User