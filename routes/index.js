const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const multer = require('multer');

router.get("/", (req, res, next) => {
  res.render("index", { user: req.user });
});

router.get("/perfil", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  console.log(req.user);
  res.render("profile", { user: req.user });
});

module.exports = router;
