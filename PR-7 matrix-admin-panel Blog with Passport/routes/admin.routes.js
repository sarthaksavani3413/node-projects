const express=require("express")
const routes=express.Router();
const adminmodel=require("../models/adminmodel")
const admintl=require("../controllers/adminctl");

routes.get("/adminpage",admintl.godashboard)
routes.get("/addAdmin",admintl.addnewadmin)
routes.get("/viewAdmin",admintl.viewnewadmin)
routes.get("/",admintl.godashboard)
routes.post("/insertadmin",adminmodel.uploadadminimage,admintl.insertData)
routes.get("/editadmin/:adminid",admintl.editadmin)
routes.post("/updateadmin/:adminid",adminmodel.uploadadminimage,admintl.updateadmindata)
routes.get("/deleteadmin/:adminid",admintl.deleteadmin)

module.exports = routes;