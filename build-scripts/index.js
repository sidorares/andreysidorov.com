var fs = require('fs');
var hljs = require('highlight.js');
var slug = require('slug');
var runHandlers = require('./fence-run-handlers.js');
var uuid = require('uuid');

var pug = require('pug');
var postTemplate = pug.compile(fs.readFileSync(__dirname + '/templates/blog_post.jade'));

var render = function(markdown, callback) {

  var asyncQueue = [];

  var meta = (md, level = 1) => {
    const originalFence = md.renderer.rules.fence
    md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
      var token = tokens[idx];
      var langLine = token.info;
      var [lang, ...params] = langLine.split(' ');
      var handler = runHandlers[lang];
      if (lang == 'json' && idx == 0) {
        env.meta = JSON.parse(token.content);
        return '';
      } else if (handler) {
        var id = uuid.v4();
        asyncQueue.push([id, token.content, handler(token.content, params), lang]);
        return id;
      }
      return originalFence(tokens, idx, options, env, slf);
    }
  }

  var permalink = `
  <svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>
  `;

  var md = require('markdown-it')({
    typographer: true,
    highlight: function (str, lang) {
      var langParts = lang.trim().split(/:/);
      lang = langParts[0];
      try {
          return '<pre class="hljs"><code>' +
                 hljs.highlight(lang, str, true).value +
                 '</code></pre>';
      } catch (__) {}
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  })
   .use(meta)
   .use(require('markdown-it-katex'))
   .use(require('markdown-it-title'))
   .use(require('markdown-it-anchor'), { slugify: slug, permalink: true, permalinkBefore: true, permalinkSymbol: permalink})
   .use(require('markdown-it-classy'))
   .use(require('markdown-it-container'));

  var env = {};
  var body = md.render(ex1, env);
  var html = body;
  console.log(body);

  Promise.all(asyncQueue.map( v => v[2] ) ).then((values) => {
    for (var i=0; i<values.length; ++i) {
      html = html.replace(asyncQueue[i][0], values[i])
    }
    console.log(env);
    var post = postTemplate({postBody: html, meta: env.meta});
    //fs.writeFileSync('out.html', post);
    callback(null, post);
  }).catch(function(err) {
    console.log(err.message); // some coding error in handling happened
    console.log(err);
    process.exit(-1);
  });

  function isPending(p) {
    var util = require('util');
    return util.inspect(p) == 'Promise { <pending> }';
  };

  setInterval(function() {
    console.log('==============================');
    asyncQueue.map(function(qqq) {
      console.log(qqq[0], isPending(qqq[2]), qqq[3]);
    });
  }, 2000);
}


var ex1 = require('fs').readFileSync(__dirname + '/../src/test.md', 'utf8');
render(ex1, function(err, html) {
  console.log(html);
  var cp = require('child_process');
  cp.execSync('git config --global user.email "sidorares@yandex.com"');
  cp.execSync('git config --global user.name "Andrey Sidorov"');
  cp.execSync('git clone -b gh-pages --depth 10 --single-branch https://$GITHUB_TOKEN:x-oauth-basic@github.com/sidorares/andreysidorov.com.git ' + __dirname + '/build');
  require('fs').writeFileSync(__dirname + '/build/example.html', html);
  cp.execSync('git commit -am "--skip-ci CI test" && git push origin gh-pages', { cwd: __dirname + '/build'});
});
