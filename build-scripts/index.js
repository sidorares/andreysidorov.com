var fs = require('fs');
var hljs = require('highlight.js');
var slug = require('slug');
var runHandlers = require('./fence-run-handlers.js');
var uuid = require('uuid');
var path = require('path');
var pug = require('pug');
var mkdirp = require('mkdirp');
var cp = require('child_process');

var postTemplate = pug.compile(fs.readFileSync(__dirname + '/templates/blog_post.jade'));

var sha1 = function(s) {
  var crypto = require('crypto');
  var shasum = crypto.createHash('sha1');
  shasum.update(s);
  return shasum.digest('hex');
};

var render = function(markdown, callback) {
  var asyncQueue = [];

  var meta = (md, level = 1) => {
    const originalFence = md.renderer.rules.fence;
    md.renderer.rules.fence = function(tokens, idx, options, env, slf) {
      var token = tokens[idx];
      var langLine = token.info;
      var [lang, ...params] = langLine.split(' ');
      var handler = runHandlers[lang];
      if (lang == 'json' && idx == 0) {
        env.meta = JSON.parse(token.content);
        return '';
      } else if (handler) {
        var id = uuid.v4();
        asyncQueue.push([id, token.content, handler(token.content, params), langLine, lang, params]);
        return id;
      }
      return originalFence(tokens, idx, options, env, slf);
    };
  };

  var permalink = `<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`;

  var md = require('markdown-it')({
    typographer: true,
    highlight: function(str, lang) {
      var langParts = lang.trim().split(/:/);
      lang = langParts[0];
      try {
        return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + '</code></pre>';
      } catch (__) {}
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  })
    .use(meta)
    .use(require('markdown-it-katex'))
    .use(require('markdown-it-title'))
    .use(require('markdown-it-emoji'))
    .use(require('markdown-it-abbr'))
    .use(require('markdown-it-footnote'))
    .use(require('markdown-it-anchor'), { slugify: slug, permalink: true, permalinkBefore: true, permalinkSymbol: permalink })
    .use(require('markdown-it-classy'))
    .use(require('markdown-it-container'), 'classname', {
      validate: name => name.trim().length,
      render: (tokens, idx) => {
        if (tokens[idx].nesting === 1) {
          return `<div class="${tokens[idx].info.trim()}">\n`;
        } else {
          return '</div>\n';
        }
      }
    });

  var env = {};
  var html = md.render(markdown, env);
  if (env.title) {
    env.title = env.title.split(permalink).join('');
  }

  Promise.all(asyncQueue.map(v => v[2]))
    .then(values => {
      var fenceToSvg = {};
      for (var i = 0; i < values.length; ++i) {
        html = html.replace(asyncQueue[i][0], values[i]);
        fenceToSvg[asyncQueue[i][0]] = {
          src: asyncQueue[i][1],
          svg: values[i],
          lang: asyncQueue[i][3]
        };
      }
      callback(null, html, env, fenceToSvg);
    })
    .catch(function(err) {
      console.log(err.message);
      console.log(err);
      process.exit(-1);
    });
};

function pushToGHPages() {
  console.log('Done!');
  return;
  try {
    cp.execSync('git add . && git commit -am "--skip-ci CI test"', { cwd: __dirname + '/build' });
    cp.execSync('git push origin gh-pages', { cwd: __dirname + '/build' });
  } catch (e) {
    console.log(e.message);
    console.log(e);
  }
}

var finder = require('findit2');
var srcDir = path.join(__dirname, '../src');
var buildDir = path.join(__dirname, '/build');
var srcTree = finder(srcDir);

/*
cp.execSync('rm -rf ' + __dirname + '/build');
cp.execSync('git config --global user.email "sidorares@yandex.com"');
cp.execSync('git config --global user.name "Andrey Sidorov"');
cp.execSync('git clone -b gh-pages --depth 10 --single-branch https://$GITHUB_TOKEN:x-oauth-basic@github.com/sidorares/andreysidorov.com.git ' + __dirname + '/build');
*/

var renderedFiles = [];
var pendingFiles = 0;

srcTree.on('file', function(file, stat, linkPath) {
  pendingFiles++;

  console.log('============ srcTree', file, pendingFiles);

  var pushWhenReady = function() {
    pendingFiles--;
    if (pendingFiles === 0) {
      var sortedByDate = renderedFiles.sort((p1, p2) => {
        return new Date(p2.env.meta.date) - new Date(p1.env.meta.date);
      });
      renderedFiles = sortedByDate;

      renderedFiles.forEach(function(item) {
        var templateName = item.env.meta.templateName || 'blog_post';
        var template = pug.compile(fs.readFileSync(__dirname + '/templates/' + templateName + '.jade'));
        var html = template({
          path: item.path,
          compiledMarkdown: item.compiledMarkdown,
          originalMarkdown: item.originalMarkdown,
          env: item.env,
          items: renderedFiles,
          thisPost: item
        });

        var fullFileName = path.join(buildDir, item.path.slice(1));
        fs.writeFileSync(fullFileName, html);
      });
      pushToGHPages();
    }
  };

  var fileLocalPart = file.slice(srcDir.length - file.length);
  var buildFilePath = path.join(buildDir, path.dirname(fileLocalPart));

  fs.readFile(file, function(err, content) {
    if (file.slice(-3) == '.md') {
      render(content.toString(), function(err, html, env, fenceToSvg) {
        if (!env.meta) {
          env.meta = {};
        }
        if (!env.meta.date) {
          env.meta.date = new Date().toISOString();
        }
        if (!env.meta.templateName) {
          templateName = 'blog_post';
        }

        mkdirp(buildFilePath, function(err) {
          //var destTmpFileName = path.join(buildFilePath, '.cache', path.basename(fileLocalPart));
          //var destDir = path.join(buildFilePath, path.basename(fileLocalPart));
          //fs.writeFile(destFileName + '.html', post, pushWhenReady);

          // convert svg to png
          //var proc = cp.exec('convert -density 1200 -resize 800 svg:-  -', function(err, png) {
          //proc.stdin.end(svg);

          // TODO: use slug
          var fileName = env.meta.fileName ? env.meta.fileName : path.basename(file) + '.html';

          renderedFiles.push({
            path: path.join(path.dirname(fileLocalPart), fileName),
            srcFilePath: file,
            dstDir: buildFilePath,
            env: env,
            compiledMarkdown: html,
            originalMarkdown: content.toString(),
            fenceMap: fenceToSvg
          });
          pushWhenReady();
        });
      });
    } else {
      mkdirp(buildFilePath, function(err) {
        var destFileName = path.join(buildFilePath, path.basename(fileLocalPart));
        fs.writeFile(destFileName, content, pushWhenReady);
      });
    }
  });
});
