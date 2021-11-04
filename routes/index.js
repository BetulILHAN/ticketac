var express = require('express');
var router = express.Router();

var journeyModel = require('../models/journeys')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Ticketac' });
});

/* Page homepage */
router.get('/homepage', function(req, res, next) {
  res.render('homepage', { title: 'Ticketac' });
});

/* Page travels */
router.get('/travels', function(req, res, next) {
  res.render('travels', { title: 'Ticketac' });
});

/* Page unvailable */
router.get('/unvailable', function(req, res, next) {
  res.render('unvailable', { title: 'No train available' });
});

/* Page orders */
router.get('/orders', function(req, res, next) {
  res.render('orders', { title: 'My Tickets' });
});

/* Page lasttravel */
router.get('/last-travel', function(req, res, next) {
  res.render('lasttravel', { title: 'My Last Trips' });
});


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});

module.exports = router;
