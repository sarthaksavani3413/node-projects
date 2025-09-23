const flash = require("connect-flash")

module.exports.setflashmessage = (req,res,next) => {
    res.locals.flash = {
        'success' : 'suceesfully',
        'error' : 'try again',
        "warning" : 'sometimes',
        success:req.flash('success')
    }
    next();
}