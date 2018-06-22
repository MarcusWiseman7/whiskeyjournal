const express = require('express');
const { ObjectId } = require('mongodb');

const { ensureAuthenticated } = require('../utils/authenticate');
const { mongoose } = require('../db/mongoose');
const { Whiskey } = require('../models/whiskey');

const router = express.Router();

// POST new whiskey to db
router.post('/', ensureAuthenticated, async (req, res) => {
  const whiskey = new Whiskey(req.body);
  
  whiskey.set({ _creator: req.user._id });

  try {
    await whiskey.save();
    res.redirect('/homepage');
  } catch(e) {
    res.status(400).send(e);
  }
});

// GET whiskey by id to edit/show
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  
  if (!ObjectId.isValid(id)) return res.status(404).send();

  try {
    const whiskey = await Whiskey.findById(id);

    if (!whiskey) return res.status(404).send();

    res.send({ whiskey });
  } catch(e) {
    res.status(400).send(e);
  }
});

// DELETE whiskey from db
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) return res.status(404).send();

  try {
    const whiskey = await Whiskey.findByIdAndRemove(id);
    
    if (!whiskey) return res.status(404).send();

    res.send({ whiskey });
  } catch(e) {
    res.status(400).send(e);
  }
});

// PATCH update whiskey in db
router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  
  if (!ObjectId.isValid(id)) return res.status(404).send();

  try {
    const whiskey = await Whiskey.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    
    if (!whiskey) return res.status(404).send();

    res.send({ whiskey });
  } catch(e) {
    res.status(400).send(e);
  }
});

module.exports = router;
