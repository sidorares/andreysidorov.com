var cp = require('child_process');
var fs = require('fs');
var path = require('path');
var tmp = require('tmp');

var exec = function(cmdline, stdin) {
  return new Promise(function(resolve, reject) {
    var proc = cp.exec(cmdline, function(err, out) {
      resolve(out);
    });
    proc.stdin.end(stdin);
  });
};

var svgoRules = '--enable=removeComments --enable=removeMetadata --enable=removeDimensions --enable=convertColors --enable=convertPathData';

module.exports.shaky = function(input) {
  return Promise.resolve('skipped');
  var shaky = require('shaky');
  var svg = shaky(input, 'svg').toString();
  return exec('svgo ' + svgoRules + ' -i - -o -', svg);
};

module.exports['tmp-file'] = function(input, params) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(params[0], input, resolve);
  });
};

module.exports['run-dot'] = function(input) {
  return exec('dot -T svg | svgo ' + svgoRules + ' -i - -o -', input);
};

module.exports['run-gnuplot'] = function(input) {
  return new Promise(function(resolve, reject) {
    var pragma = `
      set term svg mouse jsdir "http://gnuplot.sourceforge.net/demo_svg_4.6/"\n
    `;
    var proc = cp.exec('gnuplot | svgo ' + svgoRules + ' -i - -o -', { input: pragma + input }, function(err, svg) {
      var svg = svg.toString().replace(/<path fill="#fff" stroke="#000" onclick/, '<path fill="transparent" stroke="transparent" onclick');
      resolve(svg);
    });
    proc.stdin.end(pragma + input);
  });
};

module.exports.railroad = function(input) {
  var rr = require('./rr.js');
  var vm = require('vm');
  var res = vm.runInNewContext(input, rr);
  var svg = res.toString();
  return exec('svgo ' + svgoRules + ' -i - -o -', svg);
};

module.exports['run-latex'] = function(input) {
  return Promise.resolve('skipped');
  //var prefix = "\\documentclass[landscape,a5paper,11pt]{article}\n" +
  //  "\\usepackage{tikz}\n" +
  //  "
  //  "\\begin{document}\n";
  var prefix = '';
  return new Promise(function(resolve, reject) {
    tmp.file(function _tempFileCreated(err, tmpinput, fd, cleanupCallback) {
      fs.writeFile(tmpinput + '.tex', prefix + input, function(err) {
        // TODO: async
        cp.execSync('latex --output-directory=' + path.dirname(tmpinput) + ' ' + tmpinput + '.tex');
        var svg = cp.execSync('dvisvgm --no-fonts --exact ' + tmpinput + '.dvi -s');
        resolve(svg.toString());
        //var svgo = cp.execSync('svgo -i - ' + svgoRules + ' -o -', {input: svg});
        //resolve(svgo.toString());
        cleanupCallback();
      });
    });
  });
};

module.exports['run-css'] = function(input) {
  // TODO: validate css?
  return Promise.resolve(`
    <style>
       ${input}
    </style>
  `);
};

module.exports['run-cmx'] = function(input) {
  const makeCmx = require('./cmx/puppeteer.js');
  return makeCmx(input);
};

module.exports.mermaid = function(input) {
  // TODO: async
  var tmp = require('tmp');
  var tmpinput = tmp.fileSync().name;
  var path = require('path');
  var binDir = path.join(__dirname, '../node_modules/.bin');
  fs.writeFileSync(tmpinput, input);
  cp.execSync('mmdc -i ' + tmpinput + ' -o ' + tmpinput + '.svg');
  var svg = cp.execSync('svgo -i ' + tmpinput + '.svg ' + svgoRules + ' -o -');
  svg = svg.toString().replace(/style="width[^"]+/, '');
  return Promise.resolve(svg);
};
