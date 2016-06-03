var fs = require('fs');
var hljs = require('highlight.js'); // https://highlightjs.org/

var runHandlers = require('./fence-run-handlers.js');

// Actual default values
var md = require('markdown-it')({
  typographer: true,
  highlight: function (str, lang) {
    var langParts = lang.trim().split(/:/);
    lang = langParts[0];
    var langParams = langParts.slice(1);
    if (runHandlers[lang]) {
      try {
        return runHandlers[lang](str, langParams);
      } catch (e) {
        console.error(e);
        console.log(e.stdout);
        process.exit(-1);
      }
    } else if (lang && hljs.getLanguage(lang)) {
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

var ex1 = require('fs').readFileSync(__dirname + '/ex1.md', 'utf8');


var body = md.render(ex1);

var html = `
<html>
  <head>
    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
    <link rel="stylesheet" href="http://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css" >
    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.4.0/styles/tomorrow-night-eighties.min.css">
    <style>

      svg.railroad-diagram {
          //background-color: hsl(30,20%,95%);
      }
      svg.railroad-diagram path {
          stroke-width: 3;
          stroke: black;
          fill: rgba(0,0,0,0);
      }
      svg.railroad-diagram text {
          font: bold 14px monospace;
          text-anchor: middle;
      }
      svg.railroad-diagram text.diagram-text {
          font-size: 12px;
      }
      svg.railroad-diagram text.diagram-arrow {
          font-size: 16px;
      }
      svg.railroad-diagram text.label {
          text-anchor: start;
      }
      svg.railroad-diagram text.comment {
          font: italic 12px monospace;
      }
      svg.railroad-diagram g.non-terminal text {
          /*font-style: italic;*/
      }
      svg.railroad-diagram rect {
          stroke-width: 3;
          stroke: black;
          fill: hsl(120,100%,90%);
      }
      svg.railroad-diagram path.diagram-text {
          stroke-width: 3;
          stroke: black;
          fill: white;
          cursor: help;
      }
      svg.railroad-diagram g.diagram-text:hover path.diagram-text {
          fill: #eee;
      }

      article {
        max-width: 55rem;
        margin-left: auto;
        margin-right: auto;
        padding: 3rem 0.75rem;
        text-align: justify;
      }

      .markdown-body pre {
        background-color: transparent;
      }

      pre.hljs {
        background-color: #303030;
      }
      pre:not(.hljs) {
        background-color: transparent;
        text-align: center;
      }

      pre:not(.hljs) svg {
        width: 100%;
        max-height: 600px;
      }

    </style>
  </head>
  <body class='markdown-body'>
    <article>
      ${body}
      <div id="disqus_thread"></div>
    </article>
    <script>
      /**
      * RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
      * LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
      */
      /*
      var disqus_config = function () {
        this.page.url = "https://andreysidorov.com"; // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = "index"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
      };
      */
      (function() { // DON'T EDIT BELOW THIS LINE
      var d = document, s = d.createElement('script');
        s.src = '//andreysidorov.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
      })();
    </script>
    <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
  </body>
</html>
`;

console.log(html);
html = html.replace(/<pre>removeme<\/pre>/g, '');
fs.writeFileSync('out.html', html);
//return;

var cp = require('child_process');
cp.execSync('git config --global user.email "sidorares@yandex.com"');
cp.execSync('git config --global user.name "Andrey Sidorov"');
cp.execSync('git clone -b gh-pages --depth 10 --single-branch https://$GITHUB_TOKEN:x-oauth-basic@github.com/sidorares/andreysidorov.com.git ' + __dirname + '/build');
require('fs').writeFileSync(__dirname + '/build/index.html', html);
cp.execSync('git commit -am "--skip-ci CI test" && git push origin gh-pages', { cwd: __dirname + '/build'});
