
const mysql = require('mysql')


var myDb = mysql.createConnection({
	host :'localhost',
	user :'root',
	password :'Srikanth@29',
	database :'whatsapp'
});

module.exports = myDb