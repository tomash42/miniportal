/* 
set conf postgresql

*/

require("dotenv").config();
const {Pool} = require("pg");
const isProd = process.env.NODE_ENV === "production";
const connetion = `postgres://tomek:YWrlikObqWwNJAqFSZMtVOP5q0mTSh4e@dpg-cet8951a6gdut0o9avcg-a/rekrutacja`; 
const  pool = new Pool(
    {
        connectionString: isProd ? process.env.DB_DATABASE_URL : connetion 
    }
)
module.exports = {pool}
