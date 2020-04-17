const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "../public/uploads/" });

const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");

// nodemailer
const nodemailer = require("nodemailer");

// Sign up route
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", upload.single("imgPath"), (req, res, next) => {
  const { username, email, password } = req.body;
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const confirmationCode = token;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }).then((user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    if (req.file) {
      const newUser = new User({
        username,
        password: hashPass,
        email,
        confirmationCode,
        imgPath: `uploads${req.file.url}`,
        imgName: req.file.originalname,
      });
    }
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode,
    });

    newUser
      .save()
      .then((user) => {
        console.log(user, "criado");

        let transport = nodemailer.createTransport({
          service: "Gmail",
          secure: true,
          auth: {
            user: process.env.GOOGLE_EMAIL,
            pass: process.env.GOOGLE_SENHA,
          },
        });

        transport
          .sendMail({
            from: `"Quarentene-se" <${process.env.GOOGLE_EMAIL}>`,
            to: user.email,
            subject: "Testing Nodemailer",
            text: `http://localhost:3000/confirm/${user.confirmationCode}`,
            html: "<b>FUNCIONOU</b>",
          })
          .then((info) => {
            console.log(info);
            res.redirect("/login");
          })
          .catch((error) => console.log(error));
      })
      .catch((err) => {
        console.log(err);
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  const { confirmCode } = req.params;

  User.findOneAndUpdate(
    { confirmationCode: confirmCode },
    { $set: { status: "Conta ativa" } },
    { new: true }
  )
    .then((user) => {
      console.log(user);
      res.render("confirmation", { user });
    })
    .catch((error) => console.log(error));
});

// Login routes
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/esqueci-minha-senha", (req, res, next) => {
  res.render("auth/forgot");
});

router.post("/esqueci-minha-senha", (req, res, next) => {
  const { email } = req.body;

  console.log(email);

  User.findOne({ email })
    .then((user) => {
      console.log(user);
      let transport = nodemailer.createTransport({
        service: "Gmail",
        secure: true,
        auth: {
          user: process.env.GOOGLE_EMAIL,
          pass: process.env.GOOGLE_SENHA,
        },
      });

      transport
        .sendMail({
          from: `"Quarentene-se" <${process.env.GOOGLE_EMAIL}>`,
          to: user.email,
          subject: "Testing Nodemailer",
          text: `http://localhost:3000/trocar-senha/${user.confirmationCode}`,
          html: `<b>http://localhost:3000/trocar-senha/${user._id}</b>`,
        })
        .then((info) => {
          console.log(info);
          res.redirect("/login");
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

router.get("/trocar-senha/:id", (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  res.render("auth/password", { id });
});

router.post("/trocar-senha/:id", (req, res, next) => {
  const { id } = req.params;

  const { password } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findByIdAndUpdate(id, { $set: { password: hashPass } }, { new: true })
    .then((novo) => {
      console.log(novo)
      console.log("senha mudada");
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
