const express = require('express');

const { ensureAuthenticated } = require('../utils/authenticate');
const { mongoose } = require('../db/mongoose');
const { Whiskey } = require('../models/whiskey');

const router = express.Router();

// GET /
router.get('/', (req, res) => {
  res.render('index', { title: 'Whiskey Journal' });
});

// GET user whiskey journal
router.get('/homepage', ensureAuthenticated, (req, res) => {
  res.render('index', { title: 'Whiskey Journal' });
});

// GET all whiskeys in db to display
router.get('/whiskeys', ensureAuthenticated, async (req, res) => {
  try {
    const whiskeys = await Whiskey.find({ _creator: req.user._id });
  
    res.send({ whiskeys })
  } catch(e) {
    res.status(400).send(e);
  }
});

module.exports = router;
