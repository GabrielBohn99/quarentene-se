const express = require("express");
const router = express.Router();
const Live = require("../models/live");
const ensureLogin = require("connect-ensure-login");

const uploadCloud = require('../config/cloudinary.js');
const multer = require('multer');
const cloudinary = require('cloudinary');
// const cloudinaryStorage = require('multer-storage-cloudinary');

// capitalize words function
String.prototype.capitalize = function () {
  return this.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};

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
      genreArr.sort();
      res.render("live/lives", { lives, user: req.user, genreArr });
    })
    .catch((error) => console.log(error));
});

// LIVE INFO
router.get("/live/:id", (req, res, next) => {
  const { id } = req.params;

  Live.findById(id)
    .populate("owner")
    .then((live) => {
      if (
        (live.owner &&
          req.user &&
          live.owner._id.toString() === req.user._id.toString()) ||
        (req.isAuthenticated() && req.user.role === "ADMIN")
      ) {
        live.isOwner = true;
      }
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
  genreArr.sort();

  res.render("live/add-live", { user: req.user, genreArr });
});

router.post("/add-live", ensureLogin.ensureLoggedIn(), uploadCloud.single("imgPath"), (req, res, next) => {
  const { genre } = req.body;
  let { name, link, data, time } = req.body;
  name = name.capitalize();

  if (link && !link.includes("http://")) {
    link = "http://" + link;
  }
  
  const imgPath = req.file.url;
  const imgName = req.file.originalname;

  Live.create({ name, data, genre, link, time, owner: req.user._id, imgPath, imgName })
  .then((response) => {
    res.redirect("/lives");
  })
  .catch((error) => console.log(error));
  });
      

// EDIT LIVE ROUTES
router.get(
  "/editar-live/:liveId",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const { liveId } = req.params;
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
    genreArr.sort();

    Live.findById(liveId)
      .then((live) => {
        genreArr = genreArr.filter((elem) => !live.genre.includes(elem));
        res.render("live/edit-live", { live, user: req.user, genreArr });
      })
      .catch((error) => console.log(error));
  }
);

router.post("/editar-live/:liveId", uploadCloud.single("imgPath"), (req, res, next) => {
  const { data, time, link, genre } = req.body;

  let { name } = req.body;
  name = name.capitalize();

  const { liveId } = req.params;

  if (req.file){
    const imgPath = req.file.url;
    const imgName = req.file.originalname;
    Live.findByIdAndUpdate(
      liveId,
      {
        $set: {
          name,
          data,
          time,
          link,
          genre,
          imgPath,
          imgName
        },
      },
      { new: true }
    )
      .then((response) => {
        console.log(response);
        res.redirect(`/live/${liveId}`);
      })
      .catch((error) => console.log(error));
  }
  Live.findByIdAndUpdate(
    liveId,
    {
      $set: {
        name,
        data,
        time,
        link,
        genre,
      },
    },
    { new: true }
  )
    .then((response) => {
      console.log(response);
      res.redirect(`/live/${liveId}`);
    })
    .catch((error) => console.log(error));
});

// DELETE ROUTES
router.get(
  "/delete-live/:liveId",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const { liveId } = req.params;
    Live.findByIdAndDelete(liveId)
      .then((response) => {
        res.redirect("/lives");
      })
      .catch((error) => console.log(error));
  }
);

// Filter routes

router.post("/lives/search", (req, res, next) => {
  let { genre, name, data } = req.body;

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
  console.log(genre);
  genreArr.sort();
  if (genre.length < 1) {
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
    return;
  }

  Live.find({
    genre: { $in: genre },
    data: { $regex: data, $options: "i" },
    name: { $regex: name, $options: "i" },
  })
    .sort({ data: 1 })
    .then((lives) => {
      console.log("foi removido:", genre)
      if (!Array.isArray(genre)) {
        genreArr = genreArr.filter((elem) => !genre.includes(elem));
        let buscado = "Buscado";
        res.render("live/lives", {
          data,
          genreOne: genre,
          lives,
          genreArr,
          user: req.user,
          buscado,
          name,
        });
        return;
      } else {
        genreArr = genreArr.filter((elem) => !genre.includes(elem));
        let buscado = "Buscado";
        res.render("live/lives", {
          data,
          genre,
          lives,
          genreArr,
          user: req.user,
          buscado,
          name,
        });
      }
    })
    .catch((error) => console.log(error));
});

module.exports = router;
