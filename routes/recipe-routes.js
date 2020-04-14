const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const ensureLogin = require("connect-ensure-login");

// RECIPES ROUTES

router.get("/receitas", (req, res, next) => {
  Recipe.find()
    .then((receitas) => {
      let levelArr = ["Fácil", "Médio", "Avançado"];
      let durationArr = ["10min - 30min", "30min - 60min", "+60min"];
      let categoryArr = ["Salgado", "Doce"];
      res.render("recipes/recipes", {
        receitas,
        user: req.user,
        levelArr,
        durationArr,
        categoryArr,
      });
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
    Recipe.findByIdAndUpdate(
      id,
      { $push: { review: { user: req.user.username, comment } } },
      { new: true }
    )
      .then((response) => {
        res.redirect(`/receita/${id}`);
      })
      .catch((error) => console.log(error));
  }
);

// ADD RECIPE
router.get("/add-receita", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("recipes/add-recipe", { user: req.user });
});

router.post("/add-recipe", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const { name, duration, category, prepare, level } = req.body;

  Recipe.create({ name, duration, category, prepare, level })
    .then((response) => {
      res.redirect("/receitas");
    })
    .catch((error) => console.log(error));
});

// Filter routes

router.post("/receitas/search", (req, res, next) => {
  let { level, search, duration, category } = req.body;

  let levelArr = ["Fácil", "Médio", "Avançado"];
  if (level != "") {
    levelArr.splice(levelArr.indexOf(level), 1);
    return;
  }

  let durationArr = ["10min - 30min", "30min - 60min", "+60min"];
  if (duration != "") {
    durationArr.splice(durationArr.indexOf(duration), 1);
    return;
  }

  let categoryArr = ["Salgado", "Doce"];
  if (category != "") {
    categoryArr.splice(categoryArr.indexOf(category), 1);
    return;
  }

  // console.log(level, search, duration);
  Recipe.find({
    level: { $regex: level },
    duration: { $regex: duration },
    name: { $regex: search, $options: "i" },
    category: { $regex: category } ,
  })
    .then((receitas) => {
      let buscado = "Buscado";
      res.render("recipes/recipes", {
        receitas,
        levelArr,
        level,
        durationArr,
        duration,
        categoryArr,
        category,
        user: req.user,
        buscado,
        search,
      });
    })
    .catch((error) => console.log(error));
});

module.exports = router;
