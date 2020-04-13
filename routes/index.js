const express = require("express");
const router = express.Router();
const Serie = require("../models/serie");
const Recipe = require("../models/recipe");
const Live = require("../models/live");
const ensureLogin = require("connect-ensure-login");

router.get("/", (req, res, next) => {
  res.render("index", { user: req.user });
});

// Series routes
router.get("/series", (req, res, next) => {
  Serie.find()
    .then((series) => {
      //   console.log(series);
      res.render("serie/series", { series, user: req.user });
    })
    .catch((error) => console.log(error));
});

// SERIE INFO
router.get("/serie/:id", (req, res, next) => {
  const { id } = req.params;

  Serie.findById(id)
    .then((serie) => {
      res.render("serie/serie-detail", { serie, user: req.user });
    })
    .catch((error) => console.log(error));
});

router.post(
  "/serie-review/:id",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const { id } = req.params;
    const { comment } = req.body;
    // console.log(req.user.username)
    Serie.findByIdAndUpdate(
      id,
      { $push: { review: { user: req.user.username, comment } } },
      { new: true }
    )
      .then((response) => {
        console.log(response);
        res.redirect(`/serie/${id}`);
      })
      .catch((error) => console.log(error));
  }
);

// ADD SERIE
router.get("/add-serie", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("serie/add-serie", { user: req.user });
});

router.post("/add-serie", (req, res, next) => {
  const { name, resume, rating, genre } = req.body;

  Serie.create({ name, resume, rating, genre })
    .then((response) => {
      console.log(response);
      res.redirect("/series");
    })
    .catch((error) => console.log(error));
});

// nome do cantor - dia/hora - link - estilo musical

// RECIPES ROUTES
router.get("/receitas", (req, res, next) => {
  Recipe.find()
    .then((receitas) => {
      //   console.log(receitas);
      res.render("recipes/recipes", { receitas, user: req.user });
    })
    .catch((error) => console.log(error));
});

// RECIPE INFO
router.get("/receita/:id", (req, res, next) => {
  const { id } = req.params;

  Recipe.findById(id)
    .then((recipe) => {
      res.render("recipes/recipe-detail", { recipe, user: req.user });
    })
    .catch((error) => console.log(error));
});

router.post(
  "/recipe-review/:id",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const { id } = req.params;
    const { comment } = req.body;
    // console.log(req.user.username)
    Recipe.findByIdAndUpdate(
      id,
      { $push: { review: { user: req.user.username, comment } } },
      { new: true }
    )
      .then((response) => {
        // console.log(response);
        res.redirect(`/receita/${id}`);
      })
      .catch((error) => console.log(error));
  }
);

// ADD RECIPE
router.get("/add-receita", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("recipes/add-recipe", { user: req.user });
});

router.post("/add-recipe", (req, res, next) => {
  const { name, duration, category, prepare, level } = req.body;

  Recipe.create({ name, duration, category, prepare, level })
    .then((response) => {
      //   console.log(response);
      res.redirect("/receitas");
    })
    .catch((error) => console.log(error));
});

router.post("/filter-recipes", (req, res, next) => {
  const { level } = req.body;
  console.log(level);
  Recipe.find({ level: level })
    .then((receitas) => {
      console.log(receitas);
      res.render("recipes/recipes", { receitas, user: req.user });
    })
    .catch((error) => console.log(error));
});

// LIVE ROUTES
router.get("/lives", (req, res, next) => {
  Live.find()
    .then((lives) => {
      //   console.log(receitas);
      res.render("live/lives", { lives, user: req.user });
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
    // console.log(req.user.username)
    Live.findByIdAndUpdate(
      id,
      { $push: { review: { user: req.user.username, comment } } },
      { new: true }
    )
      .then((response) => {
        // console.log(response);
        res.redirect(`/live/${id}`);
      })
      .catch((error) => console.log(error));
  }
);

// ADD LIVE
router.get("/add-live", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("live/add-live", { user: req.user });
});

router.post("/add-live", (req, res, next) => {
  const { name, genre } = req.body;
  let { link, data, time } = req.body;
  //   console.log(data);
  if (!link.includes("http://")) {
    link = "http://" + link;
  }

  Live.create({ name, data, genre, link, time })
    .then((response) => {
      //   console.log(response);
      res.redirect("/lives");
    })
    .catch((error) => console.log(error));
});

module.exports = router;
