const express = require("express");
const router = express.Router();


const uploadCloud = require('../config/cloudinary.js');
const multer = require('multer');
const cloudinary = require('cloudinary');

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

router.post("/signup", uploadCloud.single("imgPath"), (req, res, next) => {
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

  User.findOne({ $or: [{username}, {email}] }).then((user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    let imgPath = ''

    if(req.file){
      imgPath = req.file.url;
    } else {
      imgPath = 'https://res.cloudinary.com/juliajforesti/image/upload/v1587155241/quarentene-se/smile_il469c.png'
    }

      const newUser = new User({
        username,
        password: hashPass,
        email,
        confirmationCode,
        imgPath,
      })
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
        transport.sendMail({
          from: `"Quarentene-se " <${process.env.GOOGLE_EMAIL}>`,
          to: user.email, 
          subject: 'Obrigado por se cadastrar no Quarentene-se', 
          text: `http://localhost:3000/confirm/${user.confirmationCode}`,
          html: `<link
          href="https://fonts.googleapis.com/css?family=Cuprum&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <style type="text/css">
          body,
          #body_style {
            width: 100% !important;
            background: #d7dee3;
            font-family: "Curpum", sans-serif;
            color: #f3f1ea;
            line-height: 1;
          }
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
    
          body {
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
          }
    
          body,
          img,
          div,
          p,
          ul,
          li,
          span,
          strong,
          a {
            margin: 0;
            padding: 0;
          }
    
          table {
            border-spacing: 0;
          }
    
          table td {
            border-collapse: collapse;
          }
    
          a {
            color: #6c6a68;
            text-decoration: none;
            outline: none;
          }
    
          a[href^="tel"],
          a[href^="sms"] {
            text-decoration: none;
            color: #000000;
          }
    
          img {
            display: block;
            border: none;
            outline: none;
            text-decoration: none;
          }
    
          table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          @media screen and (max-width: 639px) {
            body[yahoo] .wrapper-main {
              width: 100% !important;
            }
            body[yahoo] .side-1 {
              max-width: 300px !important;
            }
            body[yahoo] .three-side-1 {
              max-width: 200px !important;
            }
            body[yahoo] .themefont {
              font-size: 26px !important;
            }
            body[yahoo] .img-scale {
              max-width: 100% !important;
              height: auto !important;
            }
          }
          @media screen and (max-width: 599px) {
            body[yahoo] .wrapper {
              width: 100% !important;
            }
            body[yahoo] .nav-font {
              font-size: 13px !important;
            }
            body[yahoo] .hide {
              display: none !important;
            }
          }
        </style>
      </head>
    
      <body
        style="font-family: 'Cuprum', sans-serif; font-size: 14px; color: #6c6a68; background-color: #e7ebee;<!--  background: url(images/bg.jpg) center top no-repeat; --> margin: 0; width:100% !important; "
        yahoo="fix"
      >
        <table
          width="640"
          border="0"
          cellspacing="0"
          cellpadding="0"
          align="center"
          class="wrapper-main"
          style="width: 640px; margin: 0 auto; -webkit-text-size-adjust: 100%;"
        >
          <tr>
            <td
              background="images/bg1.jpg"
              style="
                background-repeat: no-repeat;
                background-color: #090408;
                background-position: center top;
                background-image: url(images/bg1.jpg);
                background-size: cover;
              "
              valign="top"
            >
              <div>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td height="82">
                      <img
                        src="images/blank.gif"
                        width="1"
                        height="1"
                        alt=""
                        border="0"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        color: #f74646;
                        font-size: 36px;
                        font-family: 'Cuprum', cursive;
                        text-align: center;
                      "
                    >
                      Quarentene-se
                    </td>
                  </tr>
                  <tr>
                    <td height="11">
                      <img
                        src="images/blank.gif"
                        width="1"
                        height="1"
                        alt=""
                        border="0"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        font-weight: 700;
                        font-family: 'Cuprum', serif;
                        text-transform: uppercase;
                        color: #ffffff;
                        font-size: 60px;
                        text-align: center;
                      "
                    >
                      Confirmar email
                    </td>
                  </tr>
                  <tr>
                    <td height="33">
                      <img
                        src="images/blank.gif"
                        width="1"
                        height="1"
                        alt=""
                        border="0"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table
                        width="207"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        align="center"
                      >
                        <tr>
                          <td height="45" style="border: 1px solid #fff;">
                            <a
                              href="http://localhost:3000/confirm/${user.confirmationCode}"
                              style="
                                font-family: 'Cuprum', serif;
                                text-align: center;
                                display: block;
                                line-height: 45px;
                                color: #fff;
                                text-decoration: none;
                                font-size: 16px;
                                text-transform: capitalize;
                              "
                              >Confirmar</a
                            >
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="101">
                      <img
                        src="images/blank.gif"
                        width="1"
                        height="1"
                        alt=""
                        border="0"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
    
          <tr>
            <td style="background-color: #eef2f5;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="font-size: 0; text-align: center">
                    <table class="three-side-1" style="display: inline-block; max-width: 215px; width: 100%; vertical-align: top" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="20"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                        <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td height="55"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                          <tr>
                            <td align="center"><img src="images/icon1.png" width="49" height="37" alt="" border="0" style="display: block;" /></td>
                          </tr>
                          <tr>
                            <td height="33"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                          <tr>
                            <td style="font-weight: 700; text-transform: uppercase; line-height: 30px; font-family: 'Cuprum', serif; color: #1c1e20; font-size: 17px; text-align: center;">Series</td>
                          </tr>
                          <tr>
                            <td height="9"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                          <tr>
                            <td style="line-height: 25px; font-family: 'Cuprum', sans-serif; color: #828689; font-size: 13px; text-align: center;">Veja dicas de series e filmes para assitir durante esse período.</td>
                          </tr>
                          <tr>
                            <td height="59"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                        </table></td>
                        <td width="15"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                      </tr>
                    </table>
                    <table class="three-side-1" style="display: inline-block; max-width: 210px; width: 100%; vertical-align: top" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="15"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                        <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td height="49"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                          <tr>
                            <td align="center"><img src="images/icon2.png" width="50" height="50" alt="" border="0" style="display: block;" /></td>
                          </tr>
                          <tr>
                            <td height="27"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                          <tr>
                            <td style="font-weight: 700; text-transform: uppercase; line-height: 30px; font-family: 'Cuprum', serif; color: #1c1e20; font-size: 17px; text-align: center;">Receitas</td>
                          </tr>
                          <tr>
                            <td height="9"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                          <tr>
                            <td style="line-height: 25px; font-family: 'Cuprum', sans-serif; color: #828689; font-size: 13px; text-align: center;">Veja receitas faceis e práticas para os dias monótonos.</td>
                          </tr>
                          <tr>
                            <td height="59"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                        </table></td>
                        <td width="15"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                      </tr>
                    </table><!--[if (gte mso 9)|(IE)]>
                    </td>
    
                    <td width="215"  valign="top">
                    <![endif]-->
                    <table class="three-side-1" style="display: inline-block; max-width: 215px; width: 100%; vertical-align: top" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="15"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                        <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td height="49"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                          <tr>
                            <td align="center"><img src="images/icon3.png" width="50" height="50" alt="" border="0" style="display: block;" /></td>
                          </tr>
                          <tr>
                            <td height="27"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                          <tr>
                            <td style="font-weight: 700; text-transform: uppercase; line-height: 30px; font-family: 'Cuprum', serif; color: #1c1e20; font-size: 17px; text-align: center;">Lives</td>
                          </tr>
                          <tr>
                            <td height="9"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                          <tr>
                            <td style="line-height: 25px; font-family: 'Cuprum', sans-serif; color: #828689; font-size: 13px; text-align: center;">Se prepare para as melhores lives que teremos!</td>
                          </tr>
                          <tr>
                            <td height="59"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                          </tr>
                        </table></td>
                        <td width="20"><img src="images/blank.gif" width="1" height="1" alt="" border="0" /></td>
                      </tr>
                    </table></td>
                  </tr>
                </table></td>
              </tr>
            </table></td>
          </tr>
      </body>`
        })
        .then(info => {
          console.log(info);
          res.redirect("/login");
          })  
        .catch(error => console.log(error))
        
      })
      .catch((err) => {
        console.log(err);
        res.render("auth/signup", { message: "Something went wrong" });
      });
    // }
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
      res.redirect("/perfil" );
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
          subject: "Quarentene-se - Troca de senha",
          text: `http://localhost:3000/trocar-senha/${user.confirmationCode}`,
          html: `<link
          href="https://fonts.googleapis.com/css?family=Cuprum&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <style type="text/css">
          body,
          #body_style {
            width: 100% !important;
            background: #d7dee3;
            font-family: "Cuprum", sans-serif;
            color: #f3f1ea;
            line-height: 1;
          }
          .ExternalClass {
            width: 100%;
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%;
          }
    
          body {
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
          }
    
          body,
          img,
          div,
          p,
          ul,
          li,
          span,
          strong,
          a {
            margin: 0;
            padding: 0;
          }
    
          table {
            border-spacing: 0;
          }
    
          table td {
            border-collapse: collapse;
          }
    
          a {
            color: #6c6a68;
            text-decoration: none;
            outline: none;
          }
    
          a[href^="tel"],
          a[href^="sms"] {
            text-decoration: none;
            color: #000000;
          }
    
          img {
            display: block;
            border: none;
            outline: none;
            text-decoration: none;
          }
    
          table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          @media screen and (max-width: 639px) {
            body[yahoo] .wrapper-main {
              width: 100% !important;
            }
            body[yahoo] .side-1 {
              max-width: 300px !important;
            }
            body[yahoo] .three-side-1 {
              max-width: 200px !important;
            }
            body[yahoo] .themefont {
              font-size: 26px !important;
            }
            body[yahoo] .img-scale {
              max-width: 100% !important;
              height: auto !important;
            }
          }
          @media screen and (max-width: 599px) {
            body[yahoo] .wrapper {
              width: 100% !important;
            }
            body[yahoo] .nav-font {
              font-size: 13px !important;
            }
            body[yahoo] .hide {
              display: none !important;
            }
          }
        </style>
      </head>
    
      <body
        style="font-family: 'Cuprum', sans-serif; font-size: 14px; color: #6c6a68; background-color: #e7ebee;<!--  background: url(images/bg.jpg) center top no-repeat; --> margin: 0; width:100% !important; "
        yahoo="fix"
      >
        <table
          width="640"
          border="0"
          cellspacing="0"
          cellpadding="0"
          align="center"
          class="wrapper-main"
          style="width: 640px; margin: 0 auto; -webkit-text-size-adjust: 100%;"
        >
          <tr>
            <td
              background="images/bg1.jpg"
              style="
                background-repeat: no-repeat;
                background-color: #090408;
                background-position: center top;
                background-image: url(images/bg1.jpg);
                background-size: cover;
              "
              valign="top"
            >
              <div>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td height="82">
                      <img
                        src="images/blank.gif"
                        width="1"
                        height="1"
                        alt=""
                        border="0"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        color: #f74646;
                        font-size: 36px;
                        font-family: 'Cuprum';
                        text-align: center;
                      "
                    >
                      Quarentene-se
                    </td>
                  </tr>
                  <tr>
                    <td height="11">
                      <img
                        src="images/blank.gif"
                        width="1"
                        height="1"
                        alt=""
                        border="0"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        font-weight: 700;
                        font-family: 'Cuprum';
                        text-transform: uppercase;
                        color: #ffffff;
                        font-size: 60px;
                        text-align: center;
                      "
                    >
                      Trocar senha
                    </td>
                  </tr>
                  <tr>
                    <td height="33">
                      <img
                        src="images/blank.gif"
                        width="1"
                        height="1"
                        alt=""
                        border="0"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table
                        width="207"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        align="center"
                      >
                        <tr>
                          <td height="45" style="border: 1px solid #fff;">
                            <a
                              href="http://localhost:3000/trocar-senha/${user._id}"
                              style="
                                font-family: 'Cuprum';
                                text-align: center;
                                display: block;
                                line-height: 45px;
                                color: #fff;
                                text-decoration: none;
                                font-size: 16px;
                                text-transform: capitalize;
                              "
                              >Clique aqui</a
                            >
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="101">
                      <img
                        src="images/blank.gif"
                        width="1"
                        height="1"
                        alt=""
                        border="0"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
      </body>`,
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
