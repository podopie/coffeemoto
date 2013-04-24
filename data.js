/// DATA!

var w = ['bitter', 'grassy', 'buttery', 'weak']
var x = ['complex', 'bitter', 'rich', 'fruity']
var y = ['complex', 'muddy', 'weak', 'rich']
var z = ['muddy', 'fruity', 'red', 'purple', 'pink', 'plain']

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

// Something more automated?
// use impressions "alignment" of coffee to further emphaisize between 
// data sets. each impression is really -/+ so this should be straight forward
// "alignment" can go between -3 to +3 (I think, gotta confirm with Nick)