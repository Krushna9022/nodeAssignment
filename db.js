const mysql=require("mysql")
const conn= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"krushna",
    database:"nodelearning"
})

conn.connect(err=>{
    if(!err)
    {
        console.log("db connected");
    }
})

module.exports=conn;