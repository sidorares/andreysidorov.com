module.exports.shaky = function (input) {
  var shaky = require('shaky');
  return '<img src="' + shaky(input) + '""/>\n';
};

module.exports['run-dot'] = function(input) {
  var cp = require('child_process');
  return cp.execSync('dot -T svg', {input: input })
}
