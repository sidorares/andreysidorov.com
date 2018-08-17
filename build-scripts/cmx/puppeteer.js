const puppeteer = require('puppeteer');
const fs = require('fs');

const script = fs.readFileSync(__dirname + '/cmx.js', 'utf-8');

const file = `
`;

module.exports = async sceneSource => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(`<div id='renderhere'></div>`);
  await page.addScriptTag({ content: script });
  const result = await page.evaluate(function(s) {
    var cmx = window.cmx;
    var parser = new cmx.Parser('cmx');
    var scenes = parser.parseMarkup(s);
    var $s = $('#renderhere');
    for (var i = 0; i < scenes.length; ++i) {
      scenes[i].materialize($s);
    }
    var nodes = document.querySelectorAll('svg');
    var res = '<div style="overflow: auto">';
    for (var i = 0; i < nodes.length; ++i) {
      res += '<div class="cmx-scene">' + nodes[nodes.length - i - 1].parentNode.innerHTML + '</div>';
    }
    return res + '</div>';
  }, sceneSource);
  await browser.close();
  return result;
};
