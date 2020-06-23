const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth.js');

const Story = require('../models/Story');

// @desc    Login\Landing
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', { layout: 'login-layout' }); // Login has a "special" layout bec. we don't want the <nav> to show.
});

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render('dashboard', { name: req.user.firstName, stories });
  } catch (error) {
    console.error(`PROBLEM!: ${error}`);
    res.render('error/500', { error });
  }


});

module.exports = router;