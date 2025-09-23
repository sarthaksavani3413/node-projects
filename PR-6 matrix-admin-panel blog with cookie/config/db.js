const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://sarthak:sarthak3413@cluster0.kjayzfe.mongodb.net/admin-panel")

const db=mongoose.connection;

db.once("open",(err)=>{
    if(err){
        console.log(err)
        return;
    }
    console.log("Databse Connected")
})
module.exports=db;