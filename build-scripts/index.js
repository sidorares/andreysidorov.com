var fs = require('fs');
var hljs = require('highlight.js'); // https://highlightjs.org/

var runHandlers = require('./fence-run-handlers.js');

// Actual default values
var md = require('markdown-it')({
  typographer: true,
  highlight: function (str, lang) {
    if (runHandlers[lang]) {
      try {
        return runHandlers[lang](str);
      } catch (e) {
        console.error(e);
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

//console.log(html);
//return;

var cp = require('child_process');
cp.execSync('git config --global user.email "sidorares@yandex.com"');
cp.execSync('git config --global user.name "Andrey Sidorov"');
cp.execSync('git clone -b gh-pages --depth 10 --single-branch https://$GITHUB_TOKEN:x-oauth-basic@github.com/sidorares/andreysidorov.com.git ' + __dirname + '/build');
require('fs').writeFileSync(__dirname + '/build/index.html', html);
cp.execSync('git commit -am "--skip-ci CI test" && git push origin gh-pages', { cwd: __dirname + '/build'});
