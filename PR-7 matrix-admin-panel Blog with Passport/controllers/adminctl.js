const moment = require("moment");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const AdminModel = require("../models/adminmodel");

module.exports.godashboard = async (req, res) => {
  try {
    // if (req.cookies.admin && req.cookies.admin._id) {
    // let admin = req.cookies.admin;
    return res.render("dashboard");
    // } else {
    //   return res.redirect("/");
    // }
  } catch (err) {
    console.log(err);
    return res.redirect("/admin");
  }
};

module.exports.addnewadmin = async (req, res) => {
  try {
    // if (req.cookies.admin && req.cookies.admin._id) {
    //   let admin = req.cookies.admin;
    return res.render("addAdmin");
    // } else {
    //   return res.redirect("/");
    // }
  } catch (err) {
    console.log(err);
    return res.redirect("/admin");
  }
};

module.exports.viewnewadmin = async (req, res) => {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    const alladmin = await AdminModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } }
      ]
    });
    // if (req.cookies.admin && req.cookies.admin._id) {
    //   let admin = req.cookies.admin;
    return res.render("viewAdmin", {
      alladmin
    });
    // } else {
    //   return res.redirect("/");
    // }
  } catch (err) {
    console.log(err);
    return res.redirect("/admin");
  }
};



module.exports.insertData = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    if (req.file) {
      req.body.profile = AdminModel.adminimage + "/" + req.file.filename;
    }

    req.body.name = req.body.fname + " " + req.body.lname;

    req.body.created_date = moment().format("YYYY-MM-DD HH:mm:ss");
    req.body.updated_date = moment().format("YYYY-MM-DD HH:mm:ss");

    req.body.password = await bcrypt.hash(req.body.password, 10);

    const adminadd = await AdminModel.create(req.body);

    if (adminadd) {
      req.flash("success", "Admin Add And View Successfully");
      return res.redirect("/admin/viewAdmin");
    } else {
      console.log("Data not inserted");
      return res.redirect("/admin/addAdmin");
    }
  } catch (err) {
    console.log(" Error in insertData:", err);
    return res.redirect("/admin/addAdmin");
  }
};

module.exports.deleteadmin = async (req, res) => {
  try {
    console.log(req.params.adminid);
    let adminrecord = await AdminModel.findById(req.params.adminid);
    if (adminrecord) {
      try {
        let imagepath = path.join(__dirname, "..", adminrecord.profile);
        fs.unlinkSync(imagepath);
      } catch (err) {
        console.log("image not found");
        return res.redirect("/admin/addAdmin");
      }
    }

    let deleteadmin = await AdminModel.findByIdAndDelete(req.params.adminid);
    if (deleteadmin) {
      console.log("Record Deleted");
      return res.redirect("/admin/viewAdmin");
    } else {
      console.log("Record not deleted");
      return res.redirect("/admin/addAdmin");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/admin/addAdmin");
  }
};

module.exports.editadmin = async (req, res) => {
  try {
    let admindata = await AdminModel.findById(req.params.adminid);
    if (admindata) {
      // let admin = req.cookies.admin;
      return res.render("updateAdmin", {
        admindata
      });
    } else {
      console.log("something Wrong");
      return res.redirect("/admin/addAdmin");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/admin/addAdmin");
  }
};

module.exports.updateadmindata = async (req, res) => {
  try {
    let admindata = await AdminModel.findById(req.params.adminid);
    if (admindata) {
      if (req.file) {
        let imagepath = path.join(__dirname, "..", admindata.profile);
        fs.unlinkSync(imagepath);
        req.body.profile = AdminModel.adminimage + "/" + req.file.filename;
      }
    }
    else {
      console.log("something Wrong");
      return res.redirect("/admin/addAdmin");
    }
    req.body.name = req.body.fname + " " + req.body.lname;
    req.body.updated_date = moment().format("YYYY-MM-DD HH:mm:ss");

    let updatedata = await AdminModel.findByIdAndUpdate(req.params.adminid, req.body)
    if (updatedata) {
      console.log("Record Edit Succsessfully")
      return res.redirect("/admin/viewAdmin");
    }
    else {
      console.log("Someething Wrong Record Not Edit")
      return res.redirect("/admin/addAdmin")
    }

  } catch (err) {
    console.log("error", err);
    return res.redirect("/admin/addAdmin");
  }
};
