var cp = require('child_process');

module.exports.shaky = function (input) {
  var shaky = require('shaky');
  return '<img src="' + shaky(input) + '""/>\n';
};

module.exports['run-dot'] = function (input) {
  return cp.execSync('dot -T svg', {input: input});
};

module.exports['run-gnuplot'] = function (input) {
  var pragma = `
    set term svg mouse jsdir "http://gnuplot.sourceforge.net/demo_svg_4.6/"
  `;
  return cp.execSync('gnuplot', {input: pragma + input});
};

module.exports.railroad = function (input) {
  var rr = require('railroad-diagrams');
  var vm = require('vm');
  var res = vm.runInNewContext(input, rr);
  return res.toString();
};
