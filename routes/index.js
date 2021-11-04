var express = require('express');
var router = express.Router();

var journeyModel = require('../models/journeys')
var userModel = require('../models/users')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.err) {
    res.render('login', { title: 'Ticketac', error : req.session.err })
  } else {
  
  res.render('login', { title: 'Express', error : "" });
}});
  

/* Page homepage */
router.get('/homepage', function(req, res, next) {
  
  res.render('homepage', { title: 'Homepage' });
});

/* Bouton go Page homepage */
router.post('/go', async function(req, res, next) {
  var searchJourney = await journeyModel.find({
    departure: req.body.inputdeparture,
    arrival: req.body.inputdestination,
    date: req.body.inputdate
  })
console.log(searchJourney);
  if(searchJourney == true){
    req.session.user = {
      departure: searchJourney.departure,
      arrival: searchJourney.arrival,
      date: searchJourney.date
    }
    res.redirect('/travels')
  } else {
    res.redirect('/unvailable')
  };
});

/* Page travels */
router.get('/travels', async function(req, res, next) {
  var getJourney = await journeyModel.find()
  res.render('travels', { title: 'Travels available' });
});

router.post('/sign-in', async function(req, res, next) {

  useralreadyexist= await userModel.findOne({ Email: req.body.email, Password:req.body.password });
 
 if(useralreadyexist != null){
  req.session.user = {Email :useralreadyexist.email, id: useralreadyexist._id};
  res.redirect('/homepage')}
else {
res.redirect('/')}

});


router.post('/sign-up',async function(req, res, next) {
  emailalreadyexist = await userModel.findOne({Email : req.body.email});
  
  if (emailalreadyexist != null) {
    req.session.err = "utilisateur déjà crée";
    res.redirect('/');
 
}

    else {
      var newUser = new userModel({
        Name: req.body.name,
        Firstname : req.body.firstname,
        Email:  req.body.email,
        Password:req.body.password,
      });
      var newUserSaved = await newUser.save();
      req.session.user = {email: newUserSaved.email, id: newUserSaved._id};
      res.redirect('/homepage')}
});

/* Bouton ok Page travels */
router.get('/ok', function(req, res, next) {
  res.redirect('/orders');
});

/* Bouton home Page unvailable */
router.post('/home', function(req, res, next) {
  res.redirect('/homepage');
});

/* Bouton home last travel / */
router.post('/home2', function(req, res, next) {
  res.redirect('/homepage');
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
// router.get('/save', async function(req, res, next) {

//   // How many journeys we want
//   var count = 300

//   // Save  ---------------------------------------------------
//     for(var i = 0; i< count; i++){

//     departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
//     arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

//     if(departureCity != arrivalCity){

//       var newUser = new journeyModel ({
//         departure: departureCity , 
//         arrival: arrivalCity, 
//         date: date[Math.floor(Math.random() * Math.floor(date.length))],
//         departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
//         price: Math.floor(Math.random() * Math.floor(125)) + 25,
//       });
       
//        await newUser.save();

//     }

//   }
//   res.render('login', { title: 'Express' });
// });

module.exports = router;