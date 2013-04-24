var transpose = function() {
  Cuppings.find().forEach(function(i) {
    data.push(cursor[i])
  })
}

// negative words. each count adds -1 to alignment score
var neg  = [
      'bitter', 'bland', 'briny', 'flat',
      'harsh',
      'muddy', 'pungent',
      'watery', 'weak'
]
// neutral words. I don't think these add anything for comparison
var neut = [
      'grassy', 'mellow', 'syrupy'
]
// postive words. each count adds +1 to alignment score
var pos  = [
      'buttery', 'chocolate', 'complex', 'floral', 'fruity',
      'herbal', 'full', 'light', 'lively', 'rich', 'smooth',
      'strong', 'sweet'
]
var compareArray = function(a, b) {
  // Takes two arrays and compares them. Spits out a numerical value
  // 0 means the arrays contain the same data
  // Distance represents similarity between different users
  var distance = 0;
  for (i in a) {
    if (b.indexOf(a[i]) > -1) {
    } else {
      distance += 1; // open to interpretation here, might diversify
    }
  }
  return distance;
}
var countAlignment = function(a) {
  // alignment contibutes to love/hate
  alignment = (compareArray(a, neg) * -1) + compareArray(a, pos)
}
