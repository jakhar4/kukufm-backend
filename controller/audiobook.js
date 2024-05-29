const express = require('express');
const Audiobook = require('../models/audiobook');
const User = require('../models/user');
const { getAudiobook } = require('../middleware');


// create a new audiobook
exports.createAudioBook = async (req, res) => {
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const { title, author, description, genre, duration, publishedDate} = req.body;
  const tmp1 = getRandomNumber(500, 600);
  const tmp2 = getRandomNumber(500, 600);
  const coverImage = `https://picsum.photos/${tmp1}/${tmp2}`

  const audiobook = new Audiobook({
    title, author, description, genre, coverImage, duration,
    publishedDate: req.body.publishedDate || Date.now()
  });

  try {
    const newAudiobook = await audiobook.save();
    res.status(201).json(newAudiobook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// get all audiobooks
exports.getAudioBooks = async (req, res) => {
  try {
    const audiobooks = await Audiobook.find();
    res.json(audiobooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get a specific audiobook
exports.getAudioBooksById = (req, res) => {
  res.json(req.audiobook);
};


// add a review to an audiobook

exports.giveReviews = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(req.body);

    const { review, rating } = req.body;
    const userId = user._id;

    // review exist alreadyb or not
    const existingReviewIndex = req.audiobook.reviews.findIndex(
      (review) => review.userId.toString() === userId.toString()
    );

    if (existingReviewIndex !== -1) {
      // update review
      req.audiobook.reviews[existingReviewIndex].review = review;
      req.audiobook.reviews[existingReviewIndex].rating = rating;
    } else {
      // add review
      const newReview = {
        userId: user._id,
        userName: user.firstName + ' ' + user.lastName,
        review,
        rating,
      };
      req.audiobook.reviews.push(newReview);
    }

    //avg
    const totalReviews = req.audiobook.reviews.length;
    const newAverageRating = req.audiobook.reviews.reduce((accumulate, current) => accumulate + current.rating, 0) / totalReviews;
    
    req.audiobook.rating = newAverageRating;

    const updatedAudiobook = await req.audiobook.save();
    res.json(updatedAudiobook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// filterAudiobooks---------------------------
exports.filterAudiobooks = async (req, res) => {
  // console.log('reached here')
  const { author, genre } = req.body;
  try {
      let filter = {};
      if (author) filter.author = author;
      if (genre) filter.genre = genre;
      console.log('Filter:', filter); 
      const filteredAudiobooks = await Audiobook.find(filter);
      res.json(filteredAudiobooks);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// searchAudiobooks-----------------------
exports.searchAudiobooks = async(req,res) => {
  try {
    const query =req.body.query;
    if(!query){
      return res.status(400).json({ message:'Search query is required' })
    }
    const results = await Audiobook.find({
      $or:[
        {title: {$regex:query, $options: 'i'}},
        {author: {$regex: query, $options: 'i'}},
        {genre: {$regex: query, $options: 'i'}}
      ]
    });
    
    res.json(results)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
