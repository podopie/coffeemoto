/* Development settings

env = "dev-test"   // add in test data
env = "destroy"     // kill all test data

*/

var env = "dev-test"

/* 
  Server Side. Set up cuppings collection for Mongo

  cuppings structure

  _id     : cupping doc id
  ISOdate : yup
  user    : email address of who recorded their coffee tasting
  cup     : cup value, just a number (1, 2, 3, 4)
  taste   : array of tastes they selected for this cup. Let's
            limit the number of tastes to five at max.
  prep    : how that cup was prepped: espresso, pourover, aeropress

*/


Cuppings = new Meteor.Collection("cuppings");
Tastings = new Meteor.Collection("tastings");

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "All the coffee tasting!";
  };
  Template.hello.cuppings = function () {
    return Cuppings.find({}, {sort: {user : 1}})
  }

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'

      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  // Run on startup
  // For now, just generate a few users in the doc
  // Also we fill in some tastings at random
  Meteor.startup(function () {
    var tastes_corpus = ['bold', 'spice', 'fruit', 'acidic', 'bitter', 'flowers', 'bold', 'tea', 'chocolate', 'just coffee'];
    if (Tastings.find().count() === 0) {
      for (var i = 0; i < tastes_corpus.length; i++) {
        Tastings.insert({
          taste: tastes_corpus[i]
        });
      }
    }
    if (env == "dev-test" && Cuppings.find().count() === 0) {
      var users = ["Aggie Add",
                  "Blockey Block",
                  "Christopher Cares",
                  "Dangerous Dubs"];
      for (var i = 0; i < users.length; i++) {
        Cuppings.insert({
          user: users[i],
          cup: 1,
          tastes: [tastes_corpus[i + 1], tastes_corpus[i + 3]]
        });
      }
    } else if (env == "destroy") {
      Cuppings.find().forEach(function(cupping) {
        Cuppings.remove(cupping._id)
      })
    }
  });
}
