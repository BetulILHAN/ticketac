var express = require('express');
var router = express.Router();

var journeyModel = require('../models/journeys')
var userModel = require('../models/users')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.searchJourney == undefined){
    req.session.searchJourney = []
  }
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
  
var date = new Date(req.body.inputdate);
var departure = req.body.inputdeparture;
var arrival = req.body.inputdestination;


  var searchJourney = await journeyModel.find({
    departure, arrival, date
  })
console.log(searchJourney);
res.render('travels', {searchJourney})
});

/* Page travels */
router.get('/travels', async function(req, res, next) {
//   req.session.searchJourney.push({
//     departure: req.query.inputdeparture,
//      arrival: req.query.inputdestination,
//     date: req.query.inputdate,
//     departureTime:req.query.inputdepartureTime,
//     price: req.query.price
    
// })
  res.render('travels', { title: 'Travels available', searchJourney });
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
// router.get('/ok', async function(req, res, next) {
//   var date = new Date(req.body.inputdate);
// var departure = req.body.inputdeparture;
// var arrival = req.body.inputdestination

//   var searchJourney = await journeyModel.find({
//     departure, arrival, date
//   })
// console.log(searchJourney);
//   res.redirect('/orders', {searchJourney});
// });

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
router.get('/orders', async function(req, res, next) {
 
  var date = new Date(req.query.inputdate);
  var departure = req.query.inputdeparture;
  var arrival = req.query.inputdestination;

  var searchJourney = await journeyModel.find({
  date,departure, arrival});
  var date = new Date(req.query.inputdate);
 searchJourney.push({
    departure: req.query.inputdeparture,
    arrival: req.query.inputdestination,
    date,
    departureTime:req.query.inputdepartureTime,
    price: req.query.inputprice
    
})
  res.render('orders', { title: 'My Tickets', searchJourney });
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