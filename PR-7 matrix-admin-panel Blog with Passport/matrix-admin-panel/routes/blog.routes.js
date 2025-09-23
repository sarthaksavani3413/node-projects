const express = require("express");
const routes = express.Router();
const blogmodel = require("../models/blogmodel");
const blogctl = require("../controllers/blogctl");

routes.get("/addBlog", blogctl.addblog);
routes.post("/insertblog", blogmodel.uploads, blogctl.insertblog);
routes.get("/viewBlog", blogctl.viewblog);
routes.post("/delete/:id", blogctl.deleteblog);
routes.get("/edit/:id", blogctl.editBlogPage);
routes.post("/update/:id", blogmodel.uploads, blogctl.updateBlog);
routes.get("/detail/:id", blogctl.detailBlog);

module.exports = routes;
