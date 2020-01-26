
const mysql = require('mysql')


var myDb = mysql.createConnection({
	host :'localhost',
	user :'root',
	password :'Srikanth@29',
	database :'whatsapp2'
});

module.exports = myDb