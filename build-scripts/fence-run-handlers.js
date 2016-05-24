var cp = require('child_process');
var fs = require('fs');

module.exports.shaky = function (input) {
  var shaky = require('shaky');
  return '<img src="' + shaky(input) + '""/>\n';
};

module.exports['run-dot'] = function (input) {
  return cp.execSync('dot -T svg | svgo -i - -o -', {input: input});
};

module.exports['run-gnuplot'] = function (input) {
  var pragma = `
    set term svg mouse jsdir "http://gnuplot.sourceforge.net/demo_svg_4.6/"
  `;
  return cp.execSync('gnuplot | svgo -i - -o -', {input: pragma + input});
};

module.exports.railroad = function (input) {
  var rr = require('./rr.js');
  var vm = require('vm');
  var res = vm.runInNewContext(input, rr);
  return res.toString();
};

module.exports.mermaid = function (input) {
  var tmp = require('tmp');
  var tmpinput = tmp.fileSync().name;
  var path = require('path');
  var binDir = path.join(__dirname , '../node_modules/.bin');
  console.log(cp.execSync('ls -l ' + binDir).toString());
  console.log(tmpinput, input, binDir, 'mermaid -s ' + tmpinput, {cwd: __dirname + '/../node_modules/.bin' });
  fs.writeFileSync(tmpinput, input);
  cp.execSync('mermaid -s ' + tmpinput);
  return fs.readFileSync(tmpinput + '.svg', 'utf8');
};
