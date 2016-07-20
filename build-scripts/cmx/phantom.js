var fs = require('fs');
var page = require('webpage').create();
var url = './cmx.html';

// TODO: figure out why on linux errors withh 'Unable to open file \'/dev/stdin\'\n' 
//var file = fs.read('/dev/stdin');

var system = require('system');
var args = system.args;
var filePath = args[1]; 
var file = fs.read(filePath);

page.open(url, function (status) {

  // TODO figure out correct order of events
  setTimeout(function() {

  var content = page.evaluate(function(s) {
    var cmx = window.cmx;
    var parser = new cmx.Parser('cmx');
    var scenes = parser.parseMarkup(s);
    var $s = $('#renderhere');
    for (var i=0; i < scenes.length; ++i) {
      scenes[i].materialize($s);
    }
    var nodes = document.querySelectorAll('svg');
    var res = '<div style="overflow: auto">';
    for (var i=0; i < nodes.length; ++i) {
      res += '<div class="cmx-scene">' + nodes[nodes.length - i - 1].parentNode.innerHTML + '</div>';
    }
    return res + '</div>';
  }, file);
  console.log(content);
  phantom.exit();
 
  }, 100);
});
