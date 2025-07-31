module.exports = {
  isLoggedIn(req, res, next) {
    if (req.session && req.session.userId) {
      next()
    } else {
      res.redirect('/users/login')
    }
  },

  isNotLoggedIn(req, res, next) {
    if (!req.session || !req.session.userId) {
      next()
    } else {
      res.redirect('/home')
    }
  }
}
