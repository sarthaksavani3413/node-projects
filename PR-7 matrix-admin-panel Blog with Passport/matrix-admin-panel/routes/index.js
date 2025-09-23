const express = require("express");
const { loginUser, loginPage, logoutUser, forgotpassword, sendMailWithOTP, verifyotp, verifyotppage, resetpassword, resetpasswordpage, changepasswordpage, changepassword, viewprofilepage } = require("../controllers/authctl");
const passport = require("passport");
const localpassport = require("../config/middleware/localpassport");
const routes = express.Router();

routes.use("/admin", localpassport.checkadmin, require("./admin.routes"))
routes.use("/blog", require("./blog.routes"))
routes.get('/', loginPage)
routes.post(
    '/login',
    passport.authenticate('local', { failureRedirect: "/" }),
    loginUser
);
routes.get('/logout', logoutUser)
routes.get('/forgotpassword', forgotpassword)
routes.post('/sendMailWithOTP', sendMailWithOTP)
routes.get("/verifyotppage", verifyotppage)
routes.post("/verifyotp", verifyotp)
routes.post("/resetpassword", resetpassword)
routes.get("/resetpasswordpage", resetpasswordpage)
routes.get("/changepasswordpage", changepasswordpage)
routes.post("/change-password", changepassword)
routes.get("/viewprofilepage", viewprofilepage);
module.exports = routes;