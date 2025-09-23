const passport = require("passport");
const mailMessage = require("../config/middleware/mailMessage");
const AdminModel = require("../models/adminmodel");
const bcrypt = require("bcrypt");

module.exports.loginPage = (req, res) => {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/admin");
    } else {
      return res.render("Auth/login");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/admin/addAdmin");
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    let adminData = await AdminModel.findOne({ email: req.body.email });
    if (adminData) {
      let matchPass = await bcrypt.compare(
        req.body.password,
        adminData.password
      );
      if (matchPass) {
        res.cookie("admin", adminData);
        req.flash("success", "Login Successfully ✅");   // flash add
        console.log("Login successfully");
        return res.redirect("/admin");
      } else {
        console.log("Password not match");
        return res.redirect("/");
      }
    } else {
      console.log("Admin not found");
      return res.redirect("/");
    }
  } catch (err) {
    console.log("Erorr Find");
    return res.redirect("/admin/addAdmin");
  }
};

module.exports.logoutUser = (req, res, next) => {
  // पहले flash store कर दो
 

  // अब logout कर दो
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
       req.flash("success", "Logout Successfully ✅");
      return res.redirect("/");
    }
    console.log("Logout successfully");
    
    // redirect होने पर flash render होगा
    res.redirect("/");
  });
};



module.exports.forgotpassword = async (req, res) => {
  try {
    return res.render("Auth/forgotpass");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

module.exports.sendMailWithOTP = async (req, res) => {
  try {
    let admin = await AdminModel.findOne({ email: req.body.email })
    if (!admin) {
      return res.redirect("/")
    }
    let otp = Math.floor(Math.random() * 10000);

    let msg = {
      from: "savanisarthak275@gmail.com",
      to: `${req.body.email}`,
      subject: "Demo",
      html: `<p>Hello..Cofeee Helloo...HealthyFood  </p>
        <p>Your Otp is:- ${otp}</p>
      `,
    };
    await mailMessage.sendEmail(msg);
    res.cookie('otp', otp)
    res.cookie('email', req.body.email)
    return res.render("Auth/verifyotp")
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

module.exports.verifyotp = async (req, res) => {
  try {
    let otp = req.cookies.otp;
    if (otp == req.body.otp) {
      res.clearCookie('otp')
      return res.render("Auth/resetpassword")
    }
    else {
      return res.render("Auth/verifyotp");
    }
  } catch (error) {
    console.log("All Error")
  }
}

module.exports.verifyotppage = async (req, res) => {
  try {
    return res.render("Auth/verifyotppage");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// ===== Reset Password Page (GET) =====
module.exports.resetpasswordpage = async (req, res) => {
  try {
    // यहाँ सिर्फ form render होगा
    return res.render("Auth/resetpassword");
  } catch (error) {
    console.log("Reset Password Page Error:", error);
    return res.redirect("/");
  }
};

// ===== Reset Password Logic (POST) =====
module.exports.resetpassword = async (req, res) => {
  try {
    let { newpassword,conformpassword } = req.body;

    // Empty check
    if (!newpassword || !conformpassword) {
      console.log("Password fields empty");
      return res.render("Auth/resetpassword", { error: "Password fields cannot be empty" });
    }

    // Password match check
    if (newpassword !== conformpassword) {
      console.log("Passwords do not match");
      return res.render("Auth/resetpassword", { error: "Passwords do not match" });
    }

    // Email cookie check
    let email = req.cookies.email;
    if (!email) {
      console.log("Email Not Found");
      return res.redirect("/verifyotppage");
    }

    // Hash password
    let hashpass = await bcrypt.hash(newpassword, 10);

    // Update in DB
    await AdminModel.findOneAndUpdate({ email }, { password: hashpass });

    // Clear cookies after success
    res.clearCookie("otp");
    res.clearCookie("email");

    console.log("Password Reset Done ✅");
    return res.redirect("/"); // login page पर redirect
  } catch (error) {
    console.log("Reset Password Error:", error);
    return res.redirect("/resetpasswordpage");
  }
};

module.exports.changepasswordpage = async (req, res) => {
  try {
    let admin = req.cookies.admin;
    return res.render("Auth/changePassword", { admin })
  } catch (error) {
    console.log("Change Password Error:", error);
    return res.redirect("/");
  }
};

module.exports.changepassword = async (req, res) => {
  try {
    let admin = req.cookies.admin;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    let matchPassword = await bcrypt.compare(oldPassword, admin.password);
    if (matchPassword) {
      if (newPassword === confirmPassword) {
        let hashpass = await bcrypt.hash(newPassword, 10);
        await AdminModel.findByIdAndUpdate(admin._id, { password: hashpass });
        console.log("Password Change Successfully");
        return res.redirect("/admin");
      } else {
        console.log("New Password and Confirm Password do not match");
        return res.redirect("/changePassword");
      }
    } else {
      console.log("Old Password is incorrect");
      return res.redirect("/changePassword");
    }
  } catch (error) {
    console.log("Change Password Error:", error);
    return res.redirect("/");
  }
}

module.exports.viewprofilepage = async (req, res) => {
  try {
    let adminId = req.cookies.admin;
    const admin = await AdminModel.findById(adminId);
    return res.render("Auth/viewProfile", { admin })
  } catch (error) {
    console.log("View Profile Error:", error);
    return res.redirect("/");
  }
};