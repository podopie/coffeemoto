/* Development settings

env = "dev-test"   // add in test data
env = "destroy"     // kill all test data

*/

var env = "dev-test"
var flavors = flavors || []; // testing what variables need to be used through a cupping

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
  
  Template.taste_words.tastings = function () {
    return Tastings.find({}, {sort: {user : 1}})
  }

/*
  Template.enter_name.events({
    'click input.add':function(e) {
      if(e.keyIdentifier == 'Enter' || e.keyIdentifier == undefined) {
        var entered_name = document.getElementById('user_name').value;
      }
    }
  })
  Template.coffee_type.events({

  })
  Template.impressions.events({
    'click input.impression': function(e) {
      var impressions = impressions || [];
      var key = e.getAttribute("data-type");
      var value = document.getElementById('')
    }
  })
*/
  Template.taste_words.events({
  'click input.flavor': function(e) {
    flavors.push(e.srcElement.value);
    console.log(flavors);
  },
  // let's just assume that it's going to be a complete/finalize button
  'click input.finalize': function(e) {
      if(e.keyIdentifier == 'Enter' || e.keyIdentifier == undefined) {
        

        Cuppings.insert({
          user: document.getElementById('user_name').value, //entered_name,
          cup: 1, //cup_int
          tastes: flavors, //tastes from this template
          impressions: { // from impressions object
            overall: 1,
            aroma: 0,
            acidity: 1,
            body: 0
          }
        })

      }
    }
  })
}
if (Meteor.isServer) {
  // Run on startup
  // For now, just generate a few users in the doc
  // Also we fill in some tastings at random
  Meteor.startup(function () {
    var tastes_corpus = [
      'bitter', 'bland', 'briny', 'buttery', 'chocolate',
      'complex', 'flat', 'floral', 'fruity', 'grassy',
      'harsh', 'herbal', 'full', 'light', 'lively',
      'mellow', 'muddy', 'pungent', 'rich', 'smooth',
      'strong', 'sweet', 'syrupy', 'watery', 'weak'
    ];
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
      Tastings.find().forEach(function(tasting) {
        Tastings.remove(tasting._id)
      })
    }
  });
}
