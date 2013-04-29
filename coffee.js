// Coffeemoto functions. Mostly visual functions for making it easier to set up
// the way we wanted to the app presented.
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
  },
  generateUniques: function(cupping_array) {
    var tf_idf = {};
    Tastings.find().forEach(function(i) {
      total = Cuppings.find().count();
      t = Cuppings.find({'cup' : {$in : cupping_array}, 'tastes' : i.taste}).count();
      d = Cuppings.find({'tastes' : i.taste}).count() + 1;
      idf = Math.log(total/d);
      tf_idf[i.taste] = idf * t;
    })
    var sortable = [];
    for (var word in tf_idf) {
      sortable.push([word, tf_idf[word]]);
      sortable.sort(function(a, b) {return a[1] - b[1]});
    }
    unique_limit = []
    unique_limit.push(sortable[sortable.length - 1][0])
    unique_limit.push(sortable[sortable.length - 2][0])
    unique_limit.push(sortable[sortable.length - 3][0])
    return unique_limit;
  }
};

/* Server Side. Set up cuppings collection for Mongo

  cuppings structure
  _id            : cupping doc id
  ISOdate       : yup
  user          : email address of who recorded their coffee tasting
  cup           : cup value, just a number (1, 2, 3, 4)
  impressions   : object, 0 or 1 for each "impression" ta
  taste         : array of tastes they selected for this cup.

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
      return CoffeeMoto.generateUniques(['1', '5', '9']);
    },
    cup_2_array: function() {
      return CoffeeMoto.generateUniques(['2', '6', '10']);
    },
    cup_3_array: function() {
      return CoffeeMoto.generateUniques(['3', '7', '11']);
    },
    cup_4_array: function() {
      return CoffeeMoto.generateUniques(['4', '8', '12']);
    }
  })

  Template.results.rendered = function() {
    var arr = {};
    var impressions = ['overall', 'aroma', 'acidity', 'body'];

    Tastings.find().forEach(function(i) {
      arr[i.taste] = {};

      for (k in impressions) {
        arr[i.taste][impressions[k]] = [];
      }

      Cuppings.find({"tastes" : i.taste }).forEach(function(j) {
        for (k in impressions) {
          arr[i.taste][impressions[k]].push(j.impressions[impressions[k]]);
          arr[i.taste][impressions[k]].average = 0;
        }
      })

      for (k in impressions) {
        for (j in arr[i.taste][impressions[k]]) {
          arr[i.taste][impressions[k]].average = arr[i.taste][impressions[k]].average + arr[i.taste][impressions[k]][j]
        }
      }

      for (k in impressions) {
        arr[i.taste][impressions[k]].average = arr[i.taste][impressions[k]].average / arr[i.taste][impressions[k]].length / 2;
      }

    });

    var datum = [{
      name: "overall",
      values: []
    }, {
      name: "aroma",
      values: []
    }, {
      name: "acidity",
      values: []
    }, {
      name: "body",
      values: []
    }];

    for (k in impressions) {
      var count = 0;
      for (i in arr) {
        count += 1;
        datum[k].values[count] = {
        x : i, y : arr[i][impressions[k]].average
        }
      }
    }

    for (i in datum) {
      datum[i].values.shift();
    }

    var stack = d3.layout.stack()
        .values(function(d) { return d.values}),
        layers = stack(datum);

    var margin = {top: 40, right: 10, bottom: 20, left: 10},
        width = $(window).width() - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .domain(Tastings.find().map(function(i) {return i.taste}))
        .rangeRoundBands([0, width], .01);

    var y = d3.scale.linear()
        .domain([0, 4])
        .range([height, 0]);

    var color = d3.scale.linear()
        .domain([0, 4])
        .range(["#351E10", "#7B7B72"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .tickPadding(6)
        .orient("bottom");

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layer = svg.selectAll(".layer")
        .data(layers)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) { return color(i); });

    var rect = layer.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("width", x.rangeBand())
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y);} )

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  }

  Template.results.events({
  })

  Template.home.events({
    'click .btn-brewinfo' : function (e) {
      e.preventDefault();
      CoffeeMoto.showTemplate($('.template-visible'),'brewing',true,function() {
        $('.btn-drip').one('click',function() {
          CoffeeMoto.showTemplate($('.template-visible'),'brew_drip',true);
        });
        $('.btn-espresso').one('click',function() {
          CoffeeMoto.showTemplate($('.template-visible'),'brew_espresso',true);
        });
        $('.btn-steaming').one('click',function() {
          CoffeeMoto.showTemplate($('.template-visible'),'brew_steaming',true);
        });
        $('body').one('click','.back-btn',function(e) {
          CoffeeMoto.showTemplate($('.template-visible'),'brewing',true);
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
                var name = $('.name').text(),
                  cupSelected = $('.tastes').text().split('#')[1],
                  impressionSelections = [],
                  impressionPossibles = ['overall', 'aroma', 'acidity', 'body'];

                for (k in impressionPossibles) {
                  if ($('.selected.' + impressionPossibles).hasClass('btn-yes')) {
                    impressionSelections.push(1);
                  } else {
                    impressionSelections.push(0);
                  }
                }

                var selectedTastes = $('.taste.selected').map(function() { return $(this).text(); });
                var arr = [];
                selectedTastes.each(function(i) { arr.push(selectedTastes[i]); });
		/*
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
		*/
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
      CoffeeMoto.showTemplate($('.template-visible'), 'results', true,function() {
        $('#chart').show();
      });
    }

  });

}

if (Meteor.isServer) {
  // Run on startup
  Meteor.startup(function () {
    var tastingWords = [
      'bitter', 'bland', 'briny', 'buttery', 'chocolate',
      'complex', 'flat', 'floral', 'fruity', 'grassy',
      'harsh', 'herbal', 'full', 'light', 'lively',
      'mellow', 'muddy', 'pungent', 'rich', 'smooth',
      'strong', 'sweet', 'syrupy', 'watery', 'weak'
    ];
    if (Tastings.find().count() === 0) {
      for (var i = 0; i < tastingWords.length; i++) {
        Tastings.insert({
          taste: tastingWords[i]
        });
      }
    }
  });
}
