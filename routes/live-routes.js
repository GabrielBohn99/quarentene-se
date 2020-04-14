const express = require("express");
const router = express.Router();
const Live = require("../models/live");
const ensureLogin = require("connect-ensure-login");

// LIVE ROUTES
router.get("/lives", (req, res, next) => {
  Live.find()
    .sort({ data: 1 })
    .then((lives) => {
      let genreArr = [
        "Sertanejo",
        "Blues",
        "Axé",
        "Rock",
        "Country",
        "MPB",
        "Forró",
        "Funk",
        "Pop",
        "Eletrônico",
        "Hip Hop",
        "Gospel",
        "Indie",
        "Folk",
        "Pagode",
        "Rap",
        "Jazz",
        "Música Clássica",
        "Metal",
        "Samba",
        "Reggae",
      ];
      res.render("live/lives", { lives, user: req.user, genreArr });
    })
    .catch((error) => console.log(error));
});

// LIVE INFO
router.get("/live/:id", (req, res, next) => {
  const { id } = req.params;
  Live.findById(id)
    .then((live) => {
      res.render("live/live-detail", { live, user: req.user });
    })
    .catch((error) => console.log(error));
});

router.post(
  "/live-review/:id",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const { id } = req.params;
    const { comment } = req.body;
    Live.findByIdAndUpdate(
      id,
      { $push: { review: { user: req.user.username, comment } } },
      { new: true }
    )
      .then((response) => {
        res.redirect(`/live/${id}`);
      })
      .catch((error) => console.log(error));
  }
);

// ADD LIVE
router.get("/add-live", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let genreArr = [
    "Sertanejo",
    "Blues",
    "Axé",
    "Rock",
    "Country",
    "MPB",
    "Forró",
    "Funk",
    "Pop",
    "Eletrônico",
    "Hip Hop",
    "Gospel",
    "Indie",
    "Folk",
    "Pagode",
    "Rap",
    "Jazz",
    "Música Clássica",
    "Metal",
    "Samba",
    "Reggae",
  ];

  res.render("live/add-live", { user: req.user, genreArr });
});

router.post("/add-live", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const { name, genre } = req.body;
  let { link, data, time } = req.body;
  if (!link.includes("http://")) {
    link = "http://" + link;
  }
  Live.create({ name, data, genre, link, time })
    .then((response) => {
      res.redirect("/lives");
    })
    .catch((error) => console.log(error));
});

// Filter routes

router.post("/lives/search", (req, res, next) => {
  let { genre, name, data } = req.body;

  console.log(genre);

  let genreArr = [
    "Sertanejo",
    "Blues",
    "Axé",
    "Rock",
    "Country",
    "MPB",
    "Forró",
    "Funk",
    "Pop",
    "Eletrônico",
    "Hip Hop",
    "Gospel",
    "Indie",
    "Folk",
    "Pagode",
    "Rap",
    "Jazz",
    "Música Clássica",
    "Metal",
    "Samba",
    "Reggae",
  ];
  if (!genre) {
      Live.find({
        data: { $regex: data, $options: "i" },
        name: { $regex: name, $options: "i" },
      })
        .sort({ data: 1 })
        .then((lives) => {
          let buscado = "Buscado";
          res.render("live/lives", {
            lives,
            genreArr,
            user: req.user,
            buscado,
            name,
          });
        })
        .catch((error) => console.log(error));
    }

    Live.find({
      genre,
      data: { $regex: data, $options: "i" },
      name: { $regex: name, $options: "i" },
    })
      .sort({ data: 1 })
      .then((lives) => {
        let buscado = "Buscado";
        res.render("live/lives", {
          lives,
          genreArr,
          user: req.user,
          buscado,
          name,
        });
      })
      .catch((error) => console.log(error));
});

module.exports = router;
