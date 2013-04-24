var data = []

var transpose = function() {
  Cuppings.find().forEach(function(i) {
    data.push(cursor[i])
  })
}