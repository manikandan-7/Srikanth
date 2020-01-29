"use strict";
const conn = require('../config/myDb')

class Contacts{
    constructor(){
        this.contactFor=''
        this.contactWith=''
        this.name=''
        this.theme=''
    }
    update(){
        return new Promise(resolve=>{
            conn.query(`update contacts set name='${this.name}' where contactFor=${this.contactFor} and contactWith=${this.contactWith}`,(err,res)=>{
                if(err) resolve({status:false,details:'cannot update name'})
                else resolve({status:true})
            })
        })
    }
    setTheme(){
        return new Promise(resolve=>{
            conn.query(`update contacts set theme='${this.theme}' where contactFor='${this.contactFor}' and contactWith='${this.contactWith}'`),(err,res)=>{
                if(err) resolve({status:false,details:'error ocured while seting theme'})
                else resolve({status:true})
            }
        })
    }
    insert(){
        return new Promise((resolve)=>{
            conn.query(`select * from contacts where contactFor=${this.contactFor} and contactWith=${this.contactWith}`,(err,res)=>{
                if(err) resolve ({status:false,details:'cannot check entries'})
                else{
                    if(res.length){
                        resolve({status:false,details:'user already in contact'})
                    }
                    else{
                        const q = `insert into contacts (contactFor,contactWith,name) values ('${this.contactFor}','${this.contactWith}','${this.name}')`
                        // console.log(q)
                        conn.query(q,(err,res)=>{
                            if(err) resolve({status:false,details:'cannot add contacts'})
                            else resolve({status:true})
                        })
                    }
                }
            })

        })
    }
}

module.exports = Contacts