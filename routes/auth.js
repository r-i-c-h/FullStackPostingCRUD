const express = require('express');
const router = express.Router();
const passport = require('passport');

// @desc    Auth With Google strategy defined in passport.js file
// @route   GET /auth/google/
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc    Auth Callback
// @route   GET /auth/google/callback
router.get('/google/callback',
  passport.authenticate('google',
    { failureRedirect: '/' } // auth fail
  ),
  (req, res) => { // Successful authentication
    res.redirect('/dashboard');
  }
);

// @desc    Logout
// @route   GET /auth/logout/
router.get('/logout', (req, res) => {
  // passport automagically adds a req.logout function
  req.logout()
  res.redirect('/')
});


module.exports = router;