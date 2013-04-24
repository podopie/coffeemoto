
CoffeeMoto = {
  color1: '',
  color2: '',
  color3: '',
  showTemplate: function(current,templatename,hidecurrent,callback) {
    var existing = $('.template-' + templatename);
    if (!existing.length) {
      var details = $(Meteor.render(Template[templatename]));
      var wrapper = $('<div class="template-wrapper template-' + templatename + '">');
      if (hidecurrent)
        current.parent().append(wrapper);
      else
        current.append(wrapper);
      wrapper.append(details);
      existing = wrapper;
    }
    if (hidecurrent) {
      current.on('webkitTransitionEnd',function(e)
      {
        CoffeeMoto.setAvatarColors();
        current.removeClass('template-previsible');
        existing.addClass('template-previsible');
        existing.addClass('template-visible');
        if (typeof callback == 'function')
          callback();
      });
      current.removeClass('template-visible');
    }
    else {
      existing.addClass('template-previsible');
      existing.addClass('template-visible');
      if (typeof callback == 'function')
        callback();
    }
  },
  setAvatarColors: function() {
    var avatar = $('.avatar');
    avatar.find('.color1').addClass('color-' + this.color1);
    avatar.find('.color2').addClass('color-' + this.color2);
    avatar.find('.color3').addClass('color-' + this.color3);
  }
};

/* Development settings

env = "dev-test"   // add in test data
env = "destroy"     // kill all test data

*/

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
    return Tastings.find({}, {sort: {user : 1}});
  };

  Template.taste_words.cuppings = function () {
    return Cuppings.find({}, {sort: {user : 1}});
  };

  Template.home.events({
    'click .btn-brewinfo' : function (e) {
      e.preventDefault();
      CoffeeMoto.showTemplate($('.template-visible'),'brewing',true,function() {
        $('.btn-drip').one('click',function() {
          console.log('got here');
          CoffeeMoto.showTemplate($('.template-visible'),'brew_drip',true);
        });
        $('.btn-espresso').one('click',function() {
          console.log('got here1');
          CoffeeMoto.showTemplate($('.template-visible'),'brew_espresso',true);
        });
        $('.btn-steaming').one('click',function() {
          console.log('got here2');
          CoffeeMoto.showTemplate($('.template-visible'),'brew_steaming',true);
        });

        $('body').one('click','.back-btn',function(e) {
          CoffeeMoto.showTemplate($('.template-visible'),'brewing',true);
          console.log('got a click');
        });

      });
    },
    'click .btn-adddata' : function (e) {
      e.preventDefault();
      // randomize avatar colors
      CoffeeMoto.color1 = Math.floor(Math.random()*7);
      CoffeeMoto.color2 = Math.floor(Math.random()*7);
      CoffeeMoto.color3 = Math.floor(Math.random()*7);
      CoffeeMoto.showTemplate($('.template-visible'),'add_data',true,function() {
        $('.user_name').keypress(function(e) {
          if (e.keyCode == 13) {
            e.preventDefault();
            $('.begin').trigger('click');
          }
        });
        $('.begin').click(function(e) {
          e.preventDefault();
          var name = $('.user_name').val();
          CoffeeMoto.showTemplate($('.template-visible'),'add_cupping',true,function() { 
            $('.avatarspace .name').text(name);
            $('.template-add_cupping').on('click','.cuppingoptions .btn',function(e) {
                console.log('got here');
                e.preventDefault();
                $('.avatarspace .tastes').text('Coffee #' + $(this).text().trim());
                CoffeeMoto.showTemplate($('.template-cupping'),'impressions',true);
            });
            $('.template-add_cupping').on('click','.impressions .btn',function(e) {
              e.preventDefault();
              var item = $(this);
              if (item.hasClass('btn-yes'))
                item.next().removeClass('selected');
              else
                item.prev().removeClass('selected');
              item.addClass('selected');
              // check to see if we've checked everything
              var buttons = $('.btn').filter('.selected');
              if (buttons.filter('.overall').length && buttons.filter('.aroma').length && buttons.filter('.acidity').length && buttons.filter('.body').length) {
                $('.impressions-finalize').removeClass('inactive');
              }
              else
                $('.impressions-finalize').addClass('inactive');
            });
            $('.template-add_cupping').on('click','.impressions-finalize',function(e) {
              if (!$(this).hasClass('inactive')) {
                CoffeeMoto.showTemplate($('.template-impressions'),'taste_words',true);
              }
            });
            $('.template-add_cupping').on('click','.template-taste_words .btn',function(e) {
              e.preventDefault();
              $(this).toggleClass('selected');
              $('.btn-finalize').removeClass('inactive');
            });
            $('.template-add_cupping').on('click','.btn-finalize',function(e) {
              if (!$(this).hasClass('inactive')) {

                // add in data logic here, the cuppings insert
                var name = $('.name').text();
                var cupSelected = $('.tastes').text().split('#')[1];

                impressionSelections = [];

                if ($('.selected.overall').hasClass('btn-yes')) {
                  impressionSelections.push(1);
                } else {
                  impressionSelections.push(0);
                }
                if ($('.selected.aroma').hasClass('btn-yes')) {
                  impressionSelections.push(1);
                } else {
                  impressionSelections.push(0);
                }
                if ($('.selected.acidity').hasClass('btn-yes')) {
                  impressionSelections.push(1);
                } else {
                  impressionSelections.push(0);
                }
                if ($('.selected.body').hasClass('btn-yes')) {
                  impressionSelections.push(1);
                } else {
                  impressionSelections.push(0);
                }
                var selectedTastes = $('.taste.selected').map(function() { return $(this).text(); });
                var arr = [];
                selectedTastes.each(function(i) { arr.push(selectedTastes[i]); });

                Cuppings.insert({
                  user: name, //entered_name,
                  ISOdate: new Date(),
                  cup: cupSelected, //cup_int
                  tastes: arr, //tastings, //tastes from this template
                  impressions: { // from impressions object
                    overall: impressionSelections[0],
                    aroma: impressionSelections[1],
                    acidity: impressionSelections[2],
                    body: impressionSelections[3]
                  }
                });

                Cuppings.find().forEach(function(i) {console.log(i); });

                CoffeeMoto.showTemplate($('.template-add_cupping'),'thanks',true,function() {
                  $('.template-thanks .btn').click(function(e) {
                    e.preventDefault();
                    document.location.href = '/';
                  });
                });
              }
            });
            CoffeeMoto.showTemplate($('.template-add_cupping'),'cupping',false);
          });
        });
      });
    }
  });

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
  });
}
