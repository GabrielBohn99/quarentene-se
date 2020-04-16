const express = require("express");
const router = express.Router();
const Serie = require("../models/serie");
const ensureLogin = require("connect-ensure-login");

// ROLES control

const checkRoles = (role) => {
    return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
        return next();
    } else {
        req.logout();
        res.redirect('/login')
    }
    }
}

const checkGuest = checkRoles('GUEST');
const checkAdmin = checkRoles('ADMIN');

// Series routes
router.get("/series", (req, res, next) => {
    Serie.find()
    .sort({ rating: -1 })
    .then((series) => {
        let genreArr = [
        "Ação",
        "Animação",
        "Aventura",
        "Comédia",
        "Comédia romantica",
        "Cult",
        "Documentário",
        "Drama",
        "Espionagem",
        "Erótico",
        "Fansatia",
        "Faroeste",
        "Ficção científica",
        "Série",
        "Guerra",
        "Musical",
        "Policial",
        "Romance",
        "Suspense",
        "Terror",
        "Trash",
    ];
    res.render("serie/series", { series, user: req.user, genreArr });
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
    let genreArr = [
        "Ação",
        "Animação",
        "Aventura",
        "Comédia",
        "Comédia romantica",
        "Cult",
        "Documentário",
        "Drama",
        "Espionagem",
        "Erótico",
        "Fansatia",
        "Faroeste",
        "Ficção científica",
        "Série",
        "Guerra",
        "Musical",
        "Policial",
        "Romance",
        "Suspense",
        "Terror",
        "Trash",
    ];
    res.render("serie/add-serie", { user: req.user, genreArr });
});

router.post("/add-serie", (req, res, next) => {
    // ensureLogin.ensureLoggedIn(), 
    const { name, resume, rating, genre } = req.body;

    Serie.create({ name, resume, rating, genre })
    .then((response) => {
        console.log(response);
        res.redirect("/series");
    })
    .catch((error) => console.log(error));
});


// EDIT SERIE ROUTES
router.get("/editar-serie/:serieId", (req, res, next) => {
    // ensureLogin.ensureLoggedIn(), checkAdmin
    const { serieId } = req.params;
    let genreArr = [
        "Ação",
        "Animação",
        "Aventura",
        "Comédia",
        "Comédia romantica",
        "Cult",
        "Documentário",
        "Drama",
        "Espionagem",
        "Erótico",
        "Fansatia",
        "Faroeste",
        "Ficção científica",
        "Série",
        "Guerra",
        "Musical",
        "Policial",
        "Romance",
        "Suspense",
        "Terror",
        "Trash",
        ];


    Serie
        .findById(serieId)
        .then(serie => {
            genreArr = genreArr.filter(elem => !serie.genre.includes(elem))
            res.render("serie/edit-serie", { serie, user: req.user, genreArr });
        })
        .catch(error => console.log(error))
    });

    router.post('/editar-serie/:serieId', (req, res, next) => {
    const {
        name,
        rating,
        resume,
        genre
    } = req.body;

    const {
        serieId
    } = req.params;

    Serie.findByIdAndUpdate(serieId, {
        $set: {
            name,
            rating,
            resume,
            genre
        }
    }, { new: true }
    )
    .then(response => {
        console.log(response);
        res.redirect(`/serie/${serieId}`)
    })
    .catch(error => console.log(error))
    });

  // DELETE ROUTES
router.get('/delete-serie/:serieId', (req, res, next) => {
  // ensureLogin.ensureLoggedIn(), checkAdmin,

    const { serieId } = req.params;
    Serie.findByIdAndDelete(serieId)
        .then(response => {
        res.redirect('/series')
        })
        .catch(error => console.log(error))
})

// filter routes

router.post("/series/search", (req, res, next) => {
    let { search, genre } = req.body;

    let genreArr = [
    "Ação",
    "Animação",
    "Aventura",
    "Comédia",
    "Comédia romantica",
    "Cult",
    "Documentário",
    "Drama",
    "Espionagem",
    "Erótico",
    "Fansatia",
    "Faroeste",
    "Ficção científica",
    "Série",
    "Guerra",
    "Musical",
    "Policial",
    "Romance",
    "Suspense",
    "Terror",
    "Trash",
    ];
    if (!genre) {
        Serie.find({
            name: { $regex: search, $options: "i" },
        })
        .sort({ rating: -1 })
        .then((series) => {
            let buscado = "Buscado";
            res.render("serie/series", {
                series,
                genreArr,
                user: req.user,
                buscado,
                search,
            });
        })
        .catch((error) => console.log(error));
    return;
    }

    Serie.find({
        genre: { $in: genre},
        name: { $regex: search, $options: "i" },
    })
    .sort({ rating: -1 })
    .then((series) => {
        let buscado = "Buscado";
        res.render("serie/series", {
            series,
            genreArr,
            user: req.user,
            buscado,
            search,
        });
    })
    .catch((error) => console.log(error));
});

module.exports = router;
