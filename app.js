require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("hbs");
const favicon = require("serve-favicon");

const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const flash = require("connect-flash");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) =>
    console.log(`Connected to mongo database name: ${x.connections[0].name}`)
  )
  .catch((error) => console.log("Error connecting to mongo", error));

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express vire engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Session config
app.use(
  session({
    secret: "quarentene-se",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport config
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

app.use(flash());

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, next) => {
      User.findOne({ username }, (err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(null, false, { message: "Incorrect username" });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return next(null, false, { message: "Incorrect password" });
        }

        return next(null, user);
      });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = "Quarentene-se";

// Getting routes
const index = require("./routes/index");
const auth = require("./routes/auth-routes");
const recipe = require("./routes/recipe-routes");
const lives = require("./routes/live-routes");
const series = require("./routes/serie-routes");
app.use("/", auth);
app.use("/", recipe);
app.use("/", lives);
app.use("/", series);
app.use("/", index);

module.exports = app;
