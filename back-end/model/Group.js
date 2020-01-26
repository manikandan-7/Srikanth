const conn = require('../config/myDb')

const insert = (name,admin)=>{
    return new Promise((resolve, reject) => {
        const q = `INSERT INTO grp (name,admin) VALUES ('${name}','${admin}')`;
        conn.query(q,(err)=>{
            if(err) {
                reject(false)}
            else {
                conn.query('select LAST_INSERT_ID()',(err,res)=>{
                    if(err){
                        reject (false)
                    }
                    else{
                        var z = `insert into grpdetails (usr,grp,admin) values ('${admin}','${res[0]['LAST_INSERT_ID()']}',${true})`
                        // console.log(z)
                        conn.query(z,(err1,res1)=>{
                            if(err1) reject('err ocrd...',err1)
                            else resolve({
                                    status:true,
                                    grp:{
                                        grpid:res[0]['LAST_INSERT_ID()'],
                                        name:name
                                        }
                                })
                        })

                        // conn.query(`update user set flag=3,timestamp=timestamp where (msgFrm=${to} and msgTo=${from})`)
                        // resolve (true);
                    }
                })
            }
        })
        
    }).catch((err)=>{console.log('catched error in insert',err)}
    )
}

class Group{
    constructor(){
        this.grpid=''
        this.admin = ''
        this.name = ''
    }
    async create(){
        var temp = insert(this.name,this.admin,JSON.stringify(this.members)).then(res => {
            return {status:res}
        })
        return await temp
    }
    async get(){
        return new Promise((resolve,reject)=>{
            conn.query(`select distinct auth.phone from auth inner join grpdetails on auth.userid=grpdetails.usr where grpdetails.grp=${this.grpid}`,(err,res)=>{
                if(err) resolve({status:false,details:'cannot get group id'})
                else resolve({status:true,id:res})
            })
        })
    }
    getGrp(grpid,phone){
        return new Promise((resolve,reject)=>{
            conn.query(`select grp.grpid,grp.name,grpdetails.admin from grp inner join grpdetails on grp.grpid= grpdetails.grp inner join auth on  auth.userid= grpdetails.usr where auth.phone= ${phone} and grp.grpid=${grpid}`,(err,res)=>{
                if(err) console.log('error in getting grp')
                else{
                    resolve(res)
                }
            })
        })
    }

    getMembers(){
        return new Promise((resolve,reject)=>{
            conn.query(`select members from grp where name='${this.name}'`,(err,res)=>{
                if(err) resolve({status:false,details:err})
                else resolve({status:true,res:res})
            })
        })
    }

}

module.exports = Group