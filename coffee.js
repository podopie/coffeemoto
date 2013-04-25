
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
  Template.results.helpers({
    cup_1_array: function() {
      var tf_idf = {};
      tf_idf = {};
      Tastings.find().forEach(function(i) {
        total = Cuppings.find().count();
        t = Cuppings.find({'cup' : {$in : ['1', '5', '9']}, 'tastes' : i.taste}).count();
        d = Cuppings.find({'tastes' : i.taste}).count() + 1;
        idf = Math.log(total/d);
        tf_idf[i.taste] = idf * t;
      })
      var sortable = [];
      for (var word in tf_idf) {
        sortable.push([word, tf_idf[word]])
        sortable.sort(function(a, b) {return a[1] - b[1]})
      }
      uniques = [];
      for (i in sortable) {
        if (sortable[i][1] > 6) {uniques.push(sortable[i][0])}
      }
      unique_limit = []
      unique_limit.push(uniques[uniques.length - 1])
      unique_limit.push(uniques[uniques.length - 2])
      unique_limit.push(uniques[uniques.length - 3])
      return unique_limit;
    },
    cup_2_array: function() {
      var tf_idf = {};
      tf_idf = {};
      Tastings.find().forEach(function(i) {
        total = Cuppings.find().count();
        t = Cuppings.find({'cup' : {$in : ['2', '6', '10']}, 'tastes' : i.taste}).count();
        d = Cuppings.find({'tastes' : i.taste}).count() + 1;
        idf = Math.log(total/d);
        tf_idf[i.taste] = idf * t;
      })
      var sortable = [];
      for (var word in tf_idf) {
        sortable.push([word, tf_idf[word]])
        sortable.sort(function(a, b) {return a[1] - b[1]})
      }
      uniques = [];
      for (i in sortable) {
        if (sortable[i][1] > 6) {uniques.push(sortable[i][0])}
      }
      unique_limit = []
      unique_limit.push(uniques[uniques.length - 1])
      unique_limit.push(uniques[uniques.length - 2])
      unique_limit.push(uniques[uniques.length - 3])
      return unique_limit;
    },
    cup_3_array: function() {
      var tf_idf = {};
      Tastings.find().forEach(function(i) {
        total = Cuppings.find().count();
        t = Cuppings.find({'cup' : {$in : ['3', '7', '11']}, 'tastes' : i.taste}).count();
        d = Cuppings.find({'tastes' : i.taste}).count() + 1;
        idf = Math.log(total/d);
        tf_idf[i.taste] = idf * t;
      })
      var sortable = [];
      for (var word in tf_idf) {
        sortable.push([word, tf_idf[word]])
        sortable.sort(function(a, b) {return a[1] - b[1]})
      }
      uniques = [];
      for (i in sortable) {
        if (sortable[i][1] > 6) {uniques.push(sortable[i][0])}
      }
      unique_limit = []
      unique_limit.push(uniques[uniques.length - 1])
      unique_limit.push(uniques[uniques.length - 2])
      unique_limit.push(uniques[uniques.length - 3])
      return unique_limit;
    },
    cup_4_array: function() {
      var tf_idf = {};
      tf_idf = {};
      Tastings.find().forEach(function(i) {
        total = Cuppings.find().count();
        t = Cuppings.find({'cup' : {$in : ['4', '8', '12']}, 'tastes' : i.taste}).count();
        d = Cuppings.find({'tastes' : i.taste}).count() + 1;
        idf = Math.log(total/d);
        tf_idf[i.taste] = idf * t;
      })
      var sortable = [];
      for (var word in tf_idf) {
        sortable.push([word, tf_idf[word]])
        sortable.sort(function(a, b) {return a[1] - b[1]})
      }
      uniques = [];
      for (i in sortable) {
        if (sortable[i][1] > 6) {uniques.push(sortable[i][0])}
      }
      unique_limit = []
      unique_limit.push(uniques[uniques.length - 1])
      unique_limit.push(uniques[uniques.length - 2])
      unique_limit.push(uniques[uniques.length - 3])
      return unique_limit;
    }
  })


  Template.results.cuppings_results = function () {
    var arr = {};
    Tastings.find().forEach(function(i) {
      console.log(i.taste);
      arr[i.taste] = {};
      arr[i.taste]['overall'] = [];
      arr[i.taste]['aroma'] = [];
      arr[i.taste]['acidity'] = [];
      arr[i.taste]['body'] = [];
      Cuppings.find({"tastes" : i.taste }).forEach(function(j) {

        arr[i.taste]['overall'].push(j.impressions.overall);
        arr[i.taste]['overall'].average = 0;

        arr[i.taste]['aroma'].push(j.impressions.aroma)
        arr[i.taste]['aroma'].average = 0;

        arr[i.taste]['acidity'].push(j.impressions.acidity)
        arr[i.taste]['acidity'].average = 0;

        arr[i.taste]['body'].push(j.impressions.body)
        arr[i.taste]['body'].average = 0;

      })

      for (j in arr[i.taste]['overall']) {
        arr[i.taste]['overall'].average = arr[i.taste]['overall'].average + arr[i.taste]['overall'][j]
      }
      for (j in arr[i.taste]['aroma']) {
        arr[i.taste]['aroma'].average = arr[i.taste]['aroma'].average + arr[i.taste]['aroma'][j]
      }
      for (j in arr[i.taste]['acidity']) {
        arr[i.taste]['acidity'].average = arr[i.taste]['acidity'].average + arr[i.taste]['acidity'][j]
      }
      for (j in arr[i.taste]['body']) {
        arr[i.taste]['body'].average = arr[i.taste]['body'].average + arr[i.taste]['body'][j]
      }
      arr[i.taste]['overall'].average = arr[i.taste]['overall'].average / arr[i.taste]['overall'].length / 2;
      arr[i.taste]['aroma'].average = arr[i.taste]['aroma'].average / arr[i.taste]['aroma'].length / 2;
      arr[i.taste]['acidity'].average = arr[i.taste]['acidity'].average / arr[i.taste]['acidity'].length / 2;
      arr[i.taste]['body'].average = arr[i.taste]['body'].average / arr[i.taste]['body'].length / 2;
    });

    /*
    var margin = {top: 10, right: 10, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var x = d3.scale.linear()
    .domain(tastes_corpus.map(function(d) { return d; }))
    .range([0, width]);

    var y = d3.scale.linear()
    .domain([0,100])
    .range([height,0]);

    data = {};

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
    */
    return Cuppings.find({}, {sort: {user : 1}});
  };

  Template.results.events({
  })



  Template.home.events({
    'click .btn-adddata' : function () {
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
    },
    'click .btn-results' : function() {
      console.log('clicked');
      CoffeeMoto.showTemplate($('.template-visible'), 'results', true,function() {
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
