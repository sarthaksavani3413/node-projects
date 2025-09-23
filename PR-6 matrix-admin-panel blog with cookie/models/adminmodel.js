const mongoose = require("mongoose");
const multer=require("multer")
const path=require("path")
const adminpath="/uploads/adminimages"

const adminSchema =  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    qualification: {
        type:Array,   
    },
    message: {
        type: String,
        required: true
    },
    profile: {
        type: String,     
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    created_date: {
        type: String,  
        required: true
    },
    updated_date: {
        type: String,   
        required: true
    }
}); 

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"..",adminpath))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname +"-"+Date.now())
    }
})

adminSchema.statics.uploadadminimage = multer({storage:storage}).single("profile");
adminSchema.statics.adminimage=adminpath;

const AdminModel = mongoose.model("Admin", adminSchema);
module.exports = AdminModel;
