var hljs = require('highlight.js'); // https://highlightjs.org/

// Actual default values
var md = require('markdown-it')({
  typographer: true,
  highlight: function (str, lang) {
    //console.log('==== LANG: === ' + lang + '====== INPUT: ' + str);
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})
 .use(require('markdown-it-katex'))
 .use(require('markdown-it-container'));

var ex1 = require('fs').readFileSync(__dirname + '/ex1.md');


var body = (md.render(
[
   '  **thiis _test_ , yeah** '
 , '  ```js'
 , '    var a = console.log(\'test\');'
 , "  ```"
 , "  # Math Rulez! \n  $\\sqrt{3x-1}+(1+x)^2$ "
 , '  test' ].join('\n') + ex1
));

var html = `
<html>
  <head>
    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
    <link rel="stylesheet" href="http://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css" >
    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.4.0/styles/tomorrow-night-eighties.min.css">
    <style>
      article {
        max-width: 42rem;
        margin-left: auto;
        margin-right: auto;
        padding: 3rem 0.75rem;
        text-align: justify;
      }
      pre.hljs {
        background-color: #303030;
      }
    </style>
  </head>
  <body class='markdown-body'>
    <article>
    ${body}
    </article>
  </body>
</html>
`;

var cp = require('child_process');
cp.execSync('git clone -b gh-pages --depth 1 --single-branch https://$GITHUB_TOKEN:x-oauth-basic@github.com/sidorares/andreysidorov.com.git ' + __dirname + '/build');
require('fs').writeFileSync(__dirname + '/build/index.html', html);
cp.execSync('git commit -am "CI test" && git push origin gh-pages', { cwd: __dirname + '/build'});
