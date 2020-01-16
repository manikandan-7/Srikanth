var conn = require('../config/myDb')

conn.connect((err)=>{
	if(err) console.log('db conn error (file db_init.js)');
	else{
		var msg= `CREATE TABLE msg (msgid INT AUTO_INCREMENT PRIMARY KEY,msgFrm INT, msgTo INT, CONSTRAINT msgFrm FOREIGN KEY (msgFrm) REFERENCES auth(userid), CONSTRAINT msgTo FOREIGN KEY (msgTo) REFERENCES auth(userid), message VARCHAR(512), timestamp TIMESTAMP, flag INT(1))`
		var auth = `CREATE TABLE auth (userid INT AUTO_INCREMENT PRIMARY KEY, phone varchar(13) UNIQUE, password varchar(100),profile varchar(50), name varchar(25))`
		 
		conn.query(auth,(error,result)=>{
			if(error) console.log('table create error (file db_init.js)')
			else{
				console.log('table created auth')
			}
		})

		conn.query(msg,(error,result)=>{
			if(error) console.log('table create error (file db_init.js)')
			else{
				console.log('table created msg')
			}
		})
	}
})