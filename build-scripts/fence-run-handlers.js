var cp = require('child_process');
var fs = require('fs');
var path = require('path');

var svgoRules = '--enable=removeComments --enable=removeMetadata --enable=removeDimensions --enable=convertColors';

module.exports.shaky = function (input) {
  var shaky = require('shaky');
  return '<img src="' + shaky(input) + '""/>\n';
};

module.exports['tmp-file'] = function (input, params) {
  fs.writeFileSync(params[0], input);
  return '<pre>removeme</pre>';
}

module.exports['run-dot'] = function (input) {
  return cp.execSync('dot -T svg | svgo ' + svgoRules + ' -i - -o -', {input: input});
};

module.exports['run-gnuplot'] = function (input) {
  var pragma = `
    set term svg mouse jsdir "http://gnuplot.sourceforge.net/demo_svg_4.6/"\n
  `;
  console.log(cp.execSync('gnuplot -V').toString());
  console.log('=======================');
  console.log(pragma + input);
  console.log('=======================');
  var svg = cp.execSync('gnuplot | svgo ' + svgoRules + ' -i - -o -', {input: pragma + input});
  svg = svg.toString().replace(/<path fill="#fff" stroke="#000" onclick/, '<path fill="transparent" stroke="transparent" onclick');
  return svg;
};

module.exports.railroad = function (input) {
  var rr = require('./rr.js');
  var vm = require('vm');
  var res = vm.runInNewContext(input, rr);
  var svg = res.toString();
  svgo = cp.execSync('svgo ' + svgoRules + ' -i - -o -', {input: svg});
  return svgo;
};

module.exports['run-latex'] = function (input) {
  //var prefix = "\\documentclass[landscape,a5paper,11pt]{article}\n" + 
  //  "\\usepackage{tikz}\n" +
  //  "
  //  "\\begin{document}\n";
  var prefix="";

  var tmp = require('tmp');
  var tmpinput = tmp.fileSync().name;
  console.log(tmpinput);
  fs.writeFileSync(tmpinput + '.tex', prefix + input); // + '\n \\end{document}');
  cp.execSync('latex --output-directory=' + path.dirname(tmpinput) + ' ' + tmpinput + '.tex');
  var svg = cp.execSync('dvisvgm ' + tmpinput + '.dvi -s').toString();
  console.log(svg);
  var svgo = cp.execSync('svgo -i - ' + svgoRules + ' -o -', {input: svg});
  console.log(svgo.toString());
  return svgo.toString();
}  

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
  svg = svg.toString().replace(/style="width[^"]+/, '');
  return svg;
};
