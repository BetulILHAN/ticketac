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

if(searchJourney.length == 0) {
  res.redirect('/unvailable');}    
else {
res.render('travels', {title: 'Homepage', searchJourney})}
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
  req.session.user = {Email :useralreadyexist.email, userId: useralreadyexist._id};
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
      req.session.user = {email: newUserSaved.email, userId: newUserSaved._id};
      res.redirect('/homepage')}
});




/* Page unvailable */
router.get('/unvailable', function(req, res, next) {
  res.render('unvailable', { title: 'No train available' });
});

/* Page orders */
router.get('/orders', async function(req, res, next) {
  
//  console.log("pageorders", req.query);
//   var date = new Date(req.query.inputdate);
//   var departure = req.query.inputdeparture;
//   var arrival = req.query.inputdestination;

  var searchJourney = await journeyModel.findById(req.query.id);
  console.log("recherche trajet",searchJourney);
  // var date = new Date(req.query.inputdate);
   if (req.session.panier == undefined){
    req.session.panier =[];
   }

   req.session.panier.push(
searchJourney
    // departure: req.query.inputdeparture,
    // arrival: req.query.inputdestination,
    // date,
    // departureTime:req.query.inputdepartureTime,
    // price: req.query.inputprice,
    // id: req.query.id,
)
  res.render('orders', { title: 'My Tickets', panier :req.session.panier });
});

/* Bouton confirm Page unvailable */
router.post('/confirm', function(req, res, next) {
  res.redirect('/homepage');
});

/* Page lasttravel */
router.get('/last-travel', async function(req, res, next) {

//   var newUserJourney = new userModel.findOne( { _id : req.session.userId} );
// console.log(newUserJourney);

  var currentUser = await userModel.findById(req.session.user.userId);
  console.log('coucou', req.session.user.userId);
  req.session.panier.forEach(el =>currentUser.userJourney.push(el._id) )

  userSaved = await currentUser.save();
  var user = await userModel.findOne( { _id : req.session.user.userId} ).populate("userJourney").exec();
  // req.session.panier = []; 
  console.log('hola', user);

  res.render('lasttravel', { title: 'My Last Trips', panier: req.session.panier });
});

module.exports = router;