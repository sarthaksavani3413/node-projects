const AdminModel = require("../models/adminmodel");
const bcrypt = require("bcrypt");
const mailMessage = require("../config/middleware/mailMessage");

// GET login page
module.exports.loginPage = (req, res) => {
  if (!req.cookies.admin?._id) {
    return res.render("Auth/login");
  } else {
    return res.redirect("/admin");
  }
};

// POST login
module.exports.loginUser = async (req, res) => {
  try {
    let adminData = await AdminModel.findOne({ email: req.body.email });
    if (!adminData) return res.redirect("/");

    const match = await bcrypt.compare(req.body.password, adminData.password);
    if (!match) return res.redirect("/");

    res.cookie("admin", adminData);
    return res.redirect("/admin");
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};

// GET logout
module.exports.logoutUser = (req, res) => {
  res.clearCookie("admin");
  return res.redirect("/");
};

// GET forgot password page
module.exports.forgotpassword = (req, res) => {
  return res.render("Auth/forgotpass");
};

// POST send OTP
module.exports.sendMailWithOTP = async (req, res) => {
  try {
    let otp = Math.floor(Math.random() * 10000);
    let msg = {
      from: "savanisarthak275@gmail.com",
      to: req.body.email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is: ${otp}</p>`,
    };
    await mailMessage.sendEmail(msg);

    res.cookie("otp", otp);
    res.cookie("email", req.body.email);
    return res.render("Auth/verifyotp");
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};

// GET verify OTP page
module.exports.verifyotppage = (req, res) => {
  return res.render("Auth/verifyotppage");
};

// POST verify OTP
module.exports.verifyotp = (req, res) => {
  const otp = req.cookies.otp;
  if (otp == req.body.otp) {
    res.clearCookie("otp");
    return res.render("Auth/resetpassword");
  }
  return res.render("Auth/verifyotp");
};

// GET reset password page
module.exports.resetpasswordpage = (req, res) => {
  // check if email cookie exists
  if (!req.cookies.email) return res.redirect("/verifyotppage");
  return res.render("Auth/resetpassword");
};

// POST reset password
module.exports.resetpassword = async (req, res) => {
  try {
    const { newpassword, conformpassword } = req.body;
    if (newpassword !== conformpassword) 
      return res.render("Auth/resetpassword");

    const email = req.cookies.email;
    if (!email) return res.redirect("/verifyotppage");

    const hash = await bcrypt.hash(newpassword, 10);
    await AdminModel.findOneAndUpdate({ email }, { password: hash });

    res.clearCookie("email");
    console.log("Password Reset Successfully");
    return res.redirect("/"); // redirect to login
  } catch (err) {
    console.log(err);
    return res.redirect("/resetpasswordpage");
  }
};

// GET change password page
module.exports.changepasswordpage = (req, res) => {
  const admin = req.cookies.admin;
  return res.render("Auth/changePassword", { admin });
};

// POST change password
module.exports.changepassword = async (req, res) => {
  try {
    const admin = req.cookies.admin;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const match = await bcrypt.compare(oldPassword, admin.password);
    if (!match) return res.redirect("/changepasswordpage");

    if (newPassword !== confirmPassword) return res.redirect("/changepasswordpage");

    const hash = await bcrypt.hash(newPassword, 10);
    await AdminModel.findByIdAndUpdate(admin._id, { password: hash });

    console.log("Password Changed Successfully");
    return res.redirect("/admin");
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};

// GET view profile page
module.exports.viewprofilepage = async (req, res) => {
  try {
    const admin = await AdminModel.findById(req.cookies.admin._id);
    return res.render("Auth/viewProfile", { admin });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};
