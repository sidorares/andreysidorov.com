var cp = require('child_process');
var fs = require('fs');

var svgoRules = '--enable=removeComments --enable=removeMetadata --enable=removeDimensions --enable=convertColors';

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
  return cp.execSync('gnuplot | svgo ' + svgoRules + ' -i - -o -', {input: pragma + input});
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
  cp.execSync('mermaid -s ' + tmpinput + ' -o ' + path.dirname(tmpinput));
  var svg = cp.execSync('svgo -i ' + tmpinput + '.svg --enable=removeComments --enable=removeMetadata --enable=removeDimensions --enable=convertColors -o -');
  // remove svg style
  svg = svg.replace(/style="width[^"]+/, '');
  return svg;
};
