const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../middlewares/auth.middleware");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/same", isNotAuthenticated, (req, res, next) => {
  res.render("same");
});

router.get("/signup", isNotAuthenticated, (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const thisUsername = req.body.username;
  const thisPassword = req.body.password;

  const hashedPW = bcrypt.hashSync(thisPassword);

  User.create({
    username: thisUsername,
    password: hashedPW,
  })
    .then((savedUser) => {
      console.log(savedUser);
      res.redirect("/login");
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

router.get("/login", isNotAuthenticated, (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const thisUsername = req.body.username;
  const thisPassword = req.body.password;

  User.findOne({
    username: thisUsername,
  })
    .then((foundUser) => {
      if (foundUser) {
        const samePW = bcrypt.compareSync(thisPassword, foundUser.password);
        if (samePW) {
          req.session.user = foundUser;
          res.redirect("/profile");
        } else {
          res.send("Try Again! Wrong Password");
        }
      } else {
        res.send("no User found");
      }
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

router.get("/main", isAuthenticated, (req, res, next) => {
  console.log('main page')
  res.render("main");
  
});

router.get("/private", isAuthenticated, (req, res, next) => {
  res.render("private");
  console.log('private page')
});

router.get("/profile", (req, res, next) => {
  if (req.session.user) {
    res.render("profile", { username: req.session.user.username });
    console.log('profile page')
  } else {
    res.render("profile", { username: "Stranger" });
    console.log('Stranger is roaming')
  }
});

module.exports = router;
