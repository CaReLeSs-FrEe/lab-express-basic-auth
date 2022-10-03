const isAuthenticated = (req, res, next) => {
    if(req.session.user) {
        next();
    }
    else {
        res.redirect("/login");
    }
}

const isNotAuthenticated = (req, res, next) => {
    if(req.session.user) {
        res.redirect("/profile")
    }
    else {
        next();
    }
}

module.exports = {
    isAuthenticated,
    isNotAuthenticated
  }