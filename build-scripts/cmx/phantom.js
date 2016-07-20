var fs = require('fs');
var page = require('webpage').create();
var url = './cmx.html';

var file = fs.read('/dev/stdin');

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
