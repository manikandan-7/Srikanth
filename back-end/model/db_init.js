var conn = require('../config/myDb')

conn.connect((err)=>{
	if(err) console.log('db conn error (file db_init.js)');
	else{
		var auth = `CREATE TABLE auth 
		(
			userid INT AUTO_INCREMENT PRIMARY KEY, 
			phone varchar(13) UNIQUE, 
			password varchar(100),
			profile varchar(50), 
			name varchar(25)
		)`
		var msg= `CREATE TABLE msg 
		(
			msgid INT AUTO_INCREMENT PRIMARY KEY,
			msgFrm INT, 
			msgTo INT,
			CONSTRAINT msgFrm FOREIGN KEY (msgFrm) REFERENCES auth(userid), 
			CONSTRAINT msgTo FOREIGN KEY (msgTo) REFERENCES auth(userid), 
			message VARCHAR(512), 
			media varchar(100),
			timestamp TIMESTAMP, 
			flag INT(1)
		)`
		var grp = `create table grp
		(
			grpid int auto_increment primary key,
			name varchar(60),
			admin int,
			constraint admin foreign key (admin) references auth(userid)
		)`
		var grpmsg = `create table grpmsg
		(
			msgid int auto_increment primary key,
			grpFrom int,
			constraint grpFrom foreign key (grpFrom) references auth(userid),
			grpTo int,
			constraint grpTo foreign key (grpTo) references grp(grpid),
			message varchar(512),
			media varchar(100),
			timestamp timestamp,
			flag int(1)
		)`

		var grpdetails = `create table grpdetails
		(
			usr int,
			constraint usr foreign key (usr) references auth(userid),
			grp int,
			constraint grp foreign key (grp) references grp(grpid),
			admin boolean
		)`

		Array(auth,msg,grp,grpmsg,grpdetails).forEach(element => {
			conn.query(element,(error,result)=>{
				if(error) console.log('table create error (file db_init.js)',error.sqlMessage)
				else{
					console.log('table created')
				}
			})
		});
		 

	}
})