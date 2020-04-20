const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const ensureLogin = require("connect-ensure-login");

const uploadCloud = require("../config/cloudinary.js");
const multer = require("multer");
const cloudinary = require("cloudinary");

String.prototype.capitalize = function () {
  return this.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};

// Checking role
const checkRoles = (role) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      req.logout();
      res.redirect("/");
    }
  };
};

// RECIPES ROUTES

router.get("/receitas", (req, res, next) => {
  Recipe.find()
    .then((receitas) => {
      let levelArr = ["Fácil", "Médio", "Avançado"];
      let durationArr = ["10min - 30min", "30min - 60min", "mais de 60min"];
      let categoryArr = ["Salgado", "Doce", "Bebida"];
      receitas = receitas.filter((item) => item.post);
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
    .populate("owner")
    .then((receita) => {
      if (
        (receita.owner &&
          req.user &&
          receita.owner._id.toString() === req.user._id.toString()) ||
        (req.isAuthenticated() && req.user.role === "ADMIN")
      ) {
        receita.isOwner = true;
      }
      res.render("recipes/recipe-detail", { receita, user: req.user });
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

router.post(
  "/add-receita",
  ensureLogin.ensureLoggedIn(),
  uploadCloud.single("imgPath"),
  (req, res, next) => {
    const { duration, category, level } = req.body;

    let { name, prepare } = req.body;
    name = name.capitalize();

    let imgPath = "";

    if (req.file) {
      imgPath = req.file.url;
    } else {
      imgPath =
        "https://res.cloudinary.com/juliajforesti/image/upload/v1587393449/quarentene-se/cook-icon_siyirz.png";
    }

    Recipe.create({
      name,
      duration,
      category,
      prepare,
      level,
      owner: req.user._id,
      imgPath,
    })
      .then((response) => {
        res.redirect("/receitas");
      })
      .catch((error) => console.log(error));
  }
);

// EDIT RECIPE
router.get("/editar-receita/:receitaId", (req, res, next) => {
  // ensureLogin.ensureLoggedIn(), checkAdmin,
  const { receitaId } = req.params;
  let levelArr = ["Fácil", "Médio", "Avançado"];
  let durationArr = ["10min - 30min", "30min - 60min", "mais de 60min"];
  let categoryArr = ["Salgado", "Doce", "Bebida"];

  Recipe.findById(receitaId)
    .then((receita) => {
      console.log(levelArr, durationArr, categoryArr);
      levelArr.splice(levelArr.indexOf(receita.level), 1);
      durationArr.splice(durationArr.indexOf(receita.duration), 1);
      categoryArr.splice(categoryArr.indexOf(receita.category), 1);
      res.render("recipes/edit-recipe", {
        receita,
        user: req.user,
        durationArr,
        categoryArr,
        levelArr,
      });
    })
    .catch((error) => console.log(error));
});

router.post(
  "/editar-receita/:receitaId",
  uploadCloud.single("imgPath"),
  (req, res, next) => {
    const { duration, category, level } = req.body;

    let { name, prepare } = req.body;
    name = name.capitalize();
    prepare = prepare.capitalize();

    const { receitaId } = req.params;

    if (req.file) {
      const imgPath = req.file.url;
      const imgName = req.file.originalname;

      Recipe.findByIdAndUpdate(
        receitaId,
        {
          $set: {
            name,
            duration,
            category,
            prepare,
            level,
            imgPath,
            imgName,
          },
        },
        { new: true }
      )
        .then((response) => {
          console.log(response);
          res.redirect(`/receita/${receitaId}`);
        })
        .catch((error) => console.log(error));
    }
    Recipe.findByIdAndUpdate(
      receitaId,
      {
        $set: {
          name,
          duration,
          category,
          prepare,
          level,
        },
      },
      { new: true }
    )
      .then((response) => {
        console.log(response);
        res.redirect(`/receita/${receitaId}`);
      })
      .catch((error) => console.log(error));
  }
);

// DELETE ROUTES
router.get("/delete-recipe/:receitaId", (req, res, next) => {
  // ensureLogin.ensureLoggedIn(), checkAdmin,

  const { receitaId } = req.params;
  Recipe.findByIdAndDelete(receitaId)
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
    // return;
  }

  let durationArr = ["10min - 30min", "30min - 60min", "mais de 60min"];
  if (duration != "") {
    durationArr.splice(durationArr.indexOf(duration), 1);
    // return;
  }

  let categoryArr = ["Salgado", "Doce", "Bebida"];
  if (category != "") {
    categoryArr.splice(categoryArr.indexOf(category), 1);
    // return;
  }

  // console.log(level, search, duration);
  Recipe.find({
    level: { $regex: level },
    duration: { $regex: duration },
    name: { $regex: search, $options: "i" },
    category: { $regex: category },
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

router.get(
  "/post-recipe/:id",
  ensureLogin.ensureLoggedIn(),
  checkRoles("ADMIN"),
  (req, res, next) => {
    const { id } = req.params;
    Recipe.findByIdAndUpdate(id, { $set: { post: true } }, { new: true })
      .then((response) => {
        res.redirect("/admin");
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
