/* 
set conf postgresql

*/
require("dotenv").config();
const {Pool} = require("pg");
const isProd = process.env.NODE_ENV === "production";
const connetion = `postgres://wcabirzl:h4-XMEJbz84Jbis-iAwGrjkffL7ok6yk@snuffleupagus.db.elephantsql.com/wcabirzl`; 
const  pool = new Pool(
    {
        connectionString: isProd ? process.env.DB_DATABASE_URL : connetion 
    }
)
module.exports = {pool}
