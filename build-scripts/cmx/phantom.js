var fs = require('fs');
var page = require('webpage').create();
var url = './cmx1.html';

var file = fs.read('/dev/stdin');

page.open(url, function (status) {
  var content = page.evaluate(function(s) {
    var cmx = window.cmx;
    var parser = new cmx.Parser('cmx');
    var scenes = parser.parseMarkup(s);
    //return scenes.length;
    //return document.querySelector('svg').parentNode.innerHTML;
    var $s = $('#renderhere');
    for (var i=0; i < scenes.length; ++i) {
      scenes[i].materialize($s);
    }
    //return "<div>" + document.querySelectorAll('svg').map(function(s) {
    //  return s.parentNode.innerHTML;
    //}).join('') + "</div>";
    //return "<div>" + document.querySelector('svg').parentNode.parentNode.parentNode.parentNode.innerHTML + "</div>";
    var nodes = document.querySelectorAll('svg');
    //return nodes.length;
    var res = '<div style="overflow: auto">';
    for (var i=0; i < nodes.length; ++i) {
      res += '<div class="cmx-scene">' + nodes[nodes.length - i - 1].parentNode.innerHTML + '</div>';
    }
    return res + '</div>';
  }, file);

  console.log(content);
  phantom.exit();
});
